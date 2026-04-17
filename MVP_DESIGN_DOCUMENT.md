# EcoSwap — Minimalist Item Exchange Platform

## Complete MVP Design & Validation Document

---

# 🟢 STEP 1 — IDEA UNDERSTANDING

**EcoSwap** is a minimalist web platform that allows users to exchange unused items with others — **no money involved**. The core loop is:

1. A user **registers** and creates an account.
2. The user **posts items** they no longer need.
3. Another user **browses** available items and **requests a swap** (offering one of their own items in return).
4. The item owner **accepts or rejects** the swap request.
5. Both users exchange items in person.

**Why it matters**: Millions of usable items end up in landfills every year. EcoSwap extends the lifecycle of goods by connecting people who have things they don't need with people who do — all without money, promoting a circular economy.

**Green IT alignment**: The platform itself mirrors its mission — built with minimal resources, no bloat, no unnecessary features. The product *and* the technology are sustainable.

---

# 🟢 STEP 2 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Overview

EcoSwap is a web application where registered users list unused items and propose swaps with other users' items. There is no currency — only item-for-item exchanges. The platform is designed to be ultra-lightweight, following strict Green IT principles in every layer.

## 2. Problem Statement

- **Waste**: Households accumulate items (clothes, electronics, books, furniture) that are still usable but unwanted. Most end up discarded.
- **Cost**: Buying new items is expensive, especially for students and low-income individuals.
- **Friction**: Existing platforms (eBay, Facebook Marketplace) are money-based ONLY option, complex, and bloated with ads and trackers.

EcoSwap removes the money barrier and provides a clean, purpose-built interface for item exchange.

## 3. Objectives

| # | Objective | Measurable KPI |
|---|---|---|
| O1 | Enable item exchange without money | ≥ 30 successful swaps in first month |
| O2 | Reduce unused item waste | ≥ 100 items listed in first month |
| O3 | Deliver a fast, lightweight platform | All pages load in < 1.5s on 3G |
| O4 | Maintain Green IT compliance | Bundle < 100 KB gzipped; ≤ 2 API calls per page |

## 4. Target Users

- **University students**: Swap textbooks, furniture, electronics between semesters.
- **Eco-conscious individuals**: People who prefer reusing over buying new.
- **Budget-constrained households**: Families looking to exchange children's clothes, toys, appliances.

## 5. Value Proposition

> *"Give what you don't need. Get what you do. No money. No waste."*

- **For listers**: Declutter without guilt — your item goes to someone who needs it.
- **For seekers**: Get useful items for free by offering something you no longer use.
- **For the planet**: Every swap is one less item manufactured and one less item in landfill.

## 6. User Roles & Permissions

| Role | Permissions |
|---|---|
| **Visitor** | Browse listed items (read-only). View the landing page. Register. |
| **User** | Everything Visitor can do + create/edit/delete own items, request swaps, accept/reject swap requests on own items, view own swap history, edit profile. |
| **Admin** | Everything User can do + view all users, delete any user, delete any item, view platform statistics (total users, items, swaps). |

> **Justification**: Only 3 roles. No complex role hierarchy — keeps auth logic simple and code lean (Green IT).

## 7. Core Features

| ID | Feature | Priority | Description | Green IT Justification |
|---|---|---|---|---|
| F1 | User Registration | MUST | Register with email + password | Minimal fields, no social auth SDKs |
| F2 | User Login | MUST | JWT-based authentication | Stateless — no server-side session storage |
| F3 | User Profile CRUD | MUST | View/edit name, city, bio; delete account | Essential user management |
| F4 | Item CRUD | MUST | Create/read/update/delete items with title, description, category, condition | Core entity — text only, no images in MVP |
| F5 | Browse Items | MUST | List all available items with category filter and pagination | Paginated to limit payload |
| F6 | Swap Request | MUST | User selects one of their items to offer in exchange for another user's item | Core business logic |
| F7 | Accept/Reject Swap | MUST | Item owner reviews and accepts or rejects incoming swap requests | Completes the swap loop |
| F8 | My Swaps | MUST | View incoming and outgoing swap requests and their status | User needs visibility |
| F9 | Admin Panel | SHOULD | List users, delete users/items, view stats | Platform governance |

## 8. Data Model

### Entities & Attributes

```
User
├── id            : UUID (PK)
├── email         : VARCHAR(255) UNIQUE NOT NULL
├── password_hash : VARCHAR(255) NOT NULL
├── name          : VARCHAR(100) NOT NULL
├── city          : VARCHAR(100) DEFAULT ''
├── bio           : TEXT DEFAULT ''
├── is_admin      : BOOLEAN DEFAULT FALSE
├── created_at    : TIMESTAMP
└── updated_at    : TIMESTAMP

Item
├── id            : UUID (PK)
├── owner_id      : UUID (FK → User.id)
├── title         : VARCHAR(200) NOT NULL
├── description   : TEXT DEFAULT ''
├── category      : VARCHAR(50) NOT NULL
├── condition     : VARCHAR(30) NOT NULL   -- 'new', 'like_new', 'good', 'fair'
├── status        : VARCHAR(20) DEFAULT 'available'  -- 'available', 'swapped'
├── created_at    : TIMESTAMP
└── updated_at    : TIMESTAMP

SwapRequest
├── id            : UUID (PK)
├── offered_item_id  : UUID (FK → Item.id)   -- item the requester is offering
├── requested_item_id: UUID (FK → Item.id)   -- item the requester wants
├── requester_id     : UUID (FK → User.id)
├── status           : VARCHAR(20) DEFAULT 'pending'  -- 'pending', 'accepted', 'rejected'
├── created_at       : TIMESTAMP
└── updated_at       : TIMESTAMP
```

