# SafeFood / TrustLabel Platform

An AI-powered product label verification and Legal Metrology (Packaged Commodities) compliance platform comprising a modern React + Vite frontend dashboard and a high-performance backend API.

---

## 🏗️ Architecture & Features

TrustLabel provides dedicated, role-based workflows for citizens, field enforcement officers, and system administrators:

```text
trustlabel-frontend/
├── src/
│   ├── components/
│   │   ├── admin/            # OfficerVerificationIndicator, AssignComplaintModal
│   │   ├── auth/             # ProtectedRoute, RoleRoute
│   │   ├── common/           # Button, Card, Modal, Toast, StatusBadge, Table, Skeleton, Pagination
│   │   ├── complaints/       # ComplaintStatusBadge, ComplaintTimeline
│   │   ├── layout/           # DashboardLayout, Sidebar, Topbar, BottomNav (Mobile)
│   │   ├── reports/          # ComplianceResult, ProductInfoCard, ChecklistCard, IssueCard
│   │   └── scanner/          # ImageUploader, ImagePreview, AnalysisLoader
│   ├── context/              # AuthContext & role session management
│   ├── hooks/                # useAuth, useToast
│   ├── pages/
│   │   ├── admin/            # AdminDashboard, AdminUsers, AdminOfficers, AdminComplaints, AdminComplaintDetail
│   │   ├── auth/             # LoginPage, RegisterPage
│   │   ├── common/           # Shared SettingsPage
│   │   ├── officer/          # OfficerDashboard, OfficerScan, OfficerHistory, OfficerReport, OfficerInvestigations, OfficerInvestigationDetail
│   │   ├── public/           # LandingPage, AccessDeniedPage, NotFoundPage
│   │   └── user/             # UserDashboard, UserScan, UserHistory, UserReport, UserComplaints, UserComplaintNew, UserComplaintDetail
│   └── services/             # scan.js, complaints.js, admin.js, auth.js, api.js
```

---

## 👥 Role-Based Panels & Workflows

### 1. Consumer / Citizen Panel (`/app/user/*`)
- **Dashboard** (`/app/user/dashboard`): Citizen overview, stats (*My Scans*, *Looks Good*, *Possible Issues*), "Scan a Label" CTA, recent scans, and live tracked complaints.
- **Scan Label** (`/app/user/scan`): Simplified AI label scanner for pre-packaged commodities. If non-compliant, provides a direct **"Report this product"** action.
- **My History** (`/app/user/history`): Citizen scan history with search and pagination.
- **Scan Report** (`/app/user/report/:id`): Simplified citizen audit report with clear declarations checklist.
- **Raise a Complaint** (`/app/user/complaints/new`): File grievances with product name, purchase store location, detailed description, photographic evidence, and optional scan reference.
- **My Complaints** (`/app/user/complaints`): Track grievance progress across *Submitted*, *In Progress*, and *Resolved* tabs.
- **Complaint Details** (`/app/user/complaints/:id`): Friendly status banners and sanitized timeline without internal officer notes.

### 2. Enforcement Officer Panel (`/app/officer/*`)
- **Dashboard** (`/app/officer/dashboard`): Metric counters (*Total Scans*, *Compliant Products*, *Products With Issues*, *Pending Investigations*) and recent inspections.
- **Label Scanner** (`/app/officer/scan`): Optical OCR and Legal Metrology PCR 2011 compliance analyzer.
- **Inspection History** (`/app/officer/history`): Paginated audit records with search and status filters (*Compliant*, *Non-Compliant*, *Warnings*).
- **Inspection Report** (`/app/officer/report/:id`): Complete statutory audit dossier with OCR data, PCR compliance scores, statutory checklists, and violation notices.
- **Assigned Investigations** (`/app/officer/investigations`): Case queue for grievances assigned to the officer (*Assigned*, *Under Investigation*, *Completed*).
- **Investigation & Decision Dossier** (`/app/officer/investigations/:id`):
  - **"Start Investigation"** (`assigned` $\rightarrow$ `under_investigation`).
  - **"Scan this product's label"** quick scanner shortcut.
  - Officer notes input with validation.
  - **"Verify as Genuine"** (green) & **"Mark as Not Genuine"** (red) decision workflows with statutory confirmation modals and timeline tracking.

