import client from "prom-client";
import http from "node:http";
import { logger } from "./logger";

// Prometheus Exporter
export const register = new client.Registry();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register });

// Create a local server to serve Prometheus gauges
const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': register.contentType });
    res.end(await register.metrics());
});

export async function listen(port: number, address = "localhost") {
    return new Promise(resolve => {
        server.listen(port, address, () => {
            logger.log("info", `Prometheus metrics server listening on http://${address}:${port}`);
            resolve(true);
        });
    })
}