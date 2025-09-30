# GEMINI.md

## Project Overview

This project is a Model Context Protocol (MCP) server for the Band social platform, with version 1.0.4 now available on npm. It allows AI assistants and other MCP-compatible tools to interact with the Band API, enabling functionalities like reading and writing posts, comments, and managing other band-related data. The server is written in TypeScript and is designed to be run as a standalone executable or used as a library.

**Key Technologies:**

*   **Language:** TypeScript
*   **Framework:** Node.js with Express (implied via dependencies)
*   **Key Libraries:**
    *   `@modelcontextprotocol/sdk`: For MCP server implementation.
    *   `axios`: For making HTTP requests to the Band API.
    *   `zod`: For data validation.
*   **Testing:** Jest
*   **Linting:** ESLint

**Architecture:**

The server is structured as a modular application with different functionalities separated into different directories under `src`. The main entry point is `src/index.ts`, which initializes the MCP server and registers the available tools. The tools themselves are defined in `src/tools.ts` and implemented in their respective directories. The `src/cli.ts` file provides a command-line interface for running the server.

## Installation and Configuration

Version 1.0.4 is published to the npm registry. You can install it using npm:

```bash
npm install -g band-mcp-server
```

After installation, you can run the server using the command `band-mcp-server`.

**Configuration:**

The server requires a Band API access token to be set as an environment variable `BAND_ACCESS_TOKEN`. You can set this variable in your shell profile or by creating a `.env` file in the root of your project with the following content:

```
BAND_ACCESS_TOKEN=your_access_token
```

For MCP clients like VSCode, you can configure the server as follows:

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "band_access_token",
        "description": "BAND Access Token",
        "password": true
      }
    ],
    "servers": {
      "band-mcp-server": {
        "command": "band-mcp-server",
        "env": {
          "BAND_ACCESS_TOKEN": "${input:band_access_token}"
        }
      }
    }
  }
}
```

## Building and Running from Source

If you prefer to build and run the server from the source code, you can follow these steps:

*   **Clone the repository:** `git clone https://github.com/kanghouchao/band-mcp-server.git`
*   **Install dependencies:** `npm install`
*   **Build:** `npm run build` (compiles TypeScript to JavaScript in the `dist` directory)
*   **Run (development):** `npm run dev` (runs the server with hot-reloading)
*   **Run (production):** `node dist/index.js` or by running the executable `bin/band-mcp-server`
*   **Test:** `npm test`
*   **Lint:** `npm run lint`

## Development Conventions

*   **Coding Style:** The project uses ESLint with the recommended TypeScript configuration to enforce a consistent coding style.
*   **Testing:** Tests are written using Jest and are located in the `src/__tests__` directory.
*   **Commits:** (No explicit convention, but can be inferred from git history if needed)
*   **Modules:** The project uses ES modules.