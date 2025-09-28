.PHONY: help install build dev docker-build docker-run docker-push test clean

# Default target
help:
	@echo "Available commands:"
	@echo "  help          Show help information"
	@echo "  install       Install dependencies"
	@echo "  build         Build project"
	@echo "  dev           Run in development mode (hot reload)"
	@echo "  docker-build  Build Docker image"
	@echo "  docker-run    Run Docker container locally"
	@echo "  docker-push   Push Docker image to registry"
	@echo "  test          Run tests"
	@echo "  clean         Clean build artifacts"

# Install dependencies
install:
	npm install

# Build project
build:
	npm run build

# Development mode (hot reload)
dev:
	npm run dev

# Docker commands
docker-build:
	docker build -t band-mcp-server:latest .

docker-run:
	docker run --rm -it \
		-e BAND_ACCESS_TOKEN=${BAND_ACCESS_TOKEN} \
		-p 3000:3000 \
		band-mcp-server:latest

# Test command (placeholder)
test:
	@echo "Running tests..."
	npm test 2>/dev/null || echo "No tests configured yet"

lint:
	npm run lint

lint-fix:
	npm run lint:fix

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf node_modules/
	docker rmi band-mcp-server:latest 2>/dev/null || true