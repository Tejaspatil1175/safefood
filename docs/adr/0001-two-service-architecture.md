# ADR 0001: Two-Service Architecture (Node.js API + Python Vision Service)

## Context
SafeFood checks label compliance against Legal Metrology rules. This requires:
1. Business logic: REST endpoints, rule evaluation, EAN checksums, database persistence (MongoDB), user authentication, and PDF complaint generation.
2. Computer vision & OCR: image quality gating, perspective rectification, word-level OCR bounding boxes with connected-component glyph height measurement in millimeters, and barcode decoding.

OpenCV and Tesseract have native C++ bindings that are first-class and heavily optimized in Python, while business logic and web APIs are natural and productive in Node.js (MERN stack).

## Decision
Split backend into two distinct services:
1. `apps/api`: Node.js + Express + Mongoose. Handles all HTTP client communication, business rules, extraction regex/parsing, persistence, and auth.
2. `services/vision`: Python + FastAPI. Stateless microservice that accepts an image and returns JSON (detected words, bounding boxes, glyph heights, barcode, scale).

## Consequences
- The Node.js application remains lightweight and fast.
- The computer vision service is purely functional and stateless: image in, JSON out.
- Services can be developed, tested, and scaled independently.
