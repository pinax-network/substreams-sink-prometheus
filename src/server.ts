import client from "prom-client";
import http from "node:http";
import { logger } from "substreams-sink";

import { DEFAULT_ADDRESS } from "../index.js";

// Prometheus Exporter
export const register = new client.Registry();

// Collect default metrics
export function collectDefaultMetrics(labels: Object = {}) {
    client.collectDefaultMetrics({ register, labels });
}

// Set default labels
export function setDefaultLabels(labels: Object = {}) {
    register.setDefaultLabels(labels);
}

// Create a local server to serve Prometheus gauges
export const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': register.contentType });
    res.end(await register.metrics());
});

export async function listen(port: number, address = DEFAULT_ADDRESS) {
    return new Promise(resolve => {
        server.listen(port, address, () => {
            logger.info("prometheus server", { address, port });
            resolve(true);
        });
    })
}