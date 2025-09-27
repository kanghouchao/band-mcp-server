#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { bandTools, handleToolCall } from "./tools.js";

const server = new Server(
  {
    name: "band-mcp-server",
    version: "1.0.2",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: bandTools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return await handleToolCall(name, args);
});

/**
 * Start the MCP server using stdio transport. Exported so CLI can import and control when to start.
 */
export async function startServerWithStdIO(): Promise<void> {
  await server.connect(new StdioServerTransport());
}

// If this file is run directly (node src/index.ts), start the server immediately.
if (process.argv[1] && process.argv[1].endsWith("index.ts")) {
  startServerWithStdIO().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}