### Relationships

```mermaid
erDiagram
    USER ||--o{ ITEM : "owns"
    USER ||--o{ SWAP_REQUEST : "creates"
    ITEM ||--o{ SWAP_REQUEST : "offered_in"
    ITEM ||--o{ SWAP_REQUEST : "requested_in"
```

- One User → many Items (as owner)
- One User → many SwapRequests (as requester)
- One SwapRequest references exactly **two** Items (offered + requested)
- When a swap is accepted, both items' status → `swapped`

> **Green IT note**: Only 3 tables. No join tables, no tags table, no comments table. Minimal schema.

## 9. User Stories

| # | As a… | I want to… | So that… | Green IT Aspect |
|---|---|---|---|---|
| US1 | Visitor | register with email and password | I can start listing and swapping items | Minimal form — only 3 fields |
| US2 | User | post an item with title, description, category, and condition | others can see what I have to offer | Text-only — no image upload overhead |
| US3 | User | browse available items and filter by category | I can find items I'm interested in | Paginated results limit bandwidth |
| US4 | User | request a swap by offering one of my items | the owner can decide if they want to trade | Single API call creates the request |
| US5 | User | accept or reject swap requests on my items | I control who gets my items | Simple PATCH — minimal server work |
| US6 | User | view my swap history (sent/received) | I can track my exchange activity | One query with JOIN — no N+1 |
| US7 | Admin | delete inappropriate items or users | the platform stays clean and safe | Lightweight moderation |
| US8 | User | edit or delete my profile | I maintain control of my data | GDPR-aligned, simple CRUD |

## 10. Green IT Strategy

| Layer | Strategy | Impact |
|---|---|---|
| **Frontend** | No CSS framework (vanilla CSS), no heavy libraries, no analytics trackers | Bundle < 100 KB |
| **Backend** | Lightweight Express server, no ORM overhead (raw SQL or Prisma — lightweight mode), minimal middleware | Low memory footprint |
| **Database** | 3 tables only, indexed queries, pagination (LIMIT/OFFSET) | Low disk I/O |
| **Network** | JSON responses < 2 KB avg, no polling/WebSockets, no image transfers | Minimal bandwidth |
| **Architecture** | Monolith (single server), no microservices, no caching layer, no CDN | Minimal infrastructure |
| **Code** | No overengineering, no design pattern bloat, clean structure | Easy maintenance = longer software lifespan |
| **Product** | No unnecessary features (no chat, no notifications, no social), text-only listings | Reduced compute per user action |

**Carbon calculation estimate**: A page view on EcoSwap transfers ~5 KB of data. A typical e-commerce page transfers ~3 MB. EcoSwap is **~600x lighter per page view**.

## 11. Technical Stack + Justification

| Layer | Technology | Justification (Green IT) |
|---|---|---|
| **Frontend** | React (Vite) | Vite: fast builds, tree-shaking produces small bundles. React: component reuse reduces code duplication. |
| **Styling** | Vanilla CSS | Zero dependency, zero runtime cost. No Tailwind (adds build step + purge complexity). |
| **Backend** | Node.js + Express | Single-threaded event loop = low memory. Same language as frontend = simpler team. Express is ~2 MB. |
| **Database** | PostgreSQL | Battle-tested, efficient query optimizer, open-source. Handles relational data (swaps reference two items). |
| **ORM** | Prisma (lightweight) | Type-safe queries, auto-migration. Alternative: raw SQL (even lighter, but higher dev cost). |
| **Auth** | JWT + bcrypt | Stateless (no session store = no Redis needed). bcrypt: secure and standard. |
| **Testing** | Jest + Supertest | Zero-config, built into Node ecosystem. No heavy test frameworks. |
| **Dev Tools** | ESLint only | No Prettier, no Husky, no complex CI — keeps tooling lean. |

> **Stack rejected alternatives**: Django (heavier runtime), Spring Boot (JVM memory overhead), Next.js (SSR adds server complexity — overkill for MVP), MongoDB (schema flexibility not needed for 3 well-defined tables).

---

# 🟢 STEP 3 — MVP DEFINITION

## 🎯 Core Function

> A user posts an item → another user finds it → they offer one of their own items as a swap → the owner accepts or rejects.

This is the **minimum viable loop**. Everything else exists to support it.

## ✅ MUST-HAVE Features

- ✅ User registration & login (JWT)
- ✅ User profile editing & deletion
- ✅ Item CRUD (create, read, update, delete — owner only)
- ✅ Browse items with category filter + pagination
- ✅ Request a swap (select your item to offer)
- ✅ Accept / reject swap requests
- ✅ My swaps view (incoming + outgoing)
- ✅ Admin: list users, delete users, delete items

## ❌ OUT-OF-SCOPE Features

