# SafeFood - Backend Implementation Guide

Offline-first Legal Metrology label compliance checker.
Scan a packaged product (e.g. a biscuit pack), read its label with OpenCV + Tesseract, and verify it against
the Packaged Commodities Rules using predefined data. No external API keys in the scanning pipeline.

Scope of this guide: backend only (API + vision service). Mobile client comes after the backend milestones pass.

---

## 1. Goals and non-goals

Goals
- Detect missing or malformed mandatory declarations on a label.
- Measure printed character height in mm and compare with the minimum required for that net quantity.
- Cross-check against a reference product record (by barcode) when one exists.
- Return an explainable report: every check has a status, a reason and evidence.
- Run with zero external API keys for scanning.

Non-goals (for now)
- Real submission to a government portal (complaints are stored and exported as PDF only).
- LLM or cloud OCR in the pipeline (kept behind an optional provider interface, disabled by default).
- Training custom ML models.

---

## 2. Architecture

```
React Native client
        |
        v   HTTPS (multipart image upload)
+------------------+         +-------------------------+
|  apps/api        |  HTTP   |  services/vision        |
|  Node + Express  | ------> |  Python + FastAPI       |
|                  |         |  OpenCV, Tesseract,     |
|  - auth          |         |  pyzbar                 |
|  - scans         | <------ |                         |
|  - extraction    |  JSON   |  - quality check        |
|  - compliance    |         |  - preprocess           |
|  - products      |         |  - OCR + glyph heights  |
|  - complaints    |         |  - barcode decode       |
+--------+---------+         |  - px-per-mm scale      |
         |                   +-------------------------+
         v
     MongoDB (+ GridFS for evidence images)

Predefined data (versioned in git, seeded to DB):
  data/rules/      legal rules (JSON)
  data/products/   reference products (JSON)
  data/keywords/   label keyword and synonym lists
```

Why two services
- OpenCV and Tesseract need native binaries that serverless platforms handle badly. Python has first-class bindings.
- Business logic (extraction, rules, persistence) stays in Node, deterministic and unit-testable without images.
- The vision service is stateless: image in, JSON out.

---

## 3. Tech stack

API (apps/api)
- Node.js LTS, ES modules, Express
- MongoDB + Mongoose
- zod (validation), pino (logging), helmet, cors, express-rate-limit
- multer with memory storage (uploads forwarded, not written to disk)
- Vitest + Supertest (tests), ESLint + Prettier

Vision (services/vision)
- Python 3, FastAPI + uvicorn, pydantic
- opencv-python-headless, numpy
- pytesseract (system Tesseract with `eng` and `hin` language data)
- pyzbar (system libzbar)
- pytest, ruff

Tooling
- Local development (Node.js LTS, local MongoDB or MongoDB Atlas, Python venv)
- GitHub Actions CI
- Install latest stable versions at implementation time and commit lockfiles. Do not copy version numbers from old guides.

---

## 4. Repository structure

