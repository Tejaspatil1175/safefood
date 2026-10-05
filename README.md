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

## License
MIT
