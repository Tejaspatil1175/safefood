# SafeFood / TrustLabel Platform

An AI-powered product label verification and Legal Metrology (Packaged Commodities) compliance platform comprising a high-performance Node.js backend and a modern React + Vite frontend dashboard.

---

## 🏗️ Monorepo Structure

```text
safefood/
├── src/                      # TrustLabel React + Vite Frontend
│   ├── components/           # UI Kit & Layout components
│   ├── context/              # AuthContext & state management
│   ├── hooks/                # Custom React hooks (useAuth, useToast)
│   ├── pages/                # Role panels (User, Officer, Admin)
│   ├── services/             # Axios API client & service handlers
│   ├── styles/               # Tailwind CSS & design tokens
│   └── utils/                # Validation & formatters
├── backend/                  # Express REST API (flat layout)
│   ├── config/               # Environment & app configuration
│   ├── infra/                # MongoDB, GridFS, Gemini & Vision clients
│   ├── lib/                  # Utilities, logging & helpers
│   ├── middlewares/          # Express middlewares (Auth, RateLimit, Upload)
│   ├── modules/              # Modules (auth, compliance, rules, products, scans, etc.)
│   ├── scripts/              # Data seeding & migration scripts
│   └── tests/                # Unit & integration tests
├── data/
│   ├── rules/                # Legal Metrology rule definitions (PCR 2011)
│   ├── products/             # Reference product database
│   └── keywords/             # Multilingual keyword datasets
└── fixtures/
    └── labels/               # Ground-truth test fixtures and labeled samples
```

---

## 👥 Frontend: Three Role-Based Panels & Navigation

TrustLabel provides dedicated user experiences with role-based access control (RBAC):

1. **User Panel (`user`)**
   - **Dashboard** (`/app/user/dashboard`): Overview and metrics
   - **Scan Label** (`/app/user/scan`): Automated OCR & mandatory 8 declarations validation
   - **My History** (`/app/user/history`): Verified labels log and compliance report downloads
   - **My Complaints** (`/app/user/complaints`): Grievance & non-compliance filings
   - **Settings** (`/app/user/settings`): Account details

2. **Officer Panel (`officer`)**
   - **Dashboard** (`/app/officer/dashboard`): Statutory violation counters and triage
   - **Scan Label** (`/app/officer/scan`): Field inspection evidence collection
   - **Scan History** (`/app/officer/history`): Inspection logs and audit memos
   - **Assigned Investigations** (`/app/officer/investigations`): Citizen grievance escalation queue
   - **Settings** (`/app/officer/settings`): Officer badge credentials & jurisdiction

3. **Admin Panel (`admin`)**
   - **Dashboard** (`/app/admin/dashboard`): System KPIs, compliance trends & audit logs
   - **Users** (`/app/admin/users`): Directory of consumer accounts
   - **Officers** (`/app/admin/officers`): Authorized officers directory & zone assignments
   - **Complaints** (`/app/admin/complaints`): Global grievance tracking & resolution oversight
   - **Settings** (`/app/admin/settings`): Legal Metrology rule engine parameters

---

## 🔑 Demo Mock Credentials

The application supports both backend authentication and offline mock mode (`VITE_USE_MOCK=true` in `.env`):

| Role | Panel Route | Mock Email | Password |
|---|---|---|---|
| **Consumer / User** | `/app/user/dashboard` | `user@test.com` | *Any password* |
| **Enforcement Officer** | `/app/officer/dashboard` | `officer@test.com` | *Any password* |
| **System Admin** | `/app/admin/dashboard` | `admin@test.com` | *Any password* |

---

## 🚀 Getting Started

### 1. Frontend Development (`/`)

```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev

# Build frontend
npm run build
```

### 2. Backend API Setup (`/backend`)

```bash
cd backend
npm install
npm test
npm run eval
npm run dev
```

---

## 📄 License
MIT
