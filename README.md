# pliq-web

Next.js 16 frontend for the Pliq web application. Provides tenant and landlord interfaces including property search, rental applications, lease management, escrow payments, reputation scoring, real-time messaging, and privacy-preserving identity verification via World ID, Self Protocol, and wagmi/viem blockchain integration.

## Prerequisites

- [Bun](https://bun.sh/) >= 1.3.10

## Installation

```bash
cp .env.example .env
# Edit .env with your values

bun install
```

## Configuration

All `NEXT_PUBLIC_*` variables are build-time -- they are baked into the JavaScript bundle during `bun run build`. Configuration is centralized in `src/lib/config.ts`.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_WS_URL` | Yes | WebSocket endpoint URL |
| `NEXT_PUBLIC_WORLD_ID_APP_ID` | Yes | World ID application ID |
| `NEXT_PUBLIC_WORLD_ID_ACTION_ID` | Yes | World ID action identifier |
| `NEXT_PUBLIC_CHAIN_ID` | No | Blockchain network ID (default: `480`) |
| `NEXT_PUBLIC_RPC_URL` | No | JSON-RPC endpoint for on-chain reads |
| `NEXT_PUBLIC_ESCROW_CONTRACT` | Yes | Escrow contract address |
| `NEXT_PUBLIC_REGISTRY_CONTRACT` | Yes | Registry contract address |
| `NEXT_PUBLIC_REPUTATION_CONTRACT` | Yes | Reputation contract address |
| `NEXT_PUBLIC_USDC_CONTRACT` | Yes | USDC token contract address |
| `NEXT_PUBLIC_CIRCLE_APP_ID` | Yes | Circle payment app ID |
| `NEXT_PUBLIC_SELF_APP_ID` | Yes | Self Protocol app ID |

## Run

```bash
# Dev server with hot reload
bun dev

# Production build
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

The Dockerfile uses a 3-stage build (deps, builder, runner) with standalone output. The `@pliq/ui` component library is provided as an additional Docker build context during local development.

```bash
# Build with docker-compose (provides pliq-web-ui as additional_contexts)
docker compose build web

# Or build standalone (pass all NEXT_PUBLIC_* as build args)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://api.example.com \
  --build-arg NEXT_PUBLIC_WS_URL=ws://api.example.com/ws \
  --build-arg NEXT_PUBLIC_WORLD_ID_APP_ID=app_xxx \
  --build-arg NEXT_PUBLIC_WORLD_ID_ACTION_ID=xxx \
  --build-arg NEXT_PUBLIC_ESCROW_CONTRACT=0x... \
  --build-arg NEXT_PUBLIC_REGISTRY_CONTRACT=0x... \
  --build-arg NEXT_PUBLIC_REPUTATION_CONTRACT=0x... \
  --build-arg NEXT_PUBLIC_USDC_CONTRACT=0x... \
  --build-arg NEXT_PUBLIC_CIRCLE_APP_ID=xxx \
  --build-arg NEXT_PUBLIC_SELF_APP_ID=xxx \
  -t pliq-web .

# Run
docker run -p 3000:3000 pliq-web
```

## Linting and Formatting

```bash
# Lint (Biome)
bun run lint

# Format
bun run format
```

## Testing

```bash
# Run tests
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

## Note on @pliq/ui Dependency

This project depends on `@pliq/ui` (the `pliq-web-ui` shared component library). In `package.json`, it is declared as a private GitHub dependency:

```json
"@pliq/ui": "github:pliq-tech/pliq-web-ui#main"
```

For local Docker builds, `docker-compose.yml` provides `pliq-web-ui` as an `additional_contexts` named context. The deps stage copies it directly into `node_modules/@pliq/ui`, bypassing the GitHub fetch. In CI/CD, the GitHub dependency is resolved normally (requires appropriate access).
