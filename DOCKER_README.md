<p align="center">
  <img src="./logo.svg" alt="Project Logo" width="200"/>
</p>
# Band MCP Server (Docker)

This document explains how to configure an MCP client, such as Claude Desktop, to use the `band-mcp-server` Docker image on-demand.

With this configuration, the client will automatically start a temporary Docker container when it needs to access the tool, and the container will be removed after use.

## Client Configuration

### Example: Claude Desktop

1.  In Claude Desktop, open **Settings > Developer**.
2.  Click **Edit Config** to open the `claude_desktop_config.json` file.
3.  Add the following entry to the `mcpServers` object.

```json
{
  "mcpServers": {
    "band-api": {
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

**IMPORTANT:**

*   Replace `your_band_api_access_token` with your actual token from the Band Developer Portal.
*   If the `mcpServers` object already exists in your file, just add the `"band-api"` entry inside it.
*   You must have Docker installed and running on your system for this to work.

4.  Save the file and **completely restart** Claude Desktop.

That's it. There are no containers to start or manage manually. The client will now handle the Docker container lifecycle automatically.
