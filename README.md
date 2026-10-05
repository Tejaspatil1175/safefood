# SafeFood

SafeFood is an offline-first label compliance checker for packaged commodities. It reads packaged product labels, extracting mandatory declarations and measuring printed character heights against Legal Metrology (Packaged Commodities) Rules.

## Architecture

SafeFood backend is powered by Node.js, Express, and MongoDB:

```
Mobile Client (React Native)
        │
        ▼ HTTP (multipart upload)
┌─────────────────────────────────┐
│ backend                         │
│ (Node.js + Express + MongoDB)   │
│                                 │
│ - Scans & Compliance Engine     │
│ - Rules & Reference Products    │
│ - Label Extraction & Analysis   │
│ - Complaints & PDF Export       │
│ - Auth & User History           │
└─────────────────────────────────┘
```

- **`backend` (Node.js / Express / Mongoose)**: Core API handling business logic, rule evaluations, product cross-referencing, scan records, user authentication, and complaint generation.
- **`data/`**: Versioned, authoritative JSON datasets for legal rules, product references, and multilingual keywords.

## Tech Stack

- **Backend API**: Node.js (ES modules), Express, Mongoose, Zod, Pino
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Testing**: Vitest, Supertest

## Project Structure

```
safefood/
├── backend/                  # Express REST API (flat layout)
│   ├── config/               # Environment & app configuration
│   ├── infra/                # Database & storage connections
│   ├── lib/                  # Utilities, logging & helpers
│   ├── middlewares/          # Express middlewares
│   ├── modules/              # Feature modules (auth, rules, products, scans, etc.)
│   ├── scripts/              # Data seeding & migration scripts
│   └── tests/                # Unit & integration tests
├── data/
│   ├── rules/                # Legal Metrology rules definitions
│   ├── products/             # Verified reference product database
│   └── keywords/             # Label field keywords (multilingual)
├── fixtures/
│   └── labels/               # Test fixtures and labeled samples
└── .github/
    └── workflows/            # Continuous Integration workflows
```

## Getting Started

### Prerequisites
- Node.js LTS (v18+ recommended)
- MongoDB instance (Local or MongoDB Atlas URI)

### Backend API Setup (`backend`)
```bash
cd backend
npm install
npm test
npm run eval
npm run dev
```

## Evaluation & Accuracy Baseline

SafeFood continuously validates field extraction accuracy and compliance verdicts against labeled ground-truth label fixtures (`npm run eval`):

| Metric | Target | Baseline Result |
| :--- | :--- | :--- |
| **Verdict Agreement** | $\ge 90\%$ | **100.0%** (10/10) |
| **False-FAIL Rate** | $\le 5\%$ (Gate) | **0.0%** (0/7) |
| **Net Quantity Extraction** | $\ge 95\%$ | **100.0%** |
| **MRP Extraction** | $\ge 95\%$ | **100.0%** |
| **Country of Origin Extraction** | $\ge 90\%$ | **100.0%** |
| **FSSAI License Extraction** | $\ge 90\%$ | **100.0%** |

CI automatically enforces that the False-FAIL rate does not exceed the statutory threshold via `npm run eval:gate`.

## API Reference

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | None | Service liveness probe |
| `GET` | `/api/v1/health/ready` | None | MongoDB readiness health probe |
| `GET` | `/api/v1/rules/active` | None | Active PCR 2011 statutory rules |
| `GET` | `/api/v1/products/:barcode` | None | Lookup verified product by EAN barcode |
| `POST` | `/api/v1/scans` | Optional | Multi-image label compliance analysis |
| `GET` | `/api/v1/scans` | Optional | Paginated user scans list |
| `GET` | `/api/v1/scans/:id` | Optional | Get scan record and compliance report |
| `POST` | `/api/v1/auth/google` | None | Mobile Google ID token login |
| `POST` | `/api/v1/auth/refresh` | None | Refresh expired JWT access token |
| `GET` | `/api/v1/auth/me` | Bearer | Get authenticated user profile |
| `POST` | `/api/v1/complaints` | Bearer | File non-compliance complaint (FAIL scans only) |
| `GET` | `/api/v1/complaints` | Bearer | List complaints for current user |
| `GET` | `/api/v1/complaints/:id` | Bearer | Get complaint details |
| `GET` | `/api/v1/complaints/:id/export` | Bearer | Export complaint evidence as PDF document |

## Production Deployment Guide (Native PM2 & MongoDB Atlas)

SafeFood backend is designed for high-availability native execution without requiring Docker:

### 1. MongoDB Atlas Configuration
Create a MongoDB Atlas cluster and set `MONGO_URI` in `.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/safefood?retryWrites=true&w=majority
```

### 2. Seed Initial Rules & Verified Products
```bash
cd backend
node scripts/seed-rules.js
node scripts/seed-products.js
```

### 3. Start Clustered Process with PM2
```bash
npm install -g pm2
cd backend
npm run start:pm2
pm2 save
pm2 startup
```

### 4. Continuous Healthcheck Monitoring
```bash
npm run healthcheck
```

## License
MIT