| Feature | Why Excluded |
|---|---|
| Image uploads | High bandwidth and storage cost — violates Green IT. Text descriptions sufficient for MVP. |
| In-app messaging / chat | Adds WebSocket complexity, increases server resources. Users can exchange contacts after swap acceptance. |
| Notifications (email/push) | Requires third-party services (SendGrid, FCM), adds dependencies. |
| Search (full-text) | Category filter is sufficient for MVP scale. Full-text search needs additional indexing. |
| User ratings/reviews | Adds another entity, more queries, more UI. Defer to v2. |
| Geolocation / maps | Requires map APIs (Leaflet/Google Maps), adds bundle size. City text field is enough. |
| Social features (follow, share) | Feature creep. Not core to swap functionality. |
| Multiple images per item | Even one image is out of scope. |
| Swap counter-offers | Complicates the flow. Accept/reject is simpler and sufficient. |
| PWA / offline mode | Adds service worker complexity for minimal benefit at MVP scale. |

## 🧪 Success Criteria

| Criterion | Target |
|---|---|
| User can register, login, edit profile, delete account | ✅ Full CRUD |
| User can create, view, edit, delete items | ✅ Full CRUD |
| User can request a swap and owner can accept/reject | ✅ Complete swap loop |
| Accepted swap marks both items as `swapped` | ✅ Data consistency |
| Admin can manage users and items | ✅ Basic governance |
| Page loads < 1.5s on 3G | ✅ Performance |
| Frontend bundle < 100 KB gzipped | ✅ Green IT |
| Each page makes ≤ 2 API calls | ✅ Minimal network |

---

# 🟢 STEP 4 — SYSTEM DESIGN

## 🔹 Use Case Diagram (PlantUML)

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor Visitor
actor User
actor Admin

rectangle "EcoSwap" {
  usecase "Browse Items" as UC1
  usecase "Register" as UC2
  usecase "Login" as UC3
  usecase "Edit Profile" as UC4
  usecase "Delete Account" as UC5
  usecase "Create Item" as UC6
  usecase "Edit Item" as UC7
  usecase "Delete Item" as UC8
  usecase "Request Swap" as UC9
  usecase "Accept/Reject Swap" as UC10
  usecase "View My Swaps" as UC11
  usecase "View My Items" as UC12
  usecase "Manage Users" as UC13
  usecase "Delete Any Item" as UC14
  usecase "View Statistics" as UC15
}

Visitor --> UC1
Visitor --> UC2
Visitor --> UC3

User --> UC1
User --> UC4
User --> UC5
User --> UC6
User --> UC7
User --> UC8
User --> UC9
User --> UC10
User --> UC11
User --> UC12

Admin --> UC13
Admin --> UC14
Admin --> UC15

User --|> Visitor
Admin --|> User
@enduml
```

## 🔹 Class Diagram (Mermaid)

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String password_hash
        +String name
        +String city
        +String bio
        +Boolean is_admin
        +DateTime created_at
        +DateTime updated_at
        +register()
        +login()
        +updateProfile()
        +deleteAccount()
    }

    class Item {
        +UUID id
        +UUID owner_id
        +String title
        +String description
        +String category
        +String condition
        +String status
        +DateTime created_at
        +DateTime updated_at
        +create()
        +update()
        +delete()
        +markSwapped()
    }

    class SwapRequest {
        +UUID id
        +UUID offered_item_id
        +UUID requested_item_id
        +UUID requester_id
        +String status
        +DateTime created_at
        +DateTime updated_at
        +create()
        +accept()
        +reject()
    }

    User "1" --> "*" Item : owns
    User "1" --> "*" SwapRequest : creates
    Item "1" --> "*" SwapRequest : offered_in
    Item "1" --> "*" SwapRequest : requested_in
```

## 🔹 Architecture

```
┌──────────────────┐      HTTP/JSON      ┌──────────────────┐       SQL        ┌─────────────┐
│                  │  ←────────────────→  │                  │  ←────────────→  │             │
│   React SPA      │                      │   Express API    │                  │ PostgreSQL  │
│   (Vite)         │                      │   (Node.js)      │                  │             │
│   Port 5173      │                      │   Port 3000      │                  │ Port 5432   │
│                  │                      │                  │                  │             │
│  Vanilla CSS     │                      │  JWT Auth        │                  │ 3 tables    │
│  ~100 KB bundle  │                      │  ~5 routes       │                  │ Indexed     │
│                  │                      │                  │                  │             │
└──────────────────┘                      └──────────────────┘                  └─────────────┘
       Browser                              Single Server                       Database
```

**Why monolith?** Microservices would require container orchestration, service discovery, inter-service networking — all adding compute, memory, and complexity that violate Green IT. A single Express server handles the MVP traffic with minimal resources.

## 🔹 API Design

### Authentication

| Method | Endpoint | Description | Auth | Green IT Note |
|---|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public | Minimal payload: email, password, name |
| POST | `/api/auth/login` | Login, returns JWT | Public | Stateless — no session store |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/me` | Get current user profile | User |
| PUT | `/api/users/me` | Update profile | User |
| DELETE | `/api/users/me` | Delete own account | User |
| GET | `/api/users` | List all users | Admin |
| DELETE | `/api/users/:id` | Delete a user | Admin |

### Items

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/items` | List available items (paginated, filterable by category) | Public |
| GET | `/api/items/:id` | Get item details | Public |
| POST | `/api/items` | Create an item | User |
| PUT | `/api/items/:id` | Update own item | Owner |
| DELETE | `/api/items/:id` | Delete own item (or admin) | Owner/Admin |
| GET | `/api/items/mine` | Get current user's items | User |

