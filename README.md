# Band MCP Server

A fully functional Model Context Protocol (MCP) server that integrates with the [Band API](https://developers.band.us/develop/guide/api). This server enables seamless interaction with Band social platform data through AI assistants and other MCP-compatible tools.

## ✅ Project Status: Production Ready

**Version:** 1.0.4  
**Docker Image:** `kanghouchao/band-mcp-server:latest`

This MCP server is fully implemented and provides complete access to Band API functionality including user profiles, band management, posts, comments, albums, and photos with full read/write capabilities.

## Key Features

✅ **Access Token Authentication**: Secure authentication using Band API access tokens  
✅ **Complete Band API Coverage**: Full implementation of all major Band API endpoints  
✅ **Read/Write Operations**: Comprehensive CRUD operations for posts, comments, and band data  
✅ **MCP Integration**: Native MCP tools and resources for seamless AI integration  
✅ **Docker Deployment**: Production-ready containerized deployment  
✅ **TypeScript Implementation**: Type-safe implementation with full error handling  
✅ **Automated CI/CD**: Continuous integration and automated Docker builds

## Features

- **Access Token Authentication**: Securely authenticate using Band API access tokens.
- **MCP Resources**: Fetch and expose Band posts as MCP resources.
- **MCP Tools**: Enable read/write operations on Band data via MCP tools.
- **TypeScript Implementation**: Leverage TypeScript for type safety and maintainability.
- **Dockerized Deployment**: Simplify deployment with a Docker container.

## Quick Start

### Prerequisites

- Band API access token (obtainable from [Band Developer Portal](https://developers.band.us/develop/myapps/list))
- VS Code with MCP support or any MCP-compatible client
- Docker (for containerized deployment)

### VS Code Integration

Add the following configuration to your VS Code `settings.json`:

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

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd band-mcp-server

# Install dependencies
make install
# or
npm install

# Set up environment variables
echo "BAND_ACCESS_TOKEN=your_token_here" > .env

# Run in development mode
make dev
# or
npm run dev

# Build the project
make build
# or
npm run build

# Run tests
make test
# or
npm test
```

### Docker Deployment

```bash
# Build Docker image
make docker-build
# or
docker build -t band-mcp-server:latest .

# Run Docker container
make docker-run
# or
docker run --rm -i -e BAND_ACCESS_TOKEN=your_token_here band-mcp-server:latest
```

## Available MCP Tools

## Alternative MCP startup methods

This project now supports multiple ways to start the MCP server. Choose the option that best fits your environment.

- Docker (recommended for isolation and production):

```bash
# Build and run
docker build -t kanghouchao/band-mcp-server:latest .
docker run --rm -i -e BAND_ACCESS_TOKEN=your_token_here kanghouchao/band-mcp-server:latest
```

- Global npm install (convenient for CLI-style usage):

```bash
npm install -g .
# Then run
band-mcp-server
```

- Run directly from the public registry (no install):

```bash
# Run the published package once via npx
npx band-mcp-server
```

- Install from the public registry (local install):

```bash
# Install as a dependency in the current project
npm i band-mcp-server
# or install globally
npm i -g band-mcp-server
```

- Run the local repository (development):

```bash
# Run the package in the current checkout (no publish needed)
npx .
# or run the compiled/ts entry directly in dev with tsx
npx tsx src/index.ts
```

- Direct node/tsx (development):

```bash
# Run directly with tsx (fast dev experience)
npx tsx src/index.ts
```

When configuring MCP clients (e.g., VS Code settings), update the `command` and `args` fields to match the chosen startup method.

## About the "npx" / published-package startup

This project provides a small executable wrapper so the package can be run directly from the public npm registry using `npx` (for example: `npx band-mcp-server`). The wrapper is declared in the package `bin` field and forwards execution to the compiled CLI at `dist/cli.js`.

Key points and requirements:

- How it works: when you run `npx band-mcp-server`, npm will download the published package tarball, extract it to a temporary location, and run the executable declared in the package `bin` field (our `bin/band-mcp-server`). That wrapper loads `dist/cli.js` (ESM) which boots the MCP server.

- Build / publish considerations: the published package must include the compiled `dist/` output (or alternatively include a `prepare`/`postinstall` script to build at install time). Our `package.json` already contains a `prepublishOnly` script that runs the build and tests before publishing; ensure your release process publishes the built artifacts so `npx` users get a working binary.

- Environment variables: `npx` does not set environment variables for you. Provide required environment variables (for example `BAND_ACCESS_TOKEN`) in the same shell invocation:

```bash
# set the required token in the environment and run the published package once
BAND_ACCESS_TOKEN=your_token_here npx band-mcp-server
```

- Running a specific version: you can target a release tag or version with npx:

```bash
npx band-mcp-server@1.0.4
```

- Local development vs published package: during dev you can run `npx .` from the checkout (it will run the local `bin` wrapper or via tsx), but the published `npx <pkg>` behavior depends on what was included in the published tarball.

- Troubleshooting:
  - If `npx` fails with a missing module or cannot find `dist/cli.js`, verify the published package contains `dist/` or add a `prepare` script that builds on install.
  - If the CLI exits with permission errors, ensure the wrapper file has the executable permission in the published package (npm preserves file mode when packaging). Locally, ensure `bin/band-mcp-server` is executable (`chmod +x bin/band-mcp-server`).
  - For reproducible installs in CI or servers, prefer installing a specific version (`npm i band-mcp-server@1.0.4`) or pin the Docker image.

If you'd like, I can also add a short note to the `package.json` (a `files` entry or `prepare` script) to make publishing and `npx` more robust — tell me which approach you prefer and I will prepare the change.

### User & Band Management
- **`get_user_information`** - Get user profile information for a Band group
- **`get_bands`** - Get list of all Band groups the authenticated user belongs to
- **`permissions`** - Check user permissions for a specific Band (posting, commenting, deletion rights)

### Posts & Content
- **`get_posts`** - Get posts from a specific Band with pagination support
- **`get_post`** - Get detailed information about a specific post
- **`write_post`** - Create a new post in a Band group
- **`remove_post`** - Delete a post from a Band (requires appropriate permissions)

### Comments & Interactions
- **`get_comments`** - Get comments for a specific post with sorting options
- **`write_comment`** - Add a comment to a post
- **`remove_comment`** - Delete a comment from a post (requires appropriate permissions)

### Media & Albums
- **`get_albums`** - Get photo albums in a Band group
- **`get_photos`** - Get photos from a specific album

### Usage Examples

```typescript
// Get all bands the user belongs to
await mcp.callTool("get_bands", {});

// Get recent posts from a specific band
await mcp.callTool("get_posts", {
  band_key: "AADoj33YIR6g5reUiHGZx0wj",
  limit: 20
});

// Create a new post
await mcp.callTool("write_post", {
  band_key: "AADoj33YIR6g5reUiHGZx0wj",
  content: "Hello from MCP! 🚀",
  do_push: false
});

// Add a comment to a post
await mcp.callTool("write_comment", {
  band_key: "AADoj33YIR6g5reUiHGZx0wj",
  post_key: "AAB8tbywKWMoGQFLqd_EhiBD",
  body: "Great post! 👍"
});
```

## Error Handling & API Limits

The server implements comprehensive error handling and respects Band API rate limits:

- **Authentication errors**: Clear error messages for invalid or expired tokens
- **Permission errors**: Detailed feedback when operations require higher permissions
- **Rate limiting**: Automatic handling of API rate limits with appropriate delays
- **Validation**: Input validation for all parameters using Zod schemas
- **Logging**: Comprehensive logging for debugging and monitoring

## Development & Testing

### Project Structure
```
src/
├── index.ts          # Main MCP server entry point
├── tools.ts          # Tool definitions and routing
├── client.ts         # Band API client
├── config.ts         # Configuration management
└── [feature]/        # Individual tool implementations
    ├── index.ts      # Tool definition
    └── tool.ts       # Tool implementation
```

### Available Scripts
- `npm run dev` - Development mode with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint
- `make help` - Show all available Makefile commands

## Troubleshooting

### Common Issues

#### "Authentication failed"
- Verify your Band API access token is valid and not expired
- Ensure the token has the necessary permissions for the operations you're trying to perform
- Check that the token is correctly set in the environment variable `BAND_ACCESS_TOKEN`

#### "Permission denied" errors
- Some operations require specific roles within a Band (leader, co-leader, etc.)
- Use the `permissions` tool to check your access rights for a specific Band
- Contact the Band administrator to request appropriate permissions

#### Docker container issues
- Ensure Docker is running and you have sufficient permissions
- Check that the environment variable is properly passed to the container
- Verify the Docker image is up to date: `docker pull kanghouchao/band-mcp-server:latest`

#### MCP client connection issues
- Verify your MCP client supports the required protocol version
- Check that the server command and arguments are correctly configured
- Review VS Code or client logs for detailed error messages

### Debug Mode

To enable detailed logging, set the environment variable:
```bash
export DEBUG=band-mcp-server:*
```

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Write tests** for new functionality
3. **Follow TypeScript best practices** and maintain type safety
4. **Update documentation** for any API changes
5. **Run tests and linting** before submitting:
   ```bash
   npm run test
   npm run lint
   ```
6. **Submit a pull request** with a clear description of changes

### Development Workflow

```bash
# Set up development environment
git clone <your-fork>
cd band-mcp-server
npm install

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run dev
npm run test

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

## Roadmap

### Planned Improvements
- [ ] Response data optimization for better AI processing performance
- [ ] Combined API tool for complex operations
- [ ] Enhanced error recovery and retry mechanisms
- [ ] Additional Band API endpoint coverage
- [ ] Performance monitoring and metrics
- [ ] Multi-language support for error messages

### Performance Optimization
Current focus is on optimizing API response data to improve AI processing speed by:
- Filtering unnecessary data fields
- Implementing selective field queries
- Reducing payload sizes for better performance

## Security Considerations

- **Token Security**: Never commit access tokens to version control
- **Environment Variables**: Always use environment variables for sensitive data
- **Permissions**: Follow principle of least privilege when requesting API permissions
- **Rate Limiting**: Respect Band API rate limits to avoid service disruption
- **Input Validation**: All inputs are validated using Zod schemas

## License

MIT License - see LICENSE file for details.

---

**Maintainer**: kanghouchao  
**Docker Hub**: [kanghouchao/band-mcp-server](https://hub.docker.com/r/kanghouchao/band-mcp-server)  
**Issues**: Please report bugs and feature requests via GitHub Issues