```
safefood/
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- docs/
|   |-- IMPLEMENTATION_GUIDE.md
|   |-- architecture.md
|   |-- api.md
|   `-- adr/
|       |-- 0001-two-service-architecture.md
|       `-- 0002-offline-first-no-external-api.md
|-- data/
|   |-- rules/
|   |   `-- pcr-2011.v1.json
|   |-- products/
|   |   `-- products.seed.json
|   `-- keywords/
|       |-- en.json
|       `-- hi.json
|-- fixtures/
|   `-- labels/
|       |-- <label-id>.jpg
|       `-- <label-id>.expected.json
|-- backend/
|   |-- package.json
|   |-- .env.example
|   |-- scripts/
|   |   |-- seed-rules.js
|   |   `-- seed-products.js
|   |-- server.js            # process entrypoint (listen, shutdown)
|   |-- app.js               # express app factory (testable)
|   |-- routes.js            # mounts module routers under /api/v1
|   |-- config/
|   |   `-- env.js
|   |-- lib/
|   |   |-- logger.js
|   |   |-- errors.js
|   |   `-- barcode.js       # EAN checksum validation
|   |-- middlewares/
|   |   |-- requestId.js
|   |   |-- validate.js
|   |   |-- upload.js
|   |   |-- auth.js
|   |   |-- rateLimit.js
|   |   |-- notFound.js
|   |   `-- errorHandler.js
|   |-- infra/
|   |   |-- db.js
|   |   |-- gridfs.js
|   |   `-- visionClient.js
|   |-- modules/
|   |   |-- health/
|       |       |-- auth/
|       |       |-- rules/
|       |       |-- products/
|       |       |-- extraction/
|       |       |-- compliance/
|       |       |-- scans/
|       |       `-- complaints/
|       `-- tests/
|           |-- unit/
|           `-- integration/
|-- services/
|   `-- vision/
|       |-- requirements.txt
|       |-- setup.md
|       |-- app/
|       |   |-- main.py
|       |   |-- api/
|       |   |   |-- routes.py
|       |   |   `-- schemas.py
|       |   |-- core/
|       |   |   |-- config.py
|       |   |   `-- logging.py
|       |   `-- pipeline/
|       |       |-- quality.py
|       |       |-- preprocess.py
|       |       |-- scale.py
|       |       |-- ocr.py
|       |       |-- glyphs.py
|       |       `-- barcode.py
|       `-- tests/
|-- .editorconfig
|-- .gitignore
`-- README.md
```

Each backend module under `modules/<name>/` follows the same layout:

```
<name>.routes.js       # HTTP wiring only
<name>.controller.js   # request -> service call -> response
<name>.service.js      # business logic, no express objects
<name>.model.js        # mongoose schema (if persisted)
<name>.schema.js       # zod request/response schemas
<name>.test.js         # unit tests next to the code
```

Rules: controllers never touch the database; services never touch `req`/`res`; modules talk to each other
only through service functions.

---

## 5. Engineering conventions

Git workflow
- `main` is always deployable. Work happens on short-lived branches: `feat/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`.
- One branch per feature below. Open a PR into `main`, run CI, merge with a merge commit (keeps atomic commits visible).
- Tag milestones: `v0.1.0`, `v0.2.0`, ... (see section 12).

Commit format (Conventional Commits)

```
<type>(<scope>): <imperative summary, max ~72 chars>

<optional body: why, not what>
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`.
Scopes: `api`, `vision`, `db`, `rules`, `products`, `extraction`, `compliance`, `scans`, `auth`, `complaints`, `data`, `ci`.
Rules: one logical change per commit, tests in the same commit as the code they cover (or the one right after),
never commit secrets or `.env`.

Definition of done for every feature
- Lint and format pass.
- Unit tests written and passing; integration test where an endpoint is added.
- `docs/api.md` updated if the contract changed.
- `.env.example` updated if config changed.
- No `console.log`; use the logger.

API conventions
- Base path `/api/v1`. JSON in and out except the upload endpoint (multipart).
- Error shape everywhere:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable", "details": [], "requestId": "..." } }
```

- Every request gets a request id (header `x-request-id`, generated if absent) and it appears in every log line.
- All input validated with zod at the edge. Services receive clean typed data.

Compliance result states (used throughout)
- `PASS`: evidence confirms the rule is met.
- `FAIL`: evidence confirms the rule is broken.
- `UNCERTAIN`: not enough evidence (low OCR confidence, no scale, blurry image). Never guess a FAIL.

---

## 6. Implementation phases

Work top to bottom. Each phase lists branch, tasks, exact commits, and a "done when" check.

### Phase 0 - Repository bootstrap [COMPLETED]
Branch: `chore/repo-bootstrap`

Tasks
- [x] `git init`, `.gitignore` (node_modules, .env, __pycache__, .venv, coverage, dist, uploads), `.editorconfig`.
- [x] Create the folder skeleton from section 4 (empty folders get `.gitkeep`).
- [x] Write README (what it is, how to run, link to this guide).
- [x] Write ADR-0001 (two services) and ADR-0002 (offline-first, no external API).

