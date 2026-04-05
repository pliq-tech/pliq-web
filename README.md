# pliq-web

Next.js progressive web app for the Pliq rental platform. Provides the main tenant and landlord interface.

## Prerequisites

- [Bun](https://bun.sh/) >= 1.3.10

## Setup

```bash
# Clone and enter the repo
cd pliq-web

# Copy environment config
cp .env.example .env
# Edit .env with your values

# Install dependencies
bun install

# Run dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_WS_URL` | Yes | WebSocket endpoint URL |
| `NEXT_PUBLIC_WORLD_ID_APP_ID` | Yes | World ID application ID |
| `NEXT_PUBLIC_WORLD_ID_ACTION_ID` | Yes | World ID action identifier |
| `NEXT_PUBLIC_CHAIN_ID` | No | Blockchain network ID (default: `480`) |
| `NEXT_PUBLIC_ESCROW_CONTRACT` | Yes | Escrow contract address |
| `NEXT_PUBLIC_REGISTRY_CONTRACT` | Yes | Registry contract address |
| `NEXT_PUBLIC_REPUTATION_CONTRACT` | Yes | Reputation contract address |

All `NEXT_PUBLIC_*` variables are build-time — they are baked into the JavaScript bundle during `bun run build`.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes (World ID, wallet)
│   ├── (app)/            # Protected app routes
│   │   ├── dashboard/    # User dashboard
│   │   ├── properties/   # Property listings
│   │   ├── applications/ # Rental applications
│   │   ├── leases/       # Lease management
│   │   ├── payments/     # Payment history
│   │   ├── reputation/   # PoR score
│   │   └── ...
│   └── layout.tsx        # Root layout with PWA meta tags
├── components/           # React components
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── lib/
│   ├── api/              # REST and WebSocket clients
│   ├── types/            # TypeScript type definitions
│   └── config.ts         # Environment configuration
└── test/
    └── setup.ts          # Test DOM setup (happy-dom)
```

## Development

```bash
# Dev server with hot reload
bun dev

# Build for production
bun run build

# Start production server
bun start

# Lint
bun run lint

# Format
bun run format

# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Coverage
bun test --coverage
```

## Docker

```bash
# Build (pass NEXT_PUBLIC_* as build args)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://api.example.com \
  --build-arg NEXT_PUBLIC_WS_URL=ws://api.example.com/ws \
  -t pliq-web .

# Run
docker run -p 3000:3000 pliq-web
```
