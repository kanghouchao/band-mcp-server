<p align="center">
  <img src="./logo.svg" alt="Project Logo" width="200"/>
</p>
# Band MCP Server

[![npm version](https://badge.fury.io/js/band-mcp-server.svg)](https://badge.fury.io/js/band-mcp-server)

This package provides a standalone server that implements the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) to expose the [Band API](https://developers.band.us/develop/guide/api/introduction) to any compatible AI assistant or application.

## 1. Installation

Install the server globally using npm. This makes the `band-mcp-server` command available in your system's PATH.

```bash
npm install -g band-mcp-server
```

## 2. Obtaining Your Access Token

The server requires an access token to make requests to the Band API on your behalf.

1.  Navigate to the [Band API Documentation](https://developers.band.us/develop/guide/api).
2.  Click the **My Apps** button in the top navigation bar.
3.  Create a new OAuth2 application (or select an existing one).
4.  Inside your application's settings, find and copy the **Access Token**. You will use this token in the next step.

## 3. Client Configuration

### Example: Claude Desktop

Claude Desktop connects to MCP servers via a configuration file.

1.  In Claude Desktop, open **Settings > Developer**.
2.  Click **Edit Config** to open the `claude_desktop_config.json` file.
3.  Add the following entry to the `mcpServers` object.

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

**Important:**
*   Replace `your_band_api_access_token` with the actual token you copied from the Band Developer Portal.
*   If the `mcpServers` object already exists, just add the `"band-api"` entry inside it.
*   This configuration assumes your Claude Desktop supports the `env` key for setting environment variables.

4.  Save the file and **completely restart** Claude Desktop.

Once restarted, Claude will have access to the Band API tools provided by this server.