Commits
1. [x] `chore: initialize repository with gitignore and editorconfig`
2. [x] `chore: scaffold monorepo folder structure`
3. [x] `docs: update readme with project overview and getting started`
4. [x] `docs(adr): record two-service and offline-first decisions`

Done when: fresh clone shows the structure and README explains the project.

### Phase 1 - API foundation [COMPLETED]
Branch: `feat/api-foundation`

Tasks
- [x] `backend`: `npm init`, set `"type": "module"`, add ESLint, Prettier, Vitest, Supertest.
- [x] `config/env.js`: parse `process.env` with zod, fail fast on invalid config. Variables: `NODE_ENV`, `PORT`, `MONGO_URI`, `LOG_LEVEL`.
- [x] Split `app.js` (factory, no listen) from `server.js` (listen, SIGTERM graceful shutdown).
- [x] pino logger + request-id middleware + http logging.
- [x] `AppError` base class and subclasses (`ValidationError`, `NotFoundError`, `UnauthorizedError`, `UpstreamError`), `notFound` and central `errorHandler`.
- [x] `GET /api/v1/health` returns `{ status: "ok", uptime }`.
- [x] Add helmet and cors.

Commits
1. [x] `chore(api): initialize node project with eslint, prettier and vitest`
2. [x] `feat(api): add validated environment configuration`
3. [x] `feat(api): add express app factory and server entrypoint`
4. [x] `feat(api): add pino logger and request id middleware`
5. [x] `feat(api): add app error classes and central error handler`
6. [x] `feat(api): add health endpoint`
7. [x] `feat(api): add helmet and cors`
8. [x] `test(api): cover health endpoint and error handler`

Done when: `npm test` passes, `GET /api/v1/health` returns 200, an unknown route returns the standard 404 error shape.

### Phase 2 - Database layer [COMPLETED]
Branch: `feat/database`

Tasks
- [x] `infra/db.js`: Mongoose connect with retry/backoff, connection events logged, graceful disconnect on shutdown.
- [x] Support local MongoDB instance and MongoDB Atlas via `MONGO_URI`.
- [x] Extend health: `GET /api/v1/health/ready` checks DB state.
- [x] Integration test setup with in-memory Mongo (`mongodb-memory-server`) for fast, zero-dependency testing.
- [x] Shared schema plugin: timestamps and a clean `toJSON` (rename `_id` to `id`, drop `__v`).

Commits
1. [x] `chore(db): configure mongodb connection and environment variables`
2. [x] `feat(db): add mongoose connection with retry and graceful shutdown`
3. [x] `feat(db): add shared schema plugin for timestamps and json transform`
4. [x] `feat(api): add readiness endpoint with database check`
5. [x] `test(db): add integration test harness with in-memory mongo`

Done when: API starts against local Mongo or MongoDB Atlas, `/health/ready` reports `db: up`, stopping Mongo makes it report `db: down`.

### Phase 3 - Rules module (the law as data) [COMPLETED]
Branch: `feat/rules-module`

Tasks
- [x] Define the rule file schema (zod): rule `id`, `field`, `mandatory`, `keywords`, `pattern`, `allowedUnits`, `heightBands`, `message`, plus file-level `version`, `source`, `effectiveFrom`.
- [x] Rule types: `presence` (field must exist), `format` (value must match pattern/units/wording), `min_height` (character height by net-quantity band).
- [x] Author `data/rules/pcr-2011.v1.json` from the official Packaged Commodities Rules text. Every numeric value must be copied from the official source and carry a `sourceRef` (rule number). Unverified numbers stay as `null` and the engine treats them as `UNCERTAIN`.
- [x] `RuleSet` model (versioned; only one `active`).
- [x] `scripts/seed-rules.js` (idempotent upsert by version).
- [x] Service: `getActiveRuleSet()` with in-memory cache and invalidation on seed.
- [x] `GET /api/v1/rules/active`.

