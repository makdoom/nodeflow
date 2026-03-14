# Nodeflow

An open-source visual workflow automation platform — similar to [n8n](https://n8n.io) — built with Next.js. Design, connect, and execute multi-step workflows through a drag-and-drop node editor powered by React Flow.

## ✨ Features

- 🖼️ **Visual Workflow Editor** — Drag-and-drop canvas with node connections, minimap, snap-to-grid, and dark/light mode support
- ⚡ **Trigger Nodes** — Kick off workflows via Manual Trigger, Google Form submissions, or Stripe webhook events
- 🔗 **Action Nodes** — HTTP Request, Discord message, Slack message
- 🤖 **AI Nodes** — Generate text with Gemini, OpenAI, or Anthropic using stored API credentials
- 📝 **Dynamic Templating** — Use Handlebars templates in prompts and HTTP bodies to reference outputs from previous nodes (e.g. `{{googleForm.responses}}`)
- 🔀 **Topological Execution** — Nodes execute in dependency order via Inngest with real-time status updates per node
- 🔐 **Credential Vault** — Store and manage encrypted API keys (AES via Cryptr) per user
- 🛡️ **Authentication** — Email/password, GitHub, and Google OAuth via Better Auth
- 💳 **Subscription & Billing** — Polar-powered checkout, billing portal, and premium-gated workflow creation
- 📊 **Execution History** — Browse past runs with status (running / success / failed), output data, and error traces

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (New York), Radix UI |
| State | Jotai (editor), nuqs (URL search params), TanStack React Query |
| API | tRPC v11 (superjson) |
| Database | PostgreSQL + Prisma 7 |
| Auth | Better Auth (email/password + GitHub + Google OAuth) |
| Workflow Engine | Inngest (durable functions, retries, real-time channels) |
| AI | Vercel AI SDK (Gemini, OpenAI, Anthropic) |
| Payments | Polar (checkout, subscriptions, billing portal) |
| Node Editor | @xyflow/react (React Flow) |
| Linting | Biome |
| Tunneling | ngrok (webhook development) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** (package manager)
- **PostgreSQL** database
- **Inngest CLI** (bundled via `inngest-cli` dependency)
- **ngrok** (optional, for webhook development)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/nodeflow.git
cd nodeflow
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nodeflow"

# Auth
BETTER_AUTH_SECRET="your-secret"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Encryption (for credential vault)
ENCRYPTION_KEY="your-32-char-encryption-key"

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# Polar (payments)
POLAR_ACCESS_TOKEN="..."
POLAR_PRODUCT_ID="..."
POLAR_SUCCESS_URL="http://localhost:3000"

# ngrok (optional)
NGROK_URL="your-ngrok-url"
```

### 4. Set up the database

```bash
pnpm prisma migrate dev
```

### 5. Start development

Run all services (Next.js dev server, Inngest dev server, ngrok) concurrently:

```bash
pnpm dev:all
```

Or start services individually:

```bash
pnpm dev           # Next.js
pnpm inngest:dev   # Inngest dev server
pnpm ngrok:dev     # ngrok tunnel
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (auth)/             # Login & register pages
│   ├── (dashboard)/        # Dashboard layouts (editor + rest)
│   └── api/                # tRPC, Inngest, auth & webhook routes
├── components/             # Shared UI & React Flow node components
├── config/                 # Constants & node component registry
├── features/               # Feature modules
│   ├── auth/               # Auth forms
│   ├── credentials/        # Credential CRUD & encrypted storage
│   ├── editor/             # Workflow canvas editor
│   ├── executions/         # Execution history & node executors
│   │   └── components/
│   │       ├── anthropic/  # Anthropic AI node
│   │       ├── discord/    # Discord action node
│   │       ├── gemini/     # Gemini AI node
│   │       ├── http-request/ # HTTP request node
│   │       ├── openai/     # OpenAI node
│   │       └── slack/      # Slack action node
│   ├── subscriptions/      # Polar subscription hooks
│   ├── triggers/           # Trigger node implementations
│   │   └── components/
│   │       ├── google-form-trigger/
│   │       ├── manual-trigger/
│   │       └── stripe-trigger/
│   └── workflows/          # Workflow CRUD & listing
├── inngest/                # Inngest workflow execution engine
│   ├── channels/           # Real-time status channels per node type
│   ├── lib/                # Executor registry & types
│   └── functions.ts        # Main executeWorkflow function
├── lib/                    # Auth, DB, encryption, Polar client
└── trpc/                   # tRPC router, client & server setup
```

## 🧩 Available Nodes

### ⚡ Triggers
- **Manual Trigger** — Execute workflow on demand from the editor
- **Google Form Trigger** — Webhook-triggered on form submission
- **Stripe Trigger** — Webhook-triggered on Stripe events

### 🔗 Actions
- **HTTP Request** — Make GET/POST/PUT/DELETE/PATCH requests with templated URLs and bodies
- **Discord** — Send messages to Discord channels
- **Slack** — Send messages to Slack channels

### 🤖 AI
- **Gemini** — Generate text using Google Gemini (with system + user prompts)
- **OpenAI** — Generate text using OpenAI models
- **Anthropic** — Generate text using Anthropic Claude models

## 📜 Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Generate Prisma client & build for production |
| `pnpm start` | Start production server |
| `pnpm dev:all` | Start all services via mprocs |
| `pnpm inngest:dev` | Start Inngest dev server |
| `pnpm ngrok:dev` | Start ngrok tunnel |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code with Biome |

## 📄 License

This project is open source. See the [LICENSE](LICENSE) file for details.
