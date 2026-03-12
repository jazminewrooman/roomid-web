# RoomID

Privacy-first rental identity and compliance layer for the Room Protocol
Suite.

RoomID transforms rental history and income evidence into structured,
portable, and privacy‑preserving rental credentials.

⚠️ Important: For the purposes of this demo, Zero-Knowledge proofs and
circuits are **simulated**. Future production implementation will use
**Noir by Aztec** for zk circuit development.

RoomID is part of a suite that includes: - RoomFi (rental marketplace &
contracts) - RoomLen (liquidity & lending)

For the hackathon demo **only RoomID will be modified or expanded**.
RoomFi and RoomLen will remain visually unchanged.

------------------------------------------------------------------------

# Design Direction (RoomID Only)

RoomID will adopt a **crypto‑privacy aesthetic** while remaining
compatible with the existing UI of RoomFi and RoomLen.

Design philosophy:

Fintech clarity + subtle crypto/privacy aesthetic.

The goal is to communicate: - security - privacy - cryptographic
verification - trust

without becoming visually chaotic or overly "cyberpunk".

RoomID should feel slightly more **technical and privacy‑focused** than
the other apps.

------------------------------------------------------------------------

# Visual Style

## Base Theme

Dark theme preferred.

Background: #0B0B0F

Primary accent: Privacy Green

Example: #3EF29B

Secondary accent: Cyan

Example: #2BD9FE

Neutral text colors:

Primary text: #FFFFFF

Secondary text: #B6B6C2

Card background: #14141A

Border: #26262E

------------------------------------------------------------------------

# Typography

Primary font:

Inter

Alternative options:

Space Grotesk IBM Plex Sans

Headers should feel slightly technical.

Example headline:

RoomID\
Privacy‑Preserving Rental Identity

------------------------------------------------------------------------

# UI Components

RoomID should reuse general layout patterns from RoomFi / RoomLen but
with darker styling.

Components:

Cards\
Status badges\
Upload panels\
Verification panels\
Proof result cards

Example card styling:

Border radius: 12px\
Soft shadow\
Subtle glow on accent elements

------------------------------------------------------------------------

# Key Screens

## 1. Landing

Hero message:

Prove your rental reliability\
without revealing your private data.

CTA:

Create RoomID

Secondary CTA:

Upload Rental History

------------------------------------------------------------------------

## 2. Document Upload

Drag and drop upload areas.

Cards:

Upload Rental Contract

Upload Payment Proofs

Optional Landlord Reference

Accepted formats:

PDF\
JPG\
PNG

------------------------------------------------------------------------

## 3. Processing Screen

Animated status steps:

Analyzing documents

Extracting payment history

Computing reliability score

Preparing zk‑proof (demo)

------------------------------------------------------------------------

## 4. Result Screen

Display a credential card.

Example:

Rental Reliability Score

92 / 100

Tier A

Indicators:

✔ No defaults\
✔ 12 months verified\
✔ Max delay: 2 days

Actions:

Use in RoomFi\
Share Credential\
Download Proof

------------------------------------------------------------------------

# Crypto Credibility Indicators

Example badges shown in UI:

Powered by Noir (Aztec)\
Privacy Proof Enabled\
zk‑Ready Architecture

These signals help judges understand the technical direction
immediately.

------------------------------------------------------------------------

# Demo Scope Clarification

For the hackathon:

-   zk proofs are simulated
-   Noir circuits are mocked
-   backend signatures emulate verification

Architecture is designed so Noir circuits can replace this later.

------------------------------------------------------------------------

# Core Functionality

RoomID allows users to upload rental history documents and convert them
into a structured rental reputation credential.

Inputs:

Rental contract\
Payment receipts or transfers

Optional:

Landlord reference letter

------------------------------------------------------------------------

# AI Processing Pipeline

Step 1: OCR extraction.

Extract:

Tenant name\
Monthly rent\
Due date\
Contract duration\
Payment dates\
Payment amounts

Tools:

Google Vision\
AWS Textract\
Tesseract\
OpenAI Vision

------------------------------------------------------------------------

Step 2: Normalize data into structured JSON.

Example:

{ "monthly_rent": 8000, "due_day": 5, "payments": \[ { "month":
"2024-01", "amount": 8000, "paid_on": "2024-01-04" } \] }

------------------------------------------------------------------------

# Rental Reliability Analysis

Metrics:

Total months analyzed

On‑time payments

Late payments

Maximum delay

Default count

Definitions:

Late payment: Payment received more than 5 days after due date.

Default: Payment missing after 30 days.

------------------------------------------------------------------------

# Rental Reliability Score

Demo scoring model:

Base Score = 100

-5 points per late payment

-20 points per default

+5 bonus for 12 consecutive payments

Score range:

0 -- 100

Tiers:

90 -- 100 → Tier A (Excellent)\
75 -- 89 → Tier B (Good)\
60 -- 74 → Tier C (Medium)\
\< 60 → Tier D (High Risk)

------------------------------------------------------------------------

# Credential Output

Example:

{ "user_id": "uuid", "rental_score": 92, "tier": "A", "months_verified":
12, "defaults": 0, "max_delay_days": 2, "hash_of_documents":
"SHA256(...)", "timestamp": "ISO8601" }

Credential is signed by backend for the demo.

------------------------------------------------------------------------

# Zero Knowledge Future (Noir)

Future production version will implement zk proofs using:

Noir (Aztec)

Possible circuits:

Proof of No Default\
Proof Income ≥ X\
Proof Rent ≤ 30% Income

Example circuit logic:

assert(no_defaults == true)\
assert(income \>= threshold)\
assert(rent \<= income \* 0.3)

Proof generation: client side\
Verification: smart contract

------------------------------------------------------------------------

# Architecture

Frontend

Next.js\
React

Backend

Node.js\
Express

Services

OCR processor\
Scoring engine

Database

PostgreSQL

Storage

Encrypted S3 compatible storage

------------------------------------------------------------------------

# API Endpoints

POST /upload-documents

GET /job-status/:id

GET /rental-score/:userId

POST /verify-credential

------------------------------------------------------------------------

# Value Proposition

RoomID creates a portable rental identity.

Users can prove:

No default history\
Payment consistency\
Financial reliability

Without revealing:

Exact income\
Full banking records\
Sensitive financial data

------------------------------------------------------------------------

RoomID = Privacy Layer for Rental Markets in LATAM