Commits
1. [x] `feat(rules): define rule file schema and validation`
2. [x] `feat(data): add pcr 2011 rule set v1 for mandatory declarations`
3. [x] `feat(rules): add ruleset model and idempotent seed script`
4. [x] `feat(rules): add active ruleset service with cache`
5. [x] `feat(rules): add active rules endpoint`
6. [x] `test(rules): validate shipped rule file against schema`

Done when: seed runs twice without duplicates, the endpoint returns the active rule set, and the schema test fails if someone commits a malformed rule file.

### Phase 4 - Products module (reference data) [COMPLETED]
Branch: `feat/products-module`

Tasks
- [x] `lib/barcode.js`: EAN-13 and EAN-8 checksum validation.
- [x] `Product` model: `barcode` (unique, indexed), `name`, `brand`, `variant`, `netQuantity {value, unit}`, `frontPanelMm {width, height}`, `manufacturer {name, address}`, `fssaiNo`, `sourceNote` (how this record was verified, e.g. "read from physical pack"), `verifiedAt`.
- [x] `data/products/products.seed.json`: 3-5 products filled from real packs in hand (read values off the pack, measure the panel with a ruler). Never fill from memory or web. MRP and dates are not stored.
- [x] `scripts/seed-products.js` (idempotent upsert by barcode).
- [x] `GET /api/v1/products/:barcode` (validates barcode, 404 if unknown).

Commits
1. [x] `feat(api): add ean barcode checksum validation`
2. [x] `feat(products): add product model with unique barcode index`
3. [x] `feat(data): add reference products seed verified from physical packs`
4. [x] `feat(products): add idempotent product seed script`
5. [x] `feat(products): add get product by barcode endpoint`
6. [x] `test(products): cover barcode validation and lookup endpoint`

Done when: valid known barcode returns the record, valid unknown returns 404, invalid checksum returns 400.

### Phase 5 - Vision service
Each sub-feature is its own branch and PR. Pipeline modules are pure functions (image array in, data out) so they can be tested with fixture images.

#### 5a - Skeleton and environment
Branch: `feat/vision-skeleton`
- FastAPI app, `GET /health`, config via env, structured logging.
- `requirements.txt` and `setup.md` with instructions for installing Tesseract (`eng+hin`) and zbar natively.

Commits
1. `feat(vision): scaffold fastapi app with health endpoint`
2. `chore(vision): add requirements.txt and local environment setup guide`

#### 5b - Image quality gate
Branch: `feat/vision-quality`
- `pipeline/quality.py`: blur score (variance of Laplacian), brightness, glare ratio (saturated-pixel share), resolution check.
- Returns `{ ok, issues: ["BLURRY","GLARE","LOW_RESOLUTION"], metrics }`. Thresholds in config, tuned in Phase 9.

Commits
1. `feat(vision): add image quality metrics`
2. `test(vision): cover quality gate with good and bad fixtures`

#### 5c - Preprocessing
Branch: `feat/vision-preprocess`
- `pipeline/preprocess.py`: decode, bounded resize, grayscale, CLAHE, denoise, adaptive threshold variants, 2-3x upscale for small text.
- Optional pack-outline detection and perspective correction (largest quadrilateral contour); skipped when no confident quad is found.

Commits
1. `feat(vision): add decode, resize and contrast normalization`
2. `feat(vision): add threshold and upscale variants for ocr`
3. `feat(vision): add perspective correction for pack outline`
4. `test(vision): cover preprocess pipeline`

#### 5d - OCR with glyph heights
Branch: `feat/vision-ocr`
- `pipeline/ocr.py`: run Tesseract (`eng+hin`) with word-level data; return `text`, `conf`, `bbox`, `lineId`, `blockId` for each word.
- Try more than one page-segmentation mode and keep the better-scoring result per region.
- `pipeline/glyphs.py`: refine each word box using connected components inside the crop and report `glyphHeightPx` (tight height of the numerals/letters). Tesseract boxes include padding and ascenders, so raw box height overstates size.

