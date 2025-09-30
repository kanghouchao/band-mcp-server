# Band MCP Server

[![NPM Version](https://img.shields.io/npm/v/band-mcp-server.svg)](https://www.npmjs.com/package/band-mcp-server)
[![Docker Pulls](https://img.shields.io/docker/pulls/kanghouchao/band-mcp-server.svg)](https://hub.docker.com/r/kanghouchao/band-mcp-server)

A fully functional [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that integrates with the [Band API](https://developers.band.us/develop/guide/api). This server enables seamless interaction with the Band social platform through AI assistants and other MCP-compatible tools.

## Overview

This server can be used in two primary ways:

1.  **As a standalone executable:** Installed via `npm` and configured directly in a compatible MCP client.
2.  **As a Docker container:** Pulled from Docker Hub and configured in a compatible MCP client to be run on-demand.

## Usage & Client Configuration

To use this server, you need a **Band API Access Token**. You can obtain one from the [Band Developer Portal](https://developers.band.us/develop/myapps/list).

Below are configuration examples for different clients and usage methods.

### Example 1: Claude Desktop (NPM version)

This method assumes you have installed the server via `npm install -g band-mcp-server`.

1.  In Claude Desktop, open **Settings > Developer** and click **Edit Config**.
2.  Add the following to the `mcpServers` object in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "band-api": {
      "command": "band-mcp-server",
      "args": [],
      "env": {
        "BAND_ACCESS_TOKEN": "your_band_api_access_token"
      }
    }
  }
}
```
*Replace `your_band_api_access_token` with your actual token.*

### Example 2: Claude Desktop (Docker version)

This method uses the Docker image and does not require `npm`.

1.  In Claude Desktop, open **Settings > Developer** and click **Edit Config**.
2.  Add the following to the `mcpServers` object in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "band-api-docker": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "BAND_ACCESS_TOKEN=your_band_api_access_token",
        "kanghouchao/band-mcp-server:latest"
      ]
    }
  }
}
```
*Replace `your_band_api_access_token` with your actual token.*

## Local Development

Instructions for setting up the project for local development.

### Prerequisites

- [Node.js](https://nodejs.org/) (version specified in `package.json`)
- [Docker](https://www.docker.com/)

### Setup

Clone the repository and install dependencies using the `make` command:

```bash
make install
```

### Running the Dev Server

To run the server with hot-reloading:

```bash
make dev
```

### Running Tests

To run the test suite:

```bash
make test
```

### Building the Project

To compile the TypeScript code:

```bash
make build
```

### Linting

To check the code against linting rules:

```bash
make lint
```
To automatically fix linting issues:
```bash
make lint-fix
```

### Docker

To build the Docker image locally:

```bash
make docker-build
```

To run the locally built image (requires `BAND_ACCESS_TOKEN` to be set in your shell environment):

```bash
export BAND_ACCESS_TOKEN="your_token_here"
make docker-run
```

## License

This project is licensed under the MIT License.