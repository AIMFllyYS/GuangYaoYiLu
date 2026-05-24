import { spawn } from "node:child_process";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const port = process.env.AI_PPTX_STAGE_VERIFY_PORT ?? "5178";
const url = `http://127.0.0.1:${port}`;
let server;

try {
  await run(npmCmd, ["run", "typecheck"]);
  await run(npmCmd, ["run", "build"]);
  await run(npmCmd, ["run", "validate:utf8"]);
  await run(npmCmd, ["run", "validate:decks"]);
  await run(npmCmd, ["run", "validate:assets"]);
  await run(npmCmd, ["run", "validate:layout"]);
  await run(npmCmd, ["run", "validate:export", "--", "--deck", "wave-utopia-demo"]);
  await run(npmCmd, ["run", "validate:export", "--", "--deck", "guang-yao-yi-lu-final-defense"]);

  const serverCommand = commandForSpawn(npmCmd, ["run", "dev", "--", "--port", port, "--strictPort"]);
  server = spawn(serverCommand.command, serverCommand.args, {
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env
  });
  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));
  await waitForServer(url);

  const browserEnv = { ...process.env, AI_PPTX_STAGE_URL: url };
  await run(npmCmd, ["run", "smoke:browser"], { env: browserEnv });
  await run(npmCmd, [
    "run",
    "validate:visual",
    "--",
    "--deck",
    "guang-yao-yi-lu-final-defense",
    "--pages",
    "1,4,8,11,14,18,21,24,27,30"
  ], { env: browserEnv });

  console.log("Full verification passed.");
} finally {
  await stopServer(server);
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${command} ${args.join(" ")}`);
    const resolved = commandForSpawn(command, args);
    const child = spawn(resolved.command, resolved.args, {
      stdio: "inherit",
      env: options.env ?? process.env
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function commandForSpawn(command, args) {
  if (process.platform !== "win32") {
    return { command, args };
  }

  return {
    command: process.env.ComSpec ?? "cmd.exe",
    args: ["/d", "/c", command, ...args]
  };
}

async function waitForServer(targetUrl) {
  const started = Date.now();
  while (Date.now() - started < 30_000) {
    try {
      const response = await fetch(targetUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Server still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${targetUrl}`);
}

function stopServer(child) {
  if (!child?.pid) {
    return Promise.resolve();
  }

  if (process.platform === "win32") {
    return new Promise((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      killer.on("exit", () => resolve());
    });
  }

  child.kill("SIGTERM");
  return Promise.resolve();
}