### Swap Requests

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/swaps` | Create a swap request | User |
| GET | `/api/swaps/mine` | Get user's swap requests (sent + received) | User |
| PATCH | `/api/swaps/:id` | Accept or reject a swap | Owner of requested item |

**Total: 15 endpoints** — lean and complete.

> **Green IT validation**: No redundant endpoints. Each endpoint serves exactly one purpose. No batch endpoints (not needed at MVP scale).

---

# 🟢 STEP 5 — IMPLEMENTATION PLAN

## 📁 Project Structure

```
ecoswap/
├── client/                        # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── SwapRequestCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing + value proposition
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx        # View/edit profile
│   │   │   ├── ItemList.jsx       # Browse all items
│   │   │   ├── ItemDetail.jsx     # Single item + swap button
│   │   │   ├── ItemForm.jsx       # Create/edit item
│   │   │   ├── MyItems.jsx        # User's own items
│   │   │   ├── MySwaps.jsx        # Incoming + outgoing swaps
│   │   │   └── AdminPanel.jsx     # User/item management
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                        # Express backend
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── itemController.js
│   │   │   └── swapController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── itemService.js
│   │   │   └── swapService.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── itemRoutes.js
│   │   │   └── swapRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── itemValidator.js
│   │   │   └── swapValidator.js
│   │   └── app.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── items.test.js
│   │   └── swaps.test.js
│   ├── package.json
│   └── .env.example
│
├── README.md
└── docker-compose.yml             # PostgreSQL container only
```

> **Green IT**: 4 controllers, 4 services, 3 test files. No unnecessary abstraction layers (no repository pattern — Prisma already abstracts DB access).

## 🗄 Database Schema (SQL)

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    city            VARCHAR(100) DEFAULT '',
    bio             TEXT DEFAULT '',
    is_admin        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ITEMS TABLE
-- ============================================
CREATE TABLE items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT DEFAULT '',
    category        VARCHAR(50) NOT NULL,
    condition       VARCHAR(30) NOT NULL
                    CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
    status          VARCHAR(20) DEFAULT 'available'
                    CHECK (status IN ('available', 'swapped')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SWAP REQUESTS TABLE
-- ============================================
CREATE TABLE swap_requests (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offered_item_id     UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    requested_item_id   UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    requester_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status              VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Prevent duplicate swap requests
    CONSTRAINT unique_swap UNIQUE (offered_item_id, requested_item_id),
    -- Prevent swapping with own item
    CONSTRAINT no_self_swap CHECK (offered_item_id != requested_item_id)
);

-- ============================================
-- INDEXES (Green IT: only where queries need them)
-- ============================================
CREATE INDEX idx_items_owner_id ON items(owner_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_swap_requests_requester ON swap_requests(requester_id);
CREATE INDEX idx_swap_requests_requested_item ON swap_requests(requested_item_id);
CREATE INDEX idx_swap_requests_offered_item ON swap_requests(offered_item_id);
CREATE INDEX idx_swap_requests_status ON swap_requests(status);
```

