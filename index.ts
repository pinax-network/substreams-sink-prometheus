import fs from "node:fs";
import { Substreams, download, unpack } from "substreams";
import { handleClock, handleOperation } from "./src/metrics";
import { listen } from "./src/server"
import { timeout } from "./src/utils";
import * as dotenv from 'dotenv'
dotenv.config()

export * from './src/metrics'

// default substreams options
export const MESSAGE_TYPE_NAME = 'pinax.substreams.sink.prometheus.v1.PrometheusOperations'
export const DEFAULT_API_TOKEN_ENV = 'SUBSTREAMS_API_TOKEN'
export const DEFAULT_OUTPUT_MODULE = 'prom_out'
export const DEFAULT_CURSOR_FILE = 'cursor.lock'
export const DEFAULT_SUBSTREAMS_ENDPOINT = 'https://mainnet.eth.streamingfast.io:443'

// default user options
export const DEFAULT_PORT = 9102
export const DEFAULT_ADDRESS = 'localhost'

export async function run(spkg: string, options: {
    // substreams options
    outputModule?: string,
    startBlock?: string,
    stopBlock?: string,
    substreamsEndpoint?: string,
    substreamsApiTokenEnvvar?: string,
    substreamsApiToken?: string,
    delayBeforeStart?: string,
    cursorFile?: string,
    
    // user options
    address?: string,
    port?: string,
} = {}) {
    // substreams options
    const outputModule = options.outputModule ?? DEFAULT_OUTPUT_MODULE
    const substreamsEndpoint = options.substreamsEndpoint ?? DEFAULT_SUBSTREAMS_ENDPOINT
    const api_token_envvar = options.substreamsApiTokenEnvvar ?? DEFAULT_API_TOKEN_ENV
    const api_token = options.substreamsApiToken ?? process.env[api_token_envvar]
    const cursorFile = options.cursorFile ?? DEFAULT_CURSOR_FILE
    
    // user options
    const port = Number(options.port ?? DEFAULT_PORT);
    const address = options.address ?? DEFAULT_ADDRESS;

    // required
    if ( !outputModule ) throw new Error('[output-module] is required')
    if ( !api_token ) throw new Error('[substreams-api-token] is required')

    // read cursor file
    let startCursor = fs.existsSync(cursorFile) ? fs.readFileSync(cursorFile, 'utf8') : "";

    // delay before start
    if ( options.delayBeforeStart ) await timeout(Number(options.delayBeforeStart) * 1000);
    
    // Download Substream from URL or IPFS
    const binary = await download(spkg);

    // Initialize Substreams
    const substreams = new Substreams(binary, outputModule, {
        host: substreamsEndpoint,
        startBlockNum: options.startBlock,
        stopBlockNum: options.stopBlock,
        startCursor,
        authorization: api_token,
    });

    // Initialize Prometheus server
    listen(port, address);

    // Find Protobuf message types from registry
    const { registry } = unpack(binary);
    const PrometheusOperations = registry.findMessage(MESSAGE_TYPE_NAME);
    if (!PrometheusOperations) throw new Error(`Could not find [${MESSAGE_TYPE_NAME}] message type`);
    
    substreams.on("clock", clock => {
        handleClock(clock);
    });

    substreams.on("mapOutput", output => {
        // Handle Prometheus Operations
        if (!output.data.value.typeUrl.match(MESSAGE_TYPE_NAME)) return;
        const decoded = PrometheusOperations.fromBinary(output.data.value.value);
        for ( const operation of decoded.operations ) {
            handleOperation(operation);
        }
    });

    substreams.on("cursor", cursor => {
        fs.writeFileSync(cursorFile, cursor);
    });

    // start streaming Substream
    await substreams.start();
}
