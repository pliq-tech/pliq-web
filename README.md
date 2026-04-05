# pliq-web

Next.js progressive web app for the Pliq rental platform. Provides the full tenant and landlord interface including property search, rental applications, lease management, escrow payments, reputation scoring, real-time messaging, and privacy-preserving identity verification.

## Tech Stack

- **Runtime / Package Manager:** Bun >= 1.3.10
- **Framework:** Next.js 16.2.2 (App Router, standalone output)
- **Language:** TypeScript 6 (strict mode)
- **UI:** React 19 + @pliq/ui component library
- **Linting / Formatting:** Biome 2.2.0
- **Testing:** bun test + @testing-library/react + happy-dom
- **Styling:** CSS Modules with Liquid Glass design system

## Prerequisites

- [Bun](https://bun.sh/) >= 1.3.10

## Setup

```bash
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

All `NEXT_PUBLIC_*` variables are build-time -- they are baked into the JavaScript bundle during `bun run build`.

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
| `NEXT_PUBLIC_CIRCLE_APP_ID` | Yes | Circle payment app ID |
| `NEXT_PUBLIC_SELF_APP_ID` | Yes | Self Protocol app ID |

## Project Structure

```
src/
├── app/
│   ├── (auth)/                # Auth flow: welcome, verify, profile-setup, credentials
│   ├── (app)/                 # Protected routes (31 pages)
│   │   ├── dashboard/         # User dashboard
│   │   ├── search/            # Property search, detail, schedule, apply
│   │   ├── applications/      # Rental applications list and detail
│   │   ├── leases/            # Lease management, signing, escrow, check-in, move-out
│   │   ├── payments/          # Payments and payment history
│   │   ├── reputation/        # Proof-of-Rent score
│   │   ├── properties/        # Property CRUD for landlords
│   │   ├── messages/          # Real-time messaging
│   │   ├── notifications/     # Notification center
│   │   ├── disputes/          # Dispute management
│   │   └── settings/          # User settings
│   ├── layout.tsx             # Root layout with PWA meta tags, providers
│   ├── page.tsx               # Auth-based redirect
│   ├── not-found.tsx          # Custom 404 page
│   └── loading.tsx            # Root loading skeleton
├── components/
│   ├── features/              # 12 feature components
│   │   ├── PropertyCard/      # Property listing card
│   │   ├── CredentialCard/    # Identity credential display
│   │   ├── ApplicationCard/   # Rental application card
│   │   ├── PaymentCard/       # Payment summary card
│   │   ├── LeaseCard/         # Lease overview card
│   │   ├── MessageBubble/     # Chat message bubble
│   │   ├── NotificationItem/  # Notification list item
│   │   ├── TimeSlotCard/      # Viewing schedule card
│   │   ├── WalletStatus/      # Wallet connection status
│   │   ├── RoleSwitcher/      # Tenant/landlord role toggle
│   │   ├── ImageCarousel/     # Property image carousel
│   │   └── ScoreChart/        # Reputation score chart
│   ├── layouts/               # AuthLayout (glassmorphism), AppLayout (sidebar/navbar/bottomnav)
│   └── providers/             # AppProviders, WebSocketProvider
├── contexts/                  # AuthContext, ThemeContext, NotificationContext
├── hooks/
│   ├── api/                   # 11 API data-fetching hooks
│   └── useClickOutside.ts     # Click outside utility
├── lib/
│   ├── api/                   # REST client, WebSocket client, endpoint modules
│   ├── blockchain/            # Chain config, 6 transaction hooks
│   ├── privacy/               # World ID, Unlink, Self Protocol wrappers
│   ├── validation/            # Profile and listing validation
│   ├── types/                 # TypeScript type definitions
│   ├── config.ts              # Centralized environment configuration
│   └── cn.ts                  # Class name utility
├── middleware.ts               # Route protection
└── test/
    └── setup.ts               # Test DOM setup (happy-dom)
```

## Routes

| Group | Route | Description |
|-------|-------|-------------|
| Root | `/` | Auth-based redirect |
| Auth | `/welcome` | Landing / onboarding |
| Auth | `/verify` | World ID verification |
| Auth | `/profile-setup` | Profile creation |
| Auth | `/credentials` | Identity credentials |
| App | `/dashboard` | Main dashboard |
| App | `/search` | Property search |
| App | `/search/[listingId]` | Property detail |
| App | `/search/[listingId]/schedule` | Schedule viewing |
| App | `/search/[listingId]/apply` | Submit application |
| App | `/applications` | Application list |
| App | `/applications/[id]` | Application detail |
| App | `/leases` | Lease list |
| App | `/leases/[id]` | Lease detail |
| App | `/leases/[id]/sign` | Sign lease |
| App | `/leases/[id]/escrow` | Escrow deposit |
| App | `/leases/[id]/check-in` | Move-in check-in |
| App | `/leases/[id]/move-out` | Move-out process |
| App | `/payments` | Payments overview |
| App | `/payments/history` | Payment history |
| App | `/reputation` | Reputation score |
| App | `/properties` | Landlord property list |
| App | `/properties/create` | Create property |
| App | `/properties/[id]` | Property detail |
| App | `/properties/[id]/edit` | Edit property |
| App | `/messages` | Message threads |
| App | `/messages/[id]` | Conversation |
| App | `/notifications` | Notification center |
| App | `/disputes` | Dispute list |
| App | `/disputes/[id]` | Dispute detail |
| App | `/settings` | User settings |

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

# Run tests (188 tests across 33 files)
bun test

# Run tests in watch mode
bun test --watch

# Coverage
bun test --coverage
```

## Docker

The Dockerfile uses a 3-stage build (deps, builder, runner) with standalone output. All `NEXT_PUBLIC_*` variables must be passed as build args since they are baked in at build time.

```bash
# Build (pass all NEXT_PUBLIC_* as build args)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://api.example.com \
  --build-arg NEXT_PUBLIC_WS_URL=ws://api.example.com/ws \
  --build-arg NEXT_PUBLIC_WORLD_ID_APP_ID=app_xxx \
  --build-arg NEXT_PUBLIC_WORLD_ID_ACTION_ID=xxx \
  --build-arg NEXT_PUBLIC_ESCROW_CONTRACT=0x... \
  --build-arg NEXT_PUBLIC_REGISTRY_CONTRACT=0x... \
  --build-arg NEXT_PUBLIC_REPUTATION_CONTRACT=0x... \
  --build-arg NEXT_PUBLIC_CIRCLE_APP_ID=xxx \
  --build-arg NEXT_PUBLIC_SELF_APP_ID=xxx \
  -t pliq-web .

# Run
docker run -p 3000:3000 pliq-web
```