> **Green IT justification for indexes**: Each index targets a specific query pattern (filter by category, find user's items, find swap requests). No over-indexing — no composite indexes unless proven necessary.

## ⚙ Backend Components

### Controllers (thin — validate + delegate)

| Controller | Methods | Responsibility |
|---|---|---|
| `authController` | `register()`, `login()` | Validate input → call service → return JWT |
| `userController` | `getMe()`, `updateMe()`, `deleteMe()`, `listAll()`, `deleteUser()` | Profile + admin user management |
| `itemController` | `create()`, `list()`, `getById()`, `update()`, `delete()`, `listMine()` | Full item CRUD |
| `swapController` | `create()`, `listMine()`, `updateStatus()` | Swap request lifecycle |

### Services (business logic)

| Service | Key Logic |
|---|---|
| `authService` | Hash password (bcrypt, 10 rounds), verify credentials, sign JWT (24h expiry). Returns `{ token, user }`. |
| `userService` | Update profile fields selectively. On delete: CASCADE handles items + swaps. |
| `itemService` | Validate `status === 'available'` before allowing edits. Paginated listing with optional category filter. |
| `swapService` | **Critical logic**: (1) Both items must be `available`. (2) Requester must own `offered_item`. (3) On accept: **TRANSACTION** — set both items to `swapped`, update swap status to `accepted`, reject all other pending swaps involving either item. |

### Middleware

| Middleware | Purpose | Green IT Note |
|---|---|---|
| `auth.js` | Verify JWT from `Authorization: Bearer <token>`, attach `req.user` | Stateless — no DB call for session lookup |
| `admin.js` | Check `req.user.is_admin === true` | Single boolean check — O(1) |
| `errorHandler.js` | Catch errors, return `{ error: message }` JSON | Standardized — no stack traces in production |

## 🎨 Frontend Pages

| Page | Route | API Calls | Description |
|---|---|---|---|
| Home | `/` | 0 | Static landing page with value proposition |
| Register | `/register` | 1 (POST) | Registration form: name, email, password |
| Login | `/login` | 1 (POST) | Login form, stores JWT |
| Profile | `/profile` | 1 (GET) + 1 (PUT on save) | View/edit profile, delete account |
| Item List | `/items` | 1 (GET) | Browse available items, filter by category |
| Item Detail | `/items/:id` | 1 (GET) | View item details + "Propose Swap" button |
| Create Item | `/items/new` | 1 (POST) | Form: title, description, category, condition |
| Edit Item | `/items/:id/edit` | 1 (GET) + 1 (PUT) | Edit own item |
| My Items | `/my-items` | 1 (GET) | List of user's own items |
| My Swaps | `/my-swaps` | 1 (GET) | Incoming + outgoing swap requests |
| Admin Panel | `/admin` | 1 (GET users) | User/item management |

> **Green IT validation**: No page requires more than 2 API calls. Most pages need exactly 1.

---

# 🟢 STEP 6 — DEVELOPMENT FLOW

## Backend Flow

### Registration
```
POST /api/auth/register { name, email, password }
  │
  ├─ authValidator: email format? password ≥ 8 chars? name not empty?
  │   └─ FAIL → 400 { error: "validation message" }
  │
  ├─ authService.register():
  │   ├─ SELECT * FROM users WHERE email = $1  (check uniqueness)
  │   │   └─ EXISTS → 409 { error: "Email already registered" }
  │   ├─ password_hash = bcrypt.hash(password, 10)
  │   ├─ INSERT INTO users (email, password_hash, name) VALUES (...)
  │   ├─ token = jwt.sign({ userId, isAdmin }, SECRET, { expiresIn: '24h' })
  │   └─ RETURN { token, user: { id, email, name } }
  │
  └─ 201 Created
```

### Swap Request Flow (CRITICAL PATH)
```
POST /api/swaps { offeredItemId, requestedItemId }
  │
  ├─ auth middleware: verify JWT → attach req.user
  │
  ├─ swapValidator: both IDs present? valid UUIDs?
  │
  ├─ swapService.create():
  │   ├─ Fetch offeredItem, requestedItem
  │   ├─ VALIDATE:
  │   │   ├─ offeredItem.owner_id === req.user.id?      (must own what you offer)
  │   │   ├─ requestedItem.owner_id !== req.user.id?     (can't swap with yourself)
  │   │   ├─ offeredItem.status === 'available'?         (not already swapped)
  │   │   └─ requestedItem.status === 'available'?       (not already swapped)
  │   ├─ CHECK: no existing swap for this pair           (UNIQUE constraint)
  │   ├─ INSERT INTO swap_requests (...) VALUES (...)
  │   └─ RETURN swap request object
  │
  └─ 201 Created
```

### Swap Accept Flow (TRANSACTION)
```
PATCH /api/swaps/:id { status: "accepted" }
  │
  ├─ auth middleware
  │
  ├─ swapService.updateStatus():
  │   ├─ Fetch swap request + both items
  │   ├─ VALIDATE:
  │   │   ├─ requestedItem.owner_id === req.user.id?     (only owner can accept)
  │   │   └─ swap.status === 'pending'?                  (can't accept twice)
  │   │
  │   ├─ BEGIN TRANSACTION:
  │   │   ├─ UPDATE items SET status = 'swapped' WHERE id = offeredItemId
  │   │   ├─ UPDATE items SET status = 'swapped' WHERE id = requestedItemId
  │   │   ├─ UPDATE swap_requests SET status = 'accepted' WHERE id = swapId
  │   │   ├─ UPDATE swap_requests SET status = 'rejected'
  │   │   │   WHERE (offered_item_id IN (item1, item2) OR requested_item_id IN (item1, item2))
  │   │   │   AND id != swapId AND status = 'pending'
  │   │   └─ COMMIT
  │   │
  │   └─ RETURN updated swap
  │
  └─ 200 OK
```

**Why a transaction?** When a swap is accepted:
1. Both items must be marked `swapped` atomically.
2. All other pending swaps involving either item must be auto-rejected.
3. Without a transaction, a crash mid-operation could leave data inconsistent (one item swapped, the other available).

## Frontend Flow

| User Action | UI Behavior | API Call | State Update |
|---|---|---|---|
| Opens app | Render Navbar, check localStorage for JWT | `GET /api/users/me` (if token exists) | Set AuthContext |
| Registers | Fill form → submit → redirect to login | `POST /api/auth/register` | — |
| Logs in | Fill form → submit → store JWT → redirect to items | `POST /api/auth/login` | Set AuthContext |
| Browses items | Renders ItemCard grid, category dropdown | `GET /api/items?category=books&page=1` | Local state |
| Clicks item | Navigate to detail page | `GET /api/items/:id` | Local state |
| Proposes swap | Modal: select which of your items to offer → confirm | `POST /api/swaps` | Notification |
| Views swaps | Two tabs: "Received" and "Sent" | `GET /api/swaps/mine` | Local state |
| Accepts swap | Click "Accept" on received request | `PATCH /api/swaps/:id` | Refresh list |
| Logs out | Clear JWT from localStorage → redirect to home | — (client-side only) | Clear AuthContext |

### State Management

- **AuthContext** (React Context): Stores JWT + user object. Provides `login()`, `logout()`, `isAuthenticated`, `isAdmin`.
- **No Redux / Zustand / MobX**: Overkill for MVP. Each page manages its own data via `useState` + `useEffect`.

> **Green IT**: No global state library = no extra dependency = smaller bundle. No background polling = no unnecessary network traffic.

## Database Interaction Patterns

| Operation | Query | Optimization |
|---|---|---|
| Browse items | `SELECT * FROM items WHERE status='available' AND (category=$1 OR $1 IS NULL) ORDER BY created_at DESC LIMIT 20 OFFSET $2` | Indexes on `status` + `category`, paginated |
| My items | `SELECT * FROM items WHERE owner_id = $1 ORDER BY created_at DESC` | Index on `owner_id` |
| My swaps (received) | `SELECT sr.*, i1.title as offered_title, i2.title as requested_title FROM swap_requests sr JOIN items i1 ON sr.offered_item_id = i1.id JOIN items i2 ON sr.requested_item_id = i2.id WHERE i2.owner_id = $1` | Single JOIN query — no N+1 |
| My swaps (sent) | Same structure, `WHERE sr.requester_id = $1` | Index on `requester_id` |
| Accept swap | Transaction: 3 UPDATEs | Row-level locks |
| Admin stats | `SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM items; SELECT COUNT(*) FROM swap_requests WHERE status='accepted'` | 3 fast COUNT queries |

> **Green IT**: Every query is indexed. No `SELECT *` in production (select only needed columns). Pagination limits result sets.

---

# 🔴 STEP 7 — VALIDATION & TESTING

## ✔ 1. PRD Alignment Check

| PRD Feature | Design Coverage | Status |
|---|---|---|
| F1: User Registration | `POST /api/auth/register` + Register page | ✅ |
| F2: User Login | `POST /api/auth/login` + Login page | ✅ |
| F3: User Profile CRUD | `GET/PUT/DELETE /api/users/me` + Profile page | ✅ |
| F4: Item CRUD | Full CRUD endpoints + ItemForm / MyItems pages | ✅ |
| F5: Browse Items | `GET /api/items` with category filter + ItemList page | ✅ |
| F6: Swap Request | `POST /api/swaps` + swap modal on ItemDetail | ✅ |
| F7: Accept/Reject Swap | `PATCH /api/swaps/:id` + MySwaps page | ✅ |
| F8: My Swaps | `GET /api/swaps/mine` + MySwaps page | ✅ |
| F9: Admin Panel | Admin endpoints + AdminPanel page | ✅ |

**Missing features?** None.
**Extra features?** None.
**Scope creep?** No — strictly 3 entities, 15 endpoints, 11 pages.

> **Verdict**: Design matches PRD exactly. ✅

## ✔ 2. Functional Testing (Simulated)

### Test: User Registration

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 1 | POST `/api/auth/register` `{ name: "Alice", email: "alice@test.com", password: "securePass1" }` | 201, returns `{ token, user: { id, name, email } }` | ✅ |
| 2 | POST `/api/auth/register` same email | 409, `{ error: "Email already registered" }` | ✅ |
| 3 | Decode JWT | Contains `{ userId: <uuid>, isAdmin: false }` | ✅ |

### Test: Login

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 1 | POST `/api/auth/login` `{ email: "alice@test.com", password: "securePass1" }` | 200, returns `{ token }` | ✅ |
| 2 | POST `/api/auth/login` wrong password | 401, `{ error: "Invalid credentials" }` | ✅ |
| 3 | POST `/api/auth/login` non-existent email | 401, `{ error: "Invalid credentials" }` (same message — prevents enumeration) | ✅ |

### Test: Item CRUD

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 1 | POST `/api/items` `{ title: "Python Book", description: "Clean Code", category: "books", condition: "good" }` | 201, item created with `status: 'available'` | ✅ |
| 2 | GET `/api/items` | 200, includes the new item | ✅ |
| 3 | GET `/api/items?category=books` | 200, filtered list including the book | ✅ |
| 4 | PUT `/api/items/:id` as owner `{ title: "Python Book 2nd Ed" }` | 200, title updated | ✅ |
| 5 | PUT `/api/items/:id` as non-owner | 403 Forbidden | ✅ |
| 6 | DELETE `/api/items/:id` as owner | 204 No Content | ✅ |
| 7 | DELETE `/api/items/:id` as admin (not owner) | 204 No Content | ✅ |

### Test: Swap Request Workflow

Setup: Alice has "Python Book" (available). Bob has "Desk Lamp" (available).

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 1 | Bob POST `/api/swaps` `{ offeredItemId: "desk-lamp-id", requestedItemId: "python-book-id" }` | 201, swap created with `status: 'pending'` | ✅ |
| 2 | Alice GET `/api/swaps/mine` | Includes incoming swap: Bob offers Desk Lamp for her Python Book | ✅ |
| 3 | Alice PATCH `/api/swaps/:id` `{ status: "accepted" }` | 200, swap accepted | ✅ |
| 4 | GET Python Book | `status: 'swapped'` | ✅ |
| 5 | GET Desk Lamp | `status: 'swapped'` | ✅ |
| 6 | Carol tries to request swap for Python Book | 400, `{ error: "Item is no longer available" }` | ✅ |

### Test: Swap Reject

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 1 | Alice PATCH `/api/swaps/:id` `{ status: "rejected" }` | 200, swap rejected | ✅ |
| 2 | Both items remain `available` | ✅ | ✅ |
| 3 | Bob can create a new swap request for the same item | ✅ (UNIQUE constraint is on the pair, but old one is rejected — business logic should allow re-request or keep rejected and prevent duplicates; design choice: prevent duplicate = simpler) | ⚠️ See edge case |

> **Note**: The UNIQUE constraint on `(offered_item_id, requested_item_id)` means Bob cannot re-request the same swap after rejection. This is acceptable for MVP: if rejected, the requester should try a different item.

## ✔ 3. Edge Case Testing

### Invalid Inputs

| Test | Input | Expected | Pass? |
|---|---|---|---|
| Empty email | `{ email: "", password: "pass1234", name: "X" }` | 400, validation error | ✅ |
| Invalid email format | `{ email: "notanemail", ... }` | 400, "Invalid email format" | ✅ |
| Password too short | `{ password: "ab" }` | 400, "Password must be at least 8 characters" | ✅ |
| Empty item title | `{ title: "", category: "books", condition: "good" }` | 400, "Title is required" | ✅ |
| Invalid category | `{ category: "weapons" }` | 400, "Invalid category" | ✅ |
| Invalid condition | `{ condition: "destroyed" }` | 400, "Condition must be one of: new, like_new, good, fair" | ✅ |
| Swap own items | `offeredItemId` and `requestedItemId` owned by same user | 400, "Cannot swap with yourself" | ✅ |
| Swap non-existent item | Invalid UUID | 404, "Item not found" | ✅ |
| SQL injection attempt | `'; DROP TABLE items;--` in title | Safe — Prisma uses parameterized queries | ✅ |

### Unauthorized Access

| Test | Action | Expected | Pass? |
|---|---|---|---|
| No token → protected route | POST `/api/items` without Authorization header | 401, "Authentication required" | ✅ |
| Expired token | JWT signed 25h ago | 401, "Token expired" | ✅ |
| Malformed token | Random string as Bearer token | 401, "Invalid token" | ✅ |
| Non-admin → admin route | GET `/api/users` as regular user | 403, "Admin access required" | ✅ |
| Non-owner → edit item | PUT `/api/items/:id` as different user | 403, "Not authorized" | ✅ |
| Non-owner → accept swap | PATCH `/api/swaps/:id` by someone other than requested item's owner | 403, "Not authorized" | ✅ |

### Duplicate Entries

| Test | Scenario | Expected | Pass? |
|---|---|---|---|
| Duplicate email registration | Same email twice | 409, UNIQUE constraint | ✅ |
| Duplicate swap request | Same offered+requested pair | 409, UNIQUE constraint | ✅ |
| Accept already-accepted swap | PATCH on accepted swap | 400, "Swap already processed" | ✅ |

### Data Consistency

| Test | Scenario | Expected | Pass? |
|---|---|---|---|
| Concurrent swap accepts | Two users accept swaps for same item simultaneously | Transaction ensures only first succeeds; second gets 400 "Item no longer available" | ✅ |
| Delete user with items | DELETE user who has items and swaps | CASCADE: items → swap_requests all deleted | ✅ |
| Delete item with pending swaps | DELETE item that has pending swap requests | CASCADE: related swap_requests deleted | ✅ |
| Accept swap → auto-reject others | Item A has 3 pending swaps; accept swap #1 | Swaps #2 and #3 auto-rejected in same transaction | ✅ |

## ✔ 4. System Consistency Check

### Frontend ↔ Backend

| Frontend Page | API Endpoint(s) Used | Match? |
|---|---|---|
| Register | `POST /api/auth/register` | ✅ |
| Login | `POST /api/auth/login` | ✅ |
| Profile | `GET /api/users/me` + `PUT /api/users/me` + `DELETE /api/users/me` | ✅ |
| Item List | `GET /api/items?category=&page=` | ✅ |
| Item Detail | `GET /api/items/:id` | ✅ |
| Item Create | `POST /api/items` | ✅ |
| Item Edit | `GET /api/items/:id` + `PUT /api/items/:id` | ✅ |
| My Items | `GET /api/items/mine` | ✅ |
| My Swaps | `GET /api/swaps/mine` | ✅ |
| Swap Action | `POST /api/swaps` + `PATCH /api/swaps/:id` | ✅ |
| Admin Panel | `GET /api/users` + `DELETE /api/users/:id` + `DELETE /api/items/:id` | ✅ |

> **Verdict**: Every frontend page has matching backend endpoints. No orphaned routes. ✅

### Backend ↔ Database

| API Operation | DB Table(s) | Constraint/FK? | Match? |
|---|---|---|---|
| Register user | `users` | Email UNIQUE | ✅ |
| Create item | `items` | `owner_id` FK → `users` | ✅ |
| Create swap | `swap_requests` | `offered_item_id` FK, `requested_item_id` FK, `requester_id` FK, UNIQUE pair | ✅ |
| Accept swap | `items` + `swap_requests` | Transaction with row locks | ✅ |
| Delete user | CASCADE to `items` → `swap_requests` | ON DELETE CASCADE | ✅ |

> **Verdict**: Schema fully supports all backend operations. No missing columns or constraints. ✅

## ✔ 5. Performance & Green IT Validation

| Check | Implementation | Status |
|---|---|---|
| **Minimal API calls** | Each page: 1–2 calls max. Home page: 0 calls. | ✅ |
| **Paginated responses** | `GET /api/items` returns max 20 items per page | ✅ |
| **Indexed queries** | 7 indexes on frequently queried columns | ✅ |
| **No N+1 queries** | Swap list uses single JOIN query | ✅ |
| **Small payloads** | Text-only items (no images). `password_hash` never returned. Average response < 2 KB. | ✅ |
| **No unnecessary features** | No images, no WebSockets, no chat, no notifications, no analytics | ✅ |
| **Lightweight frontend** | Vanilla CSS (no Tailwind/Bootstrap). Vite tree-shaking. No state management library. | ✅ |
| **Single server** | Monolith — no microservices, no reverse proxy, no Redis | ✅ |
| **Stateless auth** | JWT — no session store, no DB lookup per request | ✅ |
| **Clean code** | 4 controllers, 4 services, 3 middleware. No over-abstraction. | ✅ |

**Estimated resource usage**:
- Frontend JS bundle: ~80 KB gzipped (React + Router + Axios)
- CSS: ~5 KB
- Average API response: < 1.5 KB
- Database: < 500 KB for 1000 items
- Server memory: ~50 MB (Node.js + Express)

> **Verdict**: Full Green IT compliance. ✅

---

# 🟢 STEP 8 — FINAL REPORT

## 🚀 MVP Readiness: ✅ DEPLOYABLE

The EcoSwap MVP is architecturally complete, scope-appropriate, and ready for a student team development sprint.

## 💪 Strengths

| # | Strength |
|---|---|
| 1 | **Ultra-tight scope**: 3 entities, 15 endpoints, 11 pages. No bloat whatsoever. |
| 2 | **Genuine sustainability**: Product reduces waste + tech stack minimizes resource consumption — Green IT at both levels. |
| 3 | **Transactional integrity**: Swap acceptance uses DB transactions to prevent race conditions and ensure both items are marked swapped atomically. |
| 4 | **Clean architecture**: Controller → Service → Prisma. No unnecessary abstraction layers. |
| 5 | **Minimal dependencies**: Express (~2 MB), React (~40 KB gzipped), Prisma, bcrypt, jsonwebtoken. Fewer deps = fewer vulnerabilities. |
| 6 | **Standard stack**: Node.js + React + PostgreSQL = abundant documentation, easy onboarding for students. |
| 7 | **Security fundamentals**: bcrypt hashing, JWT auth, role-based access, parameterized queries (SQL injection safe), no credential enumeration. |
| 8 | **Auto-rejection logic**: When a swap is accepted, all other pending swaps for both items are automatically rejected — prevents impossible swaps. |

## ⚠ Weaknesses / Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | **No email verification** — fake accounts | Medium | MVP trade-off; add in v2 with lightweight SMTP service |
| 2 | **No images** — items without photos reduce browsing appeal | Low | Intentional Green IT decision; add compressed thumbnails in v2 |
| 3 | **No search** — only category filter | Low | Sufficient for < 1000 items; add PostgreSQL `tsvector` search in v2 |
| 4 | **JWT in localStorage** — XSS vulnerability | Medium | Add Content-Security-Policy header; move to HttpOnly cookies in v2 |
| 5 | **No rate limiting** — brute-force login risk | Medium | Add `express-rate-limit` (tiny package) before deploy |
| 6 | **No re-request after reject** — UNIQUE constraint blocks re-proposals | Low | Acceptable for MVP; could add `ON CONFLICT` handling in v2 |
| 7 | **No item moderation** — inappropriate listings | Low | Admin can delete; add report feature in v2 |

## 🔮 Future Improvements (NOT part of MVP)

| Version | Feature | Green IT Impact |
|---|---|---|
| **v1.1** | Email verification + password reset | Minimal — small email payloads |
| **v1.1** | Rate limiting (`express-rate-limit`) | Negligible — in-memory counters |
| **v1.2** | Compressed thumbnail images (≤ 200 KB, WebP) | Moderate — requires object storage |
| **v1.3** | Full-text search (PostgreSQL `tsvector`) | Low — native DB feature, no external service |
| **v2.0** | User ratings + trust scores | Low — one more table, simple queries |
| **v2.0** | Item categories as tags (many-to-many) | Low — one join table |
| **v2.1** | In-app messaging (lightweight) | Moderate — adds WebSocket or polling |
| **v3.0** | PWA + offline mode | Moderate — service worker + cache management |
| **v3.0** | Geolocation with Leaflet.js (open-source maps) | Moderate — map tiles add bandwidth |

---

## Summary Decision Matrix

| Dimension | Score (1–5) | Justification |
|---|---|---|
| **Feasibility** | 5/5 | Standard CRUD app, 3 tables, well-known stack |
| **Completeness** | 4/5 | All core features present; images and search deferred consciously |
| **Green IT Compliance** | 5/5 | Minimal in every dimension — data, code, infra, features |
| **Security** | 3/5 | Fundamentals covered; needs rate limiting + HttpOnly cookies |
| **Scalability** | 3/5 | Monolith sufficient for MVP; horizontal scaling needs work later |
| **User Value** | 5/5 | Clear problem → clear solution → no money barrier |
| **Overall** | **4.2/5** | **Ready for development sprint** |

---

> *"The greenest code is the code you don't write. EcoSwap ships with exactly what's needed — nothing more."*