### 3. System Administrator Panel (`/app/admin/*`)
- **Dashboard** (`/app/admin/dashboard`): Platform KPIs, *Needs Attention* unassigned complaints queue with one-click officer assignment, and live grievances table.
- **Users Management** (`/app/admin/users`): Directory of registered citizens, total scans, grievances raised, profile drawer, and *Suspend / Activate* toggle with confirmation modal.
- **Officers Management** (`/app/admin/officers`): Authorized field inspectors directory with real-time computed workload indicators, complaints queue drawer, and *Add Officer* modal.
- **Complaint Dispatch & Oversight** (`/app/admin/complaints`): Full grievances queue with filter tabs, search, and `OfficerVerificationIndicator` displaying live green ticks or red crosses.
- **Complaint Management Detail** (`/app/admin/complaints/:id`): Full grievance dossier, consumer proof, officer audit notes, resolution banner, and *Assign / Reassign* modal.

---

## 🔑 Demo Mock Credentials

The frontend operates in standalone demo mode (`VITE_USE_MOCK=true`) with localStorage persistence:

| Role | Panel Route | Email | Password |
|---|---|---|---|
| **Citizen / Consumer** | `/app/user/dashboard` | `user@test.com` | *Any password* |
| **Enforcement Officer** | `/app/officer/dashboard` | `officer@test.com` | *Any password* |
| **System Administrator** | `/app/admin/dashboard` | `admin@test.com` | *Any password* |

---

## 🔄 End-to-End Complaint Lifecycle

1. **Citizen logs in** (`user@test.com`) $\rightarrow$ Scans a non-compliant product $\rightarrow$ Clicks **"Report this product"** $\rightarrow$ Fills form and uploads evidence photo $\rightarrow$ Status is `submitted`.
2. **Admin logs in** (`admin@test.com`) $\rightarrow$ Sees new grievance in *Needs Attention* on dashboard $\rightarrow$ Clicks **"Assign"** $\rightarrow$ Selects `Insp. Priya Verma` based on workload $\rightarrow$ Status updates to `assigned`.
3. **Officer logs in** (`officer@test.com`) $\rightarrow$ Navigates to *Assigned Investigations* $\rightarrow$ Clicks **"Start Investigation"** (`under_investigation`) $\rightarrow$ Scans the package on-site $\rightarrow$ Inputs findings into the notes $\rightarrow$ Clicks **"Verify as Genuine"** and confirms $\rightarrow$ Status updates to `verified_genuine`.
4. **Admin verifies** $\rightarrow$ Sees the **Green Tick** beside `Insp. Priya Verma` indicating confirmed statutory violation.
5. **Citizen checks status** $\rightarrow$ Sees **"✓ Your complaint was verified as genuine - Action Taken"** on their timeline.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 🔌 Backend Endpoints Specification

For complete backend persistence with a live MongoDB/Express server, implement the following endpoints:

### Authentication Endpoints
- `POST /api/v1/auth/login` — Authenticate user and return JWT bearer token.
- `POST /api/v1/auth/google` — Authenticate via Google OAuth.
- `POST /api/v1/auth/register` — Register a new citizen account.

### Label Verification & Scans
- `POST /api/v1/scan` (or `/api/scan`) — Upload packaging photo (`multipart/form-data` with field `label`), execute OCR & PCR 2011 rule validation.
- `GET /api/v1/scans` (or `/api/scans`) — Paginated scans list (`?page=1&limit=10&search=...&status=...`).
- `GET /api/v1/scans/:id` — Full inspection dossier by scan ID.
- `GET /api/v1/officer/stats` — Metrics for officer dashboard.

### Grievances & Complaints Workflow
- `POST /api/v1/complaints` — Create a new consumer grievance (`title`, `productName`, `storeOrLocation`, `description`, `imageUrl`, `scanId`).
- `GET /api/v1/complaints` — Filtered complaints list (`?status=...&search=...&page=...&limit=...`).
- `GET /api/v1/complaints/:id` — Single complaint details with audit timeline.
- `PATCH /api/v1/complaints/:id/assign` — Assign or reassign officer (`{ officerId, note }`).
- `PATCH /api/v1/complaints/:id/status` — Officer updates status (`{ status: "under_investigation" | "verified_genuine" | "verified_not_genuine", notes, actionTaken }`).

### System Administration
- `GET /api/v1/admin/stats` — Platform counters (*totalUsers*, *totalOfficers*, *totalComplaints*, *pendingAssignment*, *verifiedGenuine*).
- `GET /api/v1/admin/users` — Registered users list with search and status filtering.
- `PATCH /api/v1/admin/users/:id/status` — Toggle user active/suspended state.
- `GET /api/v1/admin/officers` — Authorized officers directory with workload calculations.
- `POST /api/v1/admin/officers` — Register a new enforcement inspector account.

---

## 📄 License
MIT
