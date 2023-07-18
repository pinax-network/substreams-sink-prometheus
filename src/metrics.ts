import { Counter, Gauge } from "prom-client";
import { prometheus, logger } from "substreams-sink"
import type { AnyMessage, JsonObject, Message } from "@bufbuild/protobuf";

interface PrometheusCounter {
    name: string;
    counter: {
        operation: string;
        value: number;
    }
    labels?: any;
}

interface PrometheusGauge {
    name: string;
    gauge: {
        operation: string;
        value: number;
    }
    labels?: any;
}

export function handleOperations(message: JsonObject): void
export function handleOperations(message: Message<AnyMessage>): void
export function handleOperations(message: JsonObject | Message<AnyMessage>) {
    for (const operation of (message as any)?.operations || []) {
        // convert message to JSON
        handleOperation(operation.toJson ? operation.toJson() : operation);
    }
}

export function handleOperation(promOp: any) {
    if (promOp?.gauge) handleGauge(promOp);
    else if (promOp?.counter) handleCounter(promOp);
    // else if (promOpKeys.includes("summary")) handleSummary(promOp);
    // else if (promOpKeys.includes("histogram")) handleHistogram(promOp);
}

export function handleCounter(promOp: PrometheusCounter) {
    const name = promOp.name;
    let labels = promOp.labels ?? {};
    let { operation, value } = promOp.counter;

    // register
    if (!prometheus.registry.getSingleMetric(name)) {
        prometheus.registerCounter(name, "custom help", Object.keys(labels ?? {})); // TO-DO!
    }
    const counter = prometheus.registry.getSingleMetric(promOp.name) as Counter;

    // provide empty object if no value is provided
    if (labels) counter.labels(labels);
    else labels = {};

    // handle prometheus metrics
    switch (operation) {
        case "OPERATION_INC": counter.labels(labels).inc(); break;
        case "OPERATION_ADD": counter.labels(labels).inc(value); break;
        case "OPERATION_REMOVE": counter.remove(labels); break;
        case "OPERATION_RESET": counter.reset(); break;
        default: return; // SKIP
    }
    logger.info("counter", { name, labels, operation, value });
}

export function handleGauge(promOp: PrometheusGauge) {
    const name = promOp.name;
    let labels = promOp.labels ?? {};
    let { operation, value } = promOp.gauge;

    // register
    if (!prometheus.registry.getSingleMetric(name)) {
        prometheus.registerGauge(name, "custom help", Object.keys(labels)); // TO-DO!
    }
    const gauge = prometheus.registry.getSingleMetric(name) as Gauge;

    // provide empty object if no value is provided
    if (labels) gauge.labels(labels);
    else labels = {};

    // handle prometheus metrics
    switch (operation) {
        case "OPERATION_INC": gauge.labels(labels).inc(); break;
        case "OPERATION_ADD": gauge.labels(labels).inc(value); break;
        case "OPERATION_SET": gauge.labels(labels).set(value); break;
        case "OPERATION_DEC": gauge.labels(labels).dec(); break;
        case "OPERATION_SUB": gauge.labels(labels).dec(value); break;
        case "OPERATION_SET_TO_CURRENT_TIME": gauge.labels(labels).setToCurrentTime(); break;
        case "OPERATION_REMOVE": gauge.remove(labels); break;
        case "OPERATION_RESET": gauge.reset(); break;
        default: return; // SKIP
    }
    logger.info("gauge", { name, labels, operation, value });
}

// export function handleSummary(promOp: any) {
//     const { name } = promOp;
//     const labels = promOp.labels || {};
//     registerSummary(name, "custom help", Object.keys(labels)); // TO-DO!
//     const { operation, value } = promOp.summary;
//     let summary = register.getSingleMetric(promOp.name) as Summary;
//     switch (operation) {
//         case "OPERATION_OBSERVE": summary.labels(labels).observe(value); break; // OBSERVE
//         case "OPERATION_START_TIMER": summary.labels(labels).startTimer(); break; // START_TIMER
//         case "OPERATION_REMOVE": summary.remove(labels); break; // REMOVE
//         case "OPERATION_RESET": summary.reset(); break; // RESET
//         default: return; // SKIP
//     }
//     logger.info("summary", { name, labels, operation, value });
// }

// export function handleHistogram(promOp: any) {
//     const { name } = promOp;
//     const labels = promOp.labels || {};
//     registerHistogram(name, "custom help", Object.keys(labels)); // TO-DO!
//     const { operation, value } = promOp.histogram;
//     let histogram = register.getSingleMetric(promOp.name) as Histogram;
//     switch (operation) {
//         case "OPERATION_OBSERVE": histogram.labels(labels).observe(value); break; // OBSERVE
//         case "OPERATION_START_TIMER": histogram.labels(labels).startTimer(); break; // START_TIMER
//         case "OPERATION_ZERO": histogram.zero(labels); break; // ZERO
//         case "OPERATION_REMOVE": histogram.remove(labels); break; // REMOVE
//         case "OPERATION_RESET": histogram.reset(); break; // RESET
//         default: return; // SKIP
//     }
//     logger.info("histogram", { name, labels, operation, value });
// }
