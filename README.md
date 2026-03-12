# RoomID

**Privacy-preserving rental identity layer for the Room Protocol ecosystem.**

RoomID converts rental history documents into a signed, portable credential — a structured proof of tenant reliability that can be consumed by RoomFi for instant tenant screening without exposing raw financial data.

> ⚠️ ZK proofs are **simulated** in this demo. The architecture is designed to swap them for real **Noir (Aztec)** circuits in production.

---

## What it does

A tenant uploads their rental contract and payment history. RoomID analyzes the documents, computes a reliability score, and issues a signed credential. That credential can then be submitted directly to RoomFi, where landlords verify it on-chain without ever seeing the tenant's underlying documents.

```
Tenant uploads docs → Scoring engine → Signed credential → Submitted to RoomFi
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Custom CSS (dark privacy theme) |
| Backend | Next.js Route Handlers (no separate server) |
| Scoring | `lib/scoring.ts` — pure TypeScript, no deps |
| Credential | `lib/roomid-demo.ts` — HMAC-SHA256 signed JSON |
| Crypto | Node.js `crypto` module (SHA-256, HMAC) |
| Fonts | IBM Plex Sans + Space Grotesk (Google Fonts) |

---

## Project Structure

```
app/
  page.tsx                  # Main app (landing → upload → processing → result)
  layout.tsx                # Root layout with Navbar + Footer
  globals.css               # Design system + component styles
  api/
    upload-documents/       # POST — accepts file metadata, creates job
    job-status/[id]/        # GET  — polls processing progress
    rental-score/[userId]/  # GET  — returns completed credential
    verify-credential/      # POST — validates credential integrity

lib/
  scoring.ts                # Rental analysis + scoring model
  roomid-demo.ts            # Job store, credential generation, verification

components/ui/
  Navbar.tsx / Footer.tsx
  Card.tsx / Badge.tsx
  UploadPanel.tsx           # File input with validation
  StepStatus.tsx            # Processing step indicator
  CredentialCard.tsx        # Credential display
```

---

## User Flow

### 1. Upload
The tenant uploads up to three documents:
- **Rental contract** *(required)* — PDF, JPG, PNG
- **Payment proofs** *(required)* — bank transfers, receipts
- **Landlord reference** *(optional)*

### 2. Processing
`POST /api/upload-documents` creates a job. The frontend polls `GET /api/job-status/:id` and progresses through four stages:

| Stage | Label | Progress |
|---|---|---|
| 0 | Analyzing documents | 10% |
| 1 | Extracting payment history | 35% |
| 2 | Computing reliability score | 62% |
| 3 | Preparing zk-proof (demo) | 86% |
| — | Completed | 100% |

### 3. Credential Issued
Once complete, the frontend calls `GET /api/rental-score/:userId` and receives a signed `RentalCredential` object.

---

## Scoring Model (`lib/scoring.ts`)

Payment records are analyzed against a due date with two thresholds:

| Condition | Classification |
|---|---|
| Paid within 5 days of due date | On-time |
| Paid 6–30 days after due date | Late |
| Unpaid or > 30 days late | Default |

**Score formula:**
```
score = 100
score -= latePayments × 5
score -= defaults × 20
score += 5  (if consecutivePaidMonths >= 12)
score = clamp(score, 0, 100)
```

**Tiers:**
```
90–100 → Tier A (Excellent)
75–89  → Tier B (Good)
60–74  → Tier C (Medium)
< 60   → Tier D (High Risk)
```

---

## Credential Schema

```ts
type RentalCredential = {
  user_id:            string;   // UUID
  rental_score:       number;   // 0–100
  tier:               "A" | "B" | "C" | "D";
  months_verified:    number;
  on_time_payments:   number;
  late_payments:      number;
  defaults:           number;
  max_delay_days:     number;
  hash_of_documents:  string;   // SHA-256 of filenames
  timestamp:          string;   // ISO 8601
  proof_mode:         "simulated";
  zk_ready:           boolean;
  badges:             string[]; // human-readable proof labels
  signature:          string;   // HMAC-SHA256
}
```

The credential is signed server-side with HMAC-SHA256. `POST /api/verify-credential` checks all six integrity constraints:

- Required fields present
- Score in 0–100 range
- Tier consistent with score
- Timestamp parseable
- Document hash is valid SHA-256 hex
- Signature matches recomputed HMAC

---

## API Endpoints

### `POST /api/upload-documents`
Accepts `multipart/form-data` with `contract`, `payments`, and optionally `reference`. Creates a processing job.

```json
// Response
{ "jobId": "uuid", "userId": "uuid" }
```

### `GET /api/job-status/[id]`
Returns current processing stage for polling.

```json
{ "jobId": "...", "userId": "...", "status": "processing", "stepIndex": 2, "progress": 62 }
```

### `GET /api/rental-score/[userId]`
Returns the completed `RentalCredential` once `status === "completed"`.

### `POST /api/verify-credential`
Validates a credential object. Used by tenants and landlords.

```json
// Request
{ "credential": { ...RentalCredential } }

// Response
{
  "valid": true,
  "message": "Credential verified successfully.",
  "checks": { "signatureValid": true, ... },
  "reasons": []
}
```

---

## RoomFi Integration

The "Use in RoomFi ↗" action on the result screen submits the tenant's credential to RoomFi. This is the primary cross-product integration point:

1. Tenant generates their `RentalCredential` on RoomID
2. Credential is submitted to RoomFi via the action button (currently simulated — posts the credential object)
3. RoomFi calls `POST /api/verify-credential` to validate the signature and integrity before accepting the application
4. Landlord sees the tenant's **tier** and **score** without accessing raw documents

In production this flow would use a ZK proof instead of the raw credential, so RoomFi only learns "score ≥ threshold" without seeing the exact number.

---

## ZK Roadmap (Noir by Aztec)

The current HMAC signature is a stand-in. The `proof_mode: "simulated"` and `zk_ready: true` fields flag which credentials are ready for circuit replacement.

Planned Noir circuits:

| Circuit | Statement proven |
|---|---|
| `proof_no_default` | `assert(defaults == 0)` |
| `proof_score_threshold` | `assert(score >= threshold)` — without revealing the score |
| `proof_rent_affordability` | `assert(rent <= income * 0.3)` — without revealing income |

- Proof generation: **client-side** (browser / mobile)
- Verification: **EVM smart contract** (Noir-generated Solidity verifier)

---

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

The demo uses an in-memory job store — jobs reset on server restart.

---

## Part of Room Protocol

| Product | Role |
|---|---|
| **RoomID** | Identity & credential layer |
| **RoomFi** | Rental marketplace — consumes RoomID credentials |
| **RoomLen** | Liquidity & deposit streaming |

Portal: [roomprotocol.netlify.app](https://roomprotocol.netlify.app)

