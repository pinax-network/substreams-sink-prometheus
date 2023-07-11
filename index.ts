import { setup, commander, http } from "substreams-sink";
import { handleOperations } from "./src/metrics.js";
import pkg from "./package.json" assert { type: "json" };

export * from "./src/metrics.js";
export * from "./src/generated/pinax/substreams/sink/prometheus/v1/prometheus_pb.js";

export async function action(options: commander.RunOptions) {
    const { emitter } = await setup(options, pkg);
    emitter.on("anyMessage", message => {
        handleOperations(message);
    });
    emitter.start();
    http.listen(options);
}