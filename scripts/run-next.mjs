import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const args = process.argv.slice(2);
const mode = args[0] === "start" ? "start" : "dev";

let port = process.env.PORT || "3000";
let host = "0.0.0.0";
const passthrough = [];

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--port" || arg === "-p") {
    if (args[i + 1]) {
      port = args[++i];
    }
  } else if (arg.startsWith("--port=")) {
    port = arg.slice("--port=".length);
  } else if (arg === "--host" || arg === "-H") {
    if (args[i + 1]) {
      host = args[++i];
    }
  } else if (arg.startsWith("--host=")) {
    host = arg.slice("--host=".length);
  } else {
    passthrough.push(arg);
  }
}

const child = spawn(
  process.execPath,
  [nextBin, mode, "-p", port, "-H", host, ...passthrough],
  {
    stdio: "inherit",
    env: process.env,
  }
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
  });
}

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
