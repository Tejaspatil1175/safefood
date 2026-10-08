# ADR 0002: Offline-First Scanning with Zero External Vision APIs

## Context
Food safety inspections and citizen label scanning often happen in environments with poor network connectivity (e.g., inside basements, grocery stores, or rural markets). Additionally, commercial cloud vision APIs (Google Cloud Vision, AWS Textract) impose per-call costs, API key requirements, and latency overheads.

## Decision
Design the SafeFood scanning pipeline to run completely offline/self-hosted with zero external API key requirements:
- Use local OpenCV and Tesseract OCR engines for text extraction.
- Bundle the Legal Metrology rule sets (`pcr-2011.v1.json`) directly within the system as versioned seed data.
- Maintain an offline product database of verified reference records.

## Consequences
- No reliance on third-party cloud vision billing or network uptime.
- User data and label scans remain private.
- Scanning pipeline can operate in isolated local deployments.
