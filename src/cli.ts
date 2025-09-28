#!/usr/bin/env node
import { startServerWithStdIO } from "./index.js";
import fs from "fs";

// Load environment variables from .env if present without printing to stdout.
// We implement a tiny, safe .env parser here to avoid third-party libs that may
// write to stdout during import/parse and break MCP stdio (which uses stdin/stdout).
function parseDotenv(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    let key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();

    // Remove surrounding quotes if present
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    // Unescape common sequences
    val = val.replace(/\\n/g, "\n").replace(/\\r/g, "\r");

    if (key) result[key] = val;
  }
  return result;
}

try {
  const envPath = ".env";
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, { encoding: "utf8" });
    const parsed = parseDotenv(raw);
    for (const key of Object.keys(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = parsed[key];
      }
    }
  }
} catch (err) {
  // Don't write to stdout; use stderr so MCP stdio parsing is not affected.
  console.error("Failed to load .env:", err);
}

async function main() {
  const token = process.env.BAND_ACCESS_TOKEN;
  if (!token) {
    console.error(
      "BAND_ACCESS_TOKEN not set. Please set it or provide via env."
    );
    process.exit(1);
  }

  // Start server in stdio mode suitable for MCP clients
  await startServerWithStdIO();
}

main().catch((err) => {
  console.error("CLI start failed:", err);
  process.exit(1);
});
