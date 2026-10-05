# SafeFood

SafeFood is an offline-first label compliance checker for packaged commodities. It reads packaged product labels using computer vision and OCR, extracting mandatory declarations and measuring printed character heights in millimeters against Legal Metrology (Packaged Commodities) Rules.

## Architecture

SafeFood uses a modular architecture:

```
Mobile Client (React Native)
        │
        ▼ HTTP (multipart upload)
┌─────────────────────────────────┐        ┌─────────────────────────┐
│ backend                         │  HTTP  │ services/vision         │
│ (Node.js + Express + MongoDB)   │ ─────> │ (Python + FastAPI)      │
│                                 │        │                         │
│ - Scans & Compliance Engine     │ <───── │ - Quality Gate & Filter │
│ - Rules & Reference Products    │  JSON  │ - OCR & Glyph Heights   │
│ - Complaints & PDF Export       │        │ - Barcode & Scale (mm)  │
│ - Auth & User History           │        └─────────────────────────┘
└─────────────────────────────────┘
```

- **`backend` (Node.js / Express / Mongoose)**: Handles business logic, rule evaluations, product cross-referencing, scan records, user authentication, and complaint generation.
- **`services/vision` (Python / FastAPI / OpenCV / Tesseract)**: High-performance computer vision microservice responsible for image quality checks, text segmentation, word-level glyph height extraction (in pixels), barcode decoding, and pixel-to-millimeter scale estimation.
- **`data/`**: Versioned, authoritative JSON datasets for legal rules, product references, and multilingual keywords.

## Tech Stack

- **Backend API**: Node.js (ES modules), Express, Mongoose, Zod, Pino
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Vision Pipeline**: Python 3, FastAPI, OpenCV, Pytesseract, Pyzbar
- **Testing**: Vitest, Supertest, Pytest

## Project Structure

```
safefood/
├── backend/                  # Express REST API
├── services/
│   └── vision/               # Computer vision & OCR service
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
- Python 3.10+
- MongoDB instance (Local or MongoDB Atlas URI)
- Tesseract OCR (with `eng` and `hin` trained data)

### Backend API Setup (`backend`)
```bash
cd backend
npm install
npm test
npm run dev
```

### Vision Service Setup (`services/vision`)
```bash
cd services/vision
python -m venv .venv
# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## License
MIT