Commits
1. `feat(vision): add tesseract word-level ocr`
2. `feat(vision): add multi-psm selection per region`
3. `feat(vision): add glyph height refinement via connected components`
4. `test(vision): cover ocr and glyph heights on fixture labels`

#### 5e - Barcode decoding
Branch: `feat/vision-barcode`
- `pipeline/barcode.py`: decode EAN/UPC with pyzbar; retry on rotated and thresholded variants. Returns `{ value, type, bbox }` or `null`.

Commits
1. `feat(vision): add barcode decoding with rotation retries`
2. `test(vision): cover barcode decode`

#### 5f - Scale estimation (px per mm)
Branch: `feat/vision-scale`
- `pipeline/scale.py` with strategies tried in order, each returning `{ pxPerMm, method, confidence }`:
  1. ArUco marker of known printed size (preferred).
  2. ID-1 card (85.60 x 53.98 mm) or A4 sheet detected in frame.
  3. `knownPanelMm` supplied by the API (from the product record) matched to the detected pack outline.
  4. None: return `null`, the API marks height checks `UNCERTAIN`.
- Document the planar assumption: the reference object must lie in the same plane as the text being measured.

Commits
1. `feat(vision): add aruco marker scale estimation`
2. `feat(vision): add card and a4 reference detection`
3. `feat(vision): add scale from known panel dimensions`
4. `feat(vision): add scale strategy selector with confidence`
5. `test(vision): cover scale strategies`

#### 5g - Analyze endpoint
Branch: `feat/vision-analyze-endpoint`
- `POST /v1/analyze` (multipart image + options JSON: `referenceHint`, `knownPanelMm`).
- Orchestrates quality, preprocess, OCR, glyphs, barcode, scale. Pydantic response:

```json
{
  "quality": { "ok": true, "issues": [], "metrics": {} },
  "scale": { "pxPerMm": 11.8, "method": "aruco", "confidence": 0.93 },
  "barcode": { "value": "8901719...", "type": "EAN13" },
  "words": [
    { "text": "Net", "conf": 91, "bbox": [x, y, w, h], "lineId": 12, "blockId": 3, "glyphHeightPx": 31 }
  ],
  "timingsMs": { "preprocess": 40, "ocr": 780, "total": 900 }
}
```

Commits
1. `feat(vision): add analyze endpoint orchestrating pipeline`
2. `feat(vision): add response schemas and input validation`
3. `test(vision): add endpoint test with fixture image`
4. `docs: document vision analyze contract`

#### 5h - Vision client in the API
Branch: `feat/api-vision-client`
- `infra/visionClient.js`: HTTP client with timeout, one retry on network error, maps failures to `UpstreamError`.
- Contract test against a mocked vision service.

Commits
1. `feat(api): add vision service client with timeout and retry`
2. `test(api): contract test vision client against mock`

Done when (phase 5): API, Vision service (FastAPI/Uvicorn), and MongoDB run locally; posting a fixture image to `/v1/analyze` returns words, barcode and scale.

### Phase 6 - Extraction module [COMPLETED]
Branch: `feat/extraction-module`

Turns OCR words into structured label fields, with no network calls.

Tasks
- [x] Group words into lines using `lineId`; build line text with source word boxes retained.
- [x] Keyword dictionaries in `data/keywords/{en,hi}.json` (net quantity, MRP, manufacturer/packer, date of manufacture/packing, best before/expiry, customer care, country of origin, FSSAI, product name cues).
- [x] Extractors, one file each, all pure functions: `netQuantity`, `mrp`, `dates`, `manufacturer`, `customerCare`, `fssai`, `countryOfOrigin`, `productName`.
- [x] Use regex plus fuzzy matching (tolerate OCR errors such as `0`/`O`, `l`/`1`) with a confidence score.
- [x] Output field shape: `{ name, value, rawText, confidence, wordRefs[] }` where `wordRefs` link back to word boxes so the engine can measure them.
- [x] Define an `Extractor` interface so an optional provider (e.g. LLM) could be plugged in later. Default provider is the rule-based one.

