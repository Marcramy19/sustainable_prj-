# EcoSwap — Minimalist Item Exchange Platform

> ♻️ Give what you don't need. Get what you do. No money. No waste.

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL) or a local PostgreSQL instance

### 1. Start the database
```bash
docker compose up -d
```

### 2. Setup & run the backend
```bash
cd server
npm install
cp .env.example .env          # Edit if needed
npx prisma migrate dev --name init
npm run prisma:seed            # Creates test users & items
npm run dev                    # Starts on port 3000
```

### 3. Setup & run the frontend
```bash
cd client
npm install
npm run dev                    # Starts on port 5173
```

### 4. Open the app
Navigate to **http://localhost:5173**

### Test Accounts
| Email | Password | Role |
|---|---|---|
| admin@ecoswap.com | admin1234 | Admin |
| alice@test.com | password123 | User |
| bob@test.com | password123 | User |

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Vanilla CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt |

## Green IT
- No image uploads — text only
- No CSS framework — vanilla CSS (~5 KB)
- No state management library
- Paginated API responses (max 20 items)
- 3 database tables, 7 indexes
- Single-server monolith
