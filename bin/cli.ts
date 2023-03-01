#!/usr/bin/env node

import { Command } from "commander";
import { run } from "../index";
import pkg from "../package.json";
import {
    DEFAULT_API_TOKEN_ENV,
    DEFAULT_OUTPUT_MODULE,
    DEFAULT_SUBSTREAMS_ENDPOINT,
    DEFAULT_PORT,
} from "../index";

const program = new Command();
program.name('substreams-sink-prometheus')
    .version(pkg.version, '-v, --version', 'version for substreams-sink-prometheus')

program.command('run')
    .showHelpAfterError()
    .description('Push data from a Substreams `PrometheusOperations` map output to a Prometheus metrics server.')
    .argument('<spkg>', 'URL or IPFS hash of Substreams package')
    .option('-m --output-module <string>', 'Name of the output module (declared in the manifest)', DEFAULT_OUTPUT_MODULE)
    .option('-e --substreams-endpoint <string>', 'Substreams gRPC endpoint to stream data from', DEFAULT_SUBSTREAMS_ENDPOINT)
    .option('-s --start-block <int>', 'Start block to stream from (defaults to -1, which means the initialBlock of the first module you are streaming)')
    .option('-t --stop-block <string>', 'Stop block to end stream at, inclusively')
    .option('--substreams-api-token <string>', 'API token for the substream endpoint')
    .option('--substreams-api-token-envvar <string>', 'Environnement variable name of the API token for the substream endpoint', DEFAULT_API_TOKEN_ENV)
    .option('--delay-before-start <int>', '[OPERATOR] Amount of time in milliseconds (ms) to wait before starting any internal processes, can be used to perform to maintenance on the pod before actually letting it starts', '0')
    // custom options
    .option('-p --port <int>', 'Listens on port number.', String(DEFAULT_PORT))
    .option('-a --address <string>', 'Address to use', 'localhost')
    .action(run)

program.command('completion').description('Generate the autocompletion script for the specified shell')
program.command('help').description('Display help for command')
program.showHelpAfterError()
program.parse()