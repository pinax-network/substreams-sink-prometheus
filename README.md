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

## CLI
[**Use pre-built binaries**](https://github.com/pinax-network/substreams-sink-prometheus/releases)
- [x] MacOS
- [x] Linux
- [x] Windows

**Install** globally via npm
```
$ npm install -g substreams-sink-prometheus
```

**Run**
```
$ substreams-sink-prometheus run [options] <spkg>
```

> Open the browser at [http://localhost:9102/metrics](http://localhost:9102/metrics)

## Features

- Consume `*.spkg` from:
  - [x] Load URL or IPFS
  - [ ] Read from `*.spkg` local filesystem
  - [ ] Read from `substreams.yaml` local filesystem
- [x] Prometheus metrics
- [ ] Handle `cursor` restart