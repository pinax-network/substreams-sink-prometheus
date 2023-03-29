#!/usr/bin/env node

import { cli } from "substreams-sink";
import { action, DEFAULT_ADDRESS, DEFAULT_PORT } from "../index.js"
import pkg from "../package.json";

const program = cli.program(pkg);
const command = cli.run(program, pkg);
command.option('-p --port <int>', 'Listens on port number.', String(DEFAULT_PORT));
command.option('-a --address <string>', 'Prometheus address to connect.', DEFAULT_ADDRESS);
command.action(action);
program.parse();