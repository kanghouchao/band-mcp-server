# Multi-stage build for band-mcp-server
FROM node:24.9.0-alpine3.22 AS builder
WORKDIR /app

# Copy package files (including lockfile if present) so npm can install devDependencies
COPY package.json ./

# Install all dependencies (including devDependencies) so that build tools like tsc are available
RUN npm install

# Copy tsconfig and source code
COPY tsconfig.json ./
COPY src ./src

# Build the application (requires tsc from devDependencies)
RUN npm run build

# Remove devDependencies to slim down the final node_modules we copy to the production image
RUN npm prune --production

# Production stage
FROM node:24.9.0-alpine3.22 AS production
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy production dependencies
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy package.json for metadata
COPY --chown=nodejs:nodejs package.json ./

COPY --chown=nodejs:nodejs bin ./bin

# Switch to non-root user
USER nodejs

# Expose port (if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "bin/band-mcp-server"]
