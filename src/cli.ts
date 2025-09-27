#!/usr/bin/env node
import { startServerWithStdIO } from "./index";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

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
