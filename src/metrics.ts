import { Counter, Gauge } from "prom-client";
import { prometheus, logger } from "substreams-sink"
import { PrometheusOperation, PrometheusOperations } from "./generated/pinax/substreams/sink/prometheus/v1/prometheus_pb.js"; // NOT USED

export function handleOperations(message: PrometheusOperations) {
    for (const operation of message?.operations || []) {
        handleOperation(operation);
    }
}

export function handleOperation(promOp: PrometheusOperation) {
    const promOpKeys = Object.keys(promOp);

    if (promOpKeys.includes("gauge")) handleGauge(promOp);
    else if (promOpKeys.includes("counter")) handleCounter(promOp);
    // else if (promOpKeys.includes("summary")) handleSummary(promOp);
    // else if (promOpKeys.includes("histogram")) handleHistogram(promOp);
}

export function handleCounter(promOp: any) {
    if ( promOp.operation.case === "counter" ) {
        const name = promOp.name;
        const operation = promOp.operation.value.operation.toString();
        const value = promOp.operation.value.value;
        const labels = promOp.labels || {};

        // register
        prometheus.registerCounter(name, "custom help", Object.keys(labels)); // TO-DO!
        const counter = prometheus.registry.getSingleMetric(promOp.name) as Counter;
        if (labels) counter.labels(labels);
        switch (operation) {
            case "OPERATION_INC": counter.labels(labels).inc(); break; // INC
            case "OPERATION_ADD": counter.labels(labels).inc(value); break; // ADD
            case "OPERATION_REMOVE": counter.remove(labels); break; // REMOVE
            case "OPERATION_RESET": counter.reset(); break; // RESET
            default: return; // SKIP
        }
        logger.info("counter", { name, labels, operation, value });
    }
}

export function handleGauge(promOp: PrometheusOperation) {
    if ( promOp.operation.case === "gauge" ) {
        const name = promOp.name;
        const operation = promOp.operation.value.operation.toString();
        const value = promOp.operation.value.value;
        const labels = promOp.labels || {};

        // register
        prometheus.registerGauge(name, "custom help", Object.keys(labels)); // TO-DO!
        let gauge = prometheus.registry.getSingleMetric(name) as Gauge;
        switch (operation) {
            case "OPERATION_INC": gauge.labels(labels).inc(); break; // INC
            case "OPERATION_ADD": gauge.labels(labels).inc(value); break; // ADD
            case "OPERATION_SET": gauge.labels(labels).set(value); break; // SET
            case "OPERATION_DEC": gauge.labels(labels).dec(); break; // DEC
            case "OPERATION_SUB": gauge.labels(labels).dec(value); break; // SUB
            case "OPERATION_SET_TO_CURRENT_TIME": gauge.labels(labels).setToCurrentTime(); break; // SET_TO_CURRENT_TIME
            case "OPERATION_REMOVE": gauge.remove(labels); break; // REMOVE
            case "OPERATION_RESET": gauge.reset(); break; // RESET
            default: return; // SKIP
        }
        logger.info("gauge", { name, labels, operation, value });
    }
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