Commits
1. [x] `feat(extraction): add line grouping from ocr words`
2. [x] `feat(data): add english and hindi label keyword lists`
3. [x] `feat(extraction): add net quantity extractor`
4. [x] `feat(extraction): add mrp extractor`
5. [x] `feat(extraction): add date extractors`
6. [x] `feat(extraction): add manufacturer and customer care extractors`
7. [x] `feat(extraction): add fssai, origin and product name extractors`
8. [x] `feat(extraction): add extractor interface and default provider`
9. [x] `test(extraction): table-driven tests with noisy ocr samples`

Done when: given recorded OCR JSON for each fixture label (no images needed), extraction reproduces the expected fields.

### Phase 7 - Compliance engine
Branch: `feat/compliance-engine`

Pure function: `evaluate({ ruleSet, fields, scale, product, quality }) -> report`.

Tasks
- Presence checks: mandatory field missing -> `FAIL` (but `UNCERTAIN` if image quality was poor or OCR confidence is low).
- Format checks: units, wording, date format, address presence.
- Height checks: `heightMm = glyphHeightPx / pxPerMm`; look up the band from the parsed net quantity; compare with the minimum using a configurable tolerance. No scale -> `UNCERTAIN`.
- Cross-check against the product record: net quantity mismatch, manufacturer mismatch (fuzzy). No product record -> skip, not fail.
- Aggregate verdict: any mandatory `FAIL` -> `FAIL`; else any `UNCERTAIN` -> `UNCERTAIN`; else `PASS`.
- Each check carries `evidence`: field text, bbox, measured vs required height, confidence.

Report shape:

```json
{
  "verdict": "FAIL",
  "ruleSetVersion": "pcr-2011.v1",
  "checks": [
    {
      "ruleId": "net_quantity.min_height",
      "status": "FAIL",
      "message": "Net quantity numerals are smaller than required",
      "evidence": { "text": "56 g", "bbox": [0,0,0,0], "measuredMm": 0.0, "requiredMm": 0.0 },
      "confidence": 0.87
    }
  ],
  "summary": { "pass": 0, "fail": 0, "uncertain": 0 }
}
```

Commits
1. [x] `feat(compliance): add report types and verdict aggregation`
2. [x] `feat(compliance): add presence checks`
3. [x] `feat(compliance): add format checks`
4. [x] `feat(compliance): add character height checks with tolerance`
5. [x] `feat(compliance): add product cross-check`
6. [x] `feat(compliance): attach evidence to every check`
7. [x] `test(compliance): table-driven tests for pass, fail and uncertain paths`

Done when: the engine is fully covered by unit tests using hand-written inputs (no images, no DB).

### Phase 8 - Scan orchestration endpoint
Branch: `feat/scans-endpoint`

Tasks
- `Scan` model: `user` (optional), `barcode`, `ruleSetVersion`, `verdict`, `report`, `fields`, `qualityIssues`, `createdAt`. Images are not stored here.
- `middlewares/upload.js`: multer memory storage, file size limit, mime allow-list (jpeg, png, webp), max 2 images (front, back).
- `POST /api/v1/scans` flow:
  1. validate upload and options
  2. send each image to vision `/v1/analyze`
  3. if the quality gate fails, return `422` with `retake` guidance
  4. merge words from both sides, run extraction
  5. look up the product by decoded or supplied barcode
  6. run the compliance engine with the active rule set
  7. persist and return the report
- `GET /api/v1/scans/:id`, `GET /api/v1/scans` (paginated).

Commits
1. [x] `feat(scans): add scan model`
2. [x] `feat(api): add upload middleware with size and mime limits`
3. [x] `feat(scans): add scan orchestration service`
4. [x] `feat(scans): add create scan endpoint`
5. [x] `feat(scans): add get scan and paginated list endpoints`
6. [x] `test(scans): end-to-end test with mocked vision service`

