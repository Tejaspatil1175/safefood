# SafeFood Frontend

AI-powered packaged food label inspection, Legal Metrology (PCR 2011) compliance verification, and regulatory enforcement portal.

## Features
- **Instant Label Inspection**: Scan packaged goods for MRP, net weight, expiry/best before, mandatory declarations, and tiny illegible fonts.
- **Consumer Grievance Lodging**: File statutory complaints directly to district enforcement authorities.
- **Field Officer Portal**: On-ground inspection logs, violation auto-verification, and statutory case management.
- **District & State Administration**: District overview metrics, officer fleet management, and regulatory oversight.

## Tech Stack
- **Framework**: TanStack Start (Full-stack React 19)
- **Routing**: TanStack Router with file-based routing
- **Styling**: Tailwind CSS v4, Lucide Icons, Radix UI primitives
- **Bundler**: Vite & Nitro

## Getting Started

```bash
npm install
npm run dev
```

Server runs locally at `http://localhost:8080/`.

## Key Routes
- `/` — SafeFood Presentation & Interactive Scanner preview
- `/login` — SafeFood Portal Authentication & Role Picker
- `/register` — Account Registration (Citizen / Officer)
- `/app/user/*` — Citizen Consumer Portal
- `/app/officer/*` — Enforcement Officer Workspace
- `/app/admin/*` — District & Platform Administration
