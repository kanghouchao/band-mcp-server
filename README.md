# Band MCP Server

A fully functional Model Context Protocol (MCP) server that integrates with the [Band API](https://developers.band.us/develop/guide/api). This server enables seamless interaction with Band social platform data through AI assistants and other MCP-compatible tools.

## ✅ Project Status: Production Ready

**Docker Image:** `kanghouchao/band-mcp-server:latest`
**NPM Package:** `band-mcp-server`

This MCP server is fully implemented and provides complete access to Band API functionality including user profiles, band management, posts, comments, albums, and photos with full read/write capabilities.


## Quick Start

### Prerequisites

- Band API access token (obtainable from [Band Developer Portal](https://developers.band.us/develop/myapps/list))

### MCP Client Configuration (e.g., VSCode)

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
        "command": "docker",
        "args": ["run", "--rm", "-i", "-e", "BAND_ACCESS_TOKEN", "kanghouchao/band-mcp-server:latest"],
        "env": {
          "BAND_ACCESS_TOKEN": "${input:band_access_token}"
        }
      }
    }
  }
}
```

## License

MIT License - see LICENSE file for details.

---

**Maintainer**: kanghouchao  
**Docker Hub**: [kanghouchao/band-mcp-server](https://hub.docker.com/r/kanghouchao/band-mcp-server)  
**Issues**: Please report bugs and feature requests via GitHub Issues