Done when: with real services running, posting a fixture label returns a report in a few seconds and the scan is retrievable by id.

### Phase 9 - Evaluation harness
Branch: `feat/evaluation-harness`

Tasks
- `fixtures/labels/`: 10-20 real label photos plus `<id>.expected.json` (true field values, true verdict). Photos you took yourself.
- Script `npm run eval`: runs every fixture through the pipeline and prints per-field extraction accuracy, verdict agreement, false-FAIL rate, and mean height error in mm.
- Use results to tune: quality thresholds, OCR variants, tolerance percentage, keyword lists.
- Set a gate in CI on the false-FAIL rate. A wrongly flagged compliant product is worse than a missed one.

Commits
1. [x] `chore(data): add labeled fixture set with expected results`
2. [x] `feat(scans): add evaluation script with accuracy metrics`
3. [x] `chore(ci): add evaluation gate on false-fail rate`
4. [x] `docs: record baseline accuracy numbers`

Done when: a baseline accuracy table exists in `docs/` and tuning changes can be compared against it. These numbers are what you quote to judges.

### Phase 10 - Auth
Branch: `feat/auth`

Tasks
- Mobile-friendly flow: client obtains a Google ID token, sends it to `POST /api/v1/auth/google`; API verifies it and returns an access JWT (short-lived) plus refresh token. This needs only the Google OAuth client ID, which is configuration, not a scanning-pipeline API key.
- `User` model: `googleId`, `email`, `name`, `avatar`, `role`.
- `auth` middleware (verify JWT, attach `req.user`), `optionalAuth` for scans.
- `GET /api/v1/auth/me`.
- Scans stay usable anonymously; history and complaints require login.

Commits
1. [x] `feat(auth): add user model`
2. [x] `feat(auth): add google id token verification`
3. [x] `feat(auth): add jwt issue and refresh`
4. [x] `feat(auth): add auth and optional-auth middleware`
5. [x] `feat(auth): add me endpoint`
6. [x] `test(auth): cover token verification and protected routes`

### Phase 11 - Complaints
Branch: `feat/complaints`

Tasks
- `infra/gridfs.js` for evidence images (stored only when the user files a complaint, with consent).
- `Complaint` model: `scan`, `user`, `violations[]` (copied from failed checks), `evidenceFileIds[]`, `userNote`, `status` (`DRAFT`, `SUBMITTED`), `createdAt`.
- `POST /api/v1/complaints` (auth required): only allowed when the scan verdict is `FAIL`, requires explicit user confirmation flag.
- `GET /api/v1/complaints`, `GET /api/v1/complaints/:id`.
- `GET /api/v1/complaints/:id/export`: PDF with evidence and the failed checks (reuse the document-generation approach from earlier projects).
- "SUBMITTED" means stored in SafeFood and exportable. Wire to an official channel later, once the correct channel is confirmed.

Commits
1. [x] `feat(complaints): add gridfs evidence storage`
2. [x] `feat(complaints): add complaint model`
3. [x] `feat(complaints): add create complaint endpoint with fail-only guard`
4. [x] `feat(complaints): add list and get endpoints`
5. [x] `feat(complaints): add pdf export`
6. [x] `test(complaints): cover guard, ownership and export`

### Phase 12 - Hardening and delivery
Branch: `chore/hardening`

Tasks
- Rate limiting (stricter on `/scans` and `/auth`), request body and upload limits, `helmet` review.
- Ownership checks on every user-scoped resource.
- OpenAPI spec generated or hand-written in `docs/api.md`; keep it in sync with zod schemas.
- Production environment configurations, process management scripts, healthchecks.
- CI: lint, unit, integration, vision tests, eval gate.
- Deployment notes: API and vision as independent native services (e.g. Node process / PM2, and Uvicorn / Gunicorn for Python); Mongo managed via MongoDB Atlas.
- Structured error logging with request id; no image bytes or tokens in logs.

