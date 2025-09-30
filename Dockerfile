# Multi-stage build for band-mcp-server
FROM node:23.11.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json ./
RUN npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY tsconfig.json ./

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:23.11.0-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy production dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

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
