import { fetchSubstream, createHash, createModuleHash } from "@substreams/core";
import { setup, logger, commander } from "substreams-sink";

import { collectDefaultMetrics, listen, setDefaultLabels } from "./src/server.js";
import { handleClock, handleManifest, handleOperations } from "./src/metrics.js";

export * from "./src/metrics.js";
export * from "./src/server.js";
export * from "./src/generated/pinax/substreams/sink/prometheus/v1/prometheus_pb.js";

import pkg from "./package.json" assert { type: "json" };

logger.setName(pkg.name);
export { logger };

// default user options
export const DEFAULT_ADDRESS = 'localhost';
export const DEFAULT_PORT = 9103;
export const TYPE_NAME = "pinax.substreams.sink.prometheus.v1.PrometheusOperations"
export const DEFAULT_COLLECT_DEFAULT_METRICS = true;

export interface ActionOptions extends commander.RunOptions {
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

    const hash = await createModuleHash(spkg.modules!, options.moduleName);

    logger.info("download", { manifest: options.manifest!, hash: Buffer.from(hash).toString("hex") });

    // Initialize Prometheus server
    if (options.collectDefaultMetrics) collectDefaultMetrics(options.labels);
    if (options.labels) setDefaultLabels(options.labels);
    listen(options.port, options.address);

    // Run Substreams
    const substreams = await setup(options, pkg);
    handleManifest(substreams, options.manifest!, Buffer.from(hash).toString("hex"));
    substreams.on("anyMessage", (message, _, clock) => {
        handleOperations(message as any);
        handleClock(clock);
    });

    substreams.start(options.delayBeforeStart);
}