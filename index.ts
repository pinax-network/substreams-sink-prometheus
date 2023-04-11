import { createHash, download } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";
import pkg from "./package.json";
import { listen } from "./src/server";
import { handleClock, handleManifest, handleOperations } from "./src/metrics";

logger.defaultMeta = { service: pkg.name };
export { logger };

// default user options
export const DEFAULT_ADDRESS = 'localhost';
export const DEFAULT_PORT = 9102;
export const TYPE_NAME = "pinax.substreams.sink.prometheus.v1.PrometheusOperations"

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
    handleManifest(substreams, manifest, hash);
    substreams.on("anyMessage", handleOperations)
    substreams.on("clock", handleClock);
    substreams.start(options.delayBeforeStart);
}