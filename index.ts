import { createHash, download, PrometheusOperations } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";
import pkg from "./package.json";
import { listen } from "./src/server";
import { handleOperation } from "./src/metrics";

logger.defaultMeta = { service: pkg.name };
export { logger };

// default user options
export const DEFAULT_ADDRESS = 'localhost';
export const DEFAULT_PORT = 9102;

export interface ActionOptions extends RunOptions {
    address: string;
    port: number;
}

export async function action(manifest: string, moduleName: string, options: ActionOptions) {
    // Download Substreams (or read from local file system)
    const spkg = await download(manifest);
    const hash = createHash(spkg);
    logger.info("download", {manifest, hash});

    // Initialize Prometheus server
    listen(options.port, options.address);

    // Run Substreams
    const substreams = run(spkg, moduleName, options);
    substreams.on("anyMessage", (message: PrometheusOperations) => {
        for ( const operation of message.operations ) {
            handleOperation(operation);
        }
        logger.info("anyMessage", message);
    })
    substreams.start(options.delayBeforeStart);
}