# [`Substreams`](https://substreams.streamingfast.io/) [Prometheus](https://prometheus.io/) CLI `Node.js`

[<img alt="github" src="https://img.shields.io/badge/Github-substreams.prometheus-8da0cb?style=for-the-badge&logo=github" height="20">](https://github.com/pinax-network/substreams-sink-prometheus)
[<img alt="npm" src="https://img.shields.io/npm/v/substreams-sink-prometheus.svg?style=for-the-badge&color=CB0001&logo=npm" height="20">](https://www.npmjs.com/package/substreams-sink-prometheus)
[<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/pinax-network/substreams-sink-prometheus/ci.yml?branch=main&style=for-the-badge" height="20">](https://github.com/pinax-network/substreams-sink-prometheus/actions?query=branch%3Amain)

> `substreams-sink-prometheus` is a tool that allows developers to pipe data extracted metrics from a blockchain into a Prometheus time series database.

## 📖 Documentation

### https://www.npmjs.com/package/substreams-sink-prometheus

### Further resources

- [**Substreams** documentation](https://substreams.streamingfast.io)
- [**Prometheus** documentation](https://prometheus.io)
- [**Substreams Sink Prometheus** `Rust`](https://github.com/pinax-network/substreams-sink-prometheus.rs)

### Protobuf

- [`pinax.substreams.sink.prometheus.v1.PrometheusOperations`](https://github.com/pinax-network/substreams-sink-prometheus.rs/blob/main/proto/substreams/sink/prometheus/v1/prometheus.proto)

## Docker environment

Pull from GitHub Container registry
```bash
docker pull ghcr.io/pinax-network/substreams-sink-prometheus:latest
```

Build from source
```bash
docker build -t substreams-sink-prometheus .
```

Run with `.env` file
```bash
docker run -it --rm --env-file .env substreams-sink-prometheus run
```

**Install** globally via npm
```
$ npm install -g substreams-sink-prometheus
```

**Run**

```console
Substreams Prometheus sink module

Options:
  -e --substreams-endpoint <string>    Substreams gRPC endpoint to stream data from (env: SUBSTREAMS_ENDPOINT)
  --manifest <string>                  URL of Substreams package (env: MANIFEST)
  --module-name <string>               Name of the output module (declared in the manifest) (env: MODULE_NAME)
  -s --start-block <int>               Start block to stream from (defaults to -1, which means the initialBlock of the first module you are streaming) (default: "-1", env: START_BLOCK)
  -t --stop-block <int>                Stop block to end stream at, inclusively (env: STOP_BLOCK)
  -p, --params <string...>             Set a params for parameterizable modules. Can be specified multiple times. (ex: -p module1=valA -p module2=valX&valY) (default: [], env: PARAMS)
  --substreams-api-token <string>      API token for the substream endpoint (default: "", env: SUBSTREAMS_API_TOKEN)
  --delay-before-start <int>           [OPERATOR] Amount of time in milliseconds (ms) to wait before starting any internal processes, can be used to perform to maintenance on the pod before actually letting it starts (default: 0,
                                       env: DELAY_BEFORE_START)
  --cursor-file <string>               Cursor lock file (default: "cursor.lock", env: CURSOR_FILE)
  --disable-production-mode            Disable production mode, allows debugging modules logs, stops high-speed parallel processing (default: true, env: PRODUCTION_MODE)
  --restart-inactivity-seconds <int>   If set, the sink will restart when inactive for over a certain amount of seconds (default: 60, env: RESTART_INACTIVITY_SECONDS)
  --hostname <string>                  The process will listen on this hostname for any HTTP and Prometheus metrics requests (default: "localhost", env: HOSTNAME)
  --port <int>                         The process will listen on this port for any HTTP and Prometheus metrics requests (default: 9102, env: PORT)
  --metrics-labels [string...]         To apply generic labels to all default metrics (ex: --labels foo=bar) (default: {}, env: METRICS_LABELS)
  --collect-default-metrics <boolean>  Collect default metrics (default: false, env: COLLECT_DEFAULT_METRICS)
  --verbose                            Enable verbose logging (default: false, env: VERBOSE)
  -h, --help                           display help for command
```

> Open the browser at [http://localhost:9102](http://localhost:9102)

## Features

- [x] Consume `*.spkg` from:
  - [x] Load URL or IPFS
  - [x] Read from `*.spkg` local filesystem
  - [x] Read from `substreams.yaml` local filesystem
- [x] Prometheus metrics
  - [x] COUNTER
  - [x] GAUGE
  - [ ] ~~HISTOGRAM~~
  - [ ] ~~SUMMARY~~
- [x] Handle `cursor` on restart (saves `cursor.lock` file on disk)
