import { fetchSubstream, createHash } from "@substreams/core";
import { run, logger, cli } from "substreams-sink";
import pkg from "./package.json";
import { collectDefaultMetrics, listen, setDefaultLabels } from "./src/server";
import { handleClock, handleManifest, handleOperations } from "./src/metrics";
export * from "./src/metrics";
export * from "./src/server";

logger.setName(pkg.name);
export { logger };

// default user options
export const DEFAULT_ADDRESS = 'localhost';
export const DEFAULT_PORT = 9103;
export const TYPE_NAME = "pinax.substreams.sink.prometheus.v1.PrometheusOperations"
export const DEFAULT_COLLECT_DEFAULT_METRICS = true;

export interface ActionOptions extends cli.RunOptions {
    address: string;
    port: number;
    labels: Object;
    collectDefaultMetrics: boolean;
}

export function handleLabels(value: string, previous: {}) {
    const params = new URLSearchParams(value);
    return { ...previous, ...Object.fromEntries(params) };
}

export async function action(options: ActionOptions) {
    const spkg = await fetchSubstream(options.manifest!);

    const hash = await createHash(spkg.toBinary());
    logger.info("download", { manifest: options.manifest!, hash });

    // Initialize Prometheus server
    if (options.collectDefaultMetrics) collectDefaultMetrics(options.labels);
    if (options.labels) setDefaultLabels(options.labels);
    listen(options.port, options.address);

    // Run Substreams
    const substreams = run(spkg, moduleName, options);
    handleManifest(substreams, manifest, hash);
    substreams.on("anyMessage", handleOperations)
    substreams.on("clock", handleClock);
    substreams.start(options.delayBeforeStart);
}