Commits
1. [x] `feat(api): add rate limiting for scans and auth`
2. [x] `fix(api): enforce ownership checks on user resources`
3. [x] `docs: add openapi contract`
4. [x] `build: add process management scripts and healthcheck monitors`
5. [x] `ci: run lint, tests, eval gate and validation builds`
6. [x] `docs: add deployment guide`

---

## 7. API reference (target)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | /api/v1/health | no | liveness |
| GET | /api/v1/health/ready | no | readiness (db) |
| GET | /api/v1/rules/active | no | active rule set |
| GET | /api/v1/products/:barcode | no | reference product |
| POST | /api/v1/scans | optional | upload images, get compliance report |
| GET | /api/v1/scans/:id | optional | fetch a report |
| GET | /api/v1/scans | yes | scan history |
| POST | /api/v1/auth/google | no | exchange Google ID token for JWT |
| GET | /api/v1/auth/me | yes | current user |
| POST | /api/v1/complaints | yes | file complaint from a FAIL scan |
| GET | /api/v1/complaints | yes | list own complaints |
| GET | /api/v1/complaints/:id | yes | complaint detail |
| GET | /api/v1/complaints/:id/export | yes | complaint PDF |

Vision service (internal, not exposed publicly): `GET /health`, `POST /v1/analyze`.

---

## 8. Configuration

`apps/api/.env.example`

```
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/safefood
VISION_URL=http://localhost:8000
LOG_LEVEL=info
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
GOOGLE_CLIENT_ID=
HEIGHT_TOLERANCE_PCT=
MAX_UPLOAD_MB=8
```

`HEIGHT_TOLERANCE_PCT` is intentionally blank: set it from Phase 9 results, not by guessing.

---

## 9. Testing strategy

| Level | Tooling | What it covers |
|---|---|---|
| Unit (pure logic) | Vitest | extractors, compliance engine, barcode checksum, rule schema |
| Integration (API) | Vitest + Supertest + test Mongo | endpoints, validation, error shape, auth |
| Contract | mocked vision service | API and vision agree on JSON shape |
| Vision unit | pytest + fixture images | quality, OCR, glyph height, barcode, scale |
| Evaluation | `npm run eval` | accuracy on the labeled real-label set |

Principle: most logic lives in pure functions that never need an image or a database, so most tests are fast.

---

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Wrong px-to-mm scale gives wrong height verdicts | reference object required for height checks; otherwise `UNCERTAIN`; confidence reported |
| Curved or crinkled wrapper distorts size | perspective correction, measure on flat regions, tolerance from eval data |
| Tesseract misreads stylized fonts | preprocessing variants, multi-PSM, crop-level OCR, fuzzy matching |
| False FAIL leads to a wrong complaint | three-state result, complaint needs user confirmation, CI gate on false-FAIL rate |
| Rule values wrong or outdated | every value carries a source reference, rule set is versioned, unverified values stay null |
| Vision service latency | bounded image size, timeouts, per-region OCR, optional caching later |

---

## 11. Open decisions (settle before or during the relevant phase)

1. Test Mongo strategy in CI: in-memory server (mongodb-memory-server) (Phase 2).
2. Which reference object the client will use for scale: ArUco sheet, card, or product-DB dimensions (Phase 5f).
3. Whether to store scan images by default or only for complaints (Phase 8 and 11).
4. Official channel for complaint submission (Phase 11).

---

## 12. Milestones and tags

| Tag | After phase | You can demo |
|---|---|---|
| v0.1.0 | 0-2 | running API with health and database |
| v0.2.0 | 3-4 | rules and product reference endpoints |
| v0.3.0 | 5 | vision service returning OCR, barcode, scale |
| v0.4.0 | 6-7 | extraction and compliance engine (unit-tested) |
| v0.5.0 | 8-9 | end-to-end scan to report, with accuracy numbers |
| v0.6.0 | 10-11 | login and complaints with PDF export |
| v1.0.0 | 12 | hardened, production-ready, CI-gated backend |

Per-feature loop: create branch, implement, write tests, lint, commit in the listed order, open PR, CI green, merge, tick it off.
