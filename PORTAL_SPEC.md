# Room Protocol Portal

## Objective

Build a **central portal interface** that connects the three applications of the Room ecosystem:

- RoomID (identity layer)
- RoomFi (rental marketplace)
- RoomLen (liquidity layer)

The portal should present the system as **one unified protocol**, not three separate applications.

The portal acts as:

- ecosystem homepage
- application launcher
- architecture explanation
- entry point to each product

This interface is inspired by multi-app portals used in modern DeFi ecosystems.

---

# Tech Requirements

Build using:

- Next.js 14
- React
- TailwindCSS
- Typescript

Optional but preferred:

- Framer Motion (for animations)
- Lucide icons

The portal should be **static and lightweight**.

No backend is required.

---

# Routing Structure

Root page:

/
Portal homepage.

App routes:

/roomid
Redirects to RoomID application.

/roomfi
Redirects to RoomFi application.

/roomlen
Redirects to RoomLen application.

For demo purposes these can simply link to external URLs.

Example:

RoomID → https://roomid.example  
RoomFi → https://roomfi.example  
RoomLen → https://roomlen.example

---

# Design Philosophy

Minimal.

Modern.

Crypto-native but professional.

Think:

- fintech clarity
- subtle web3 aesthetic

Do NOT use heavy cyberpunk visuals.

---

# Color Palette

Background

#0B0B0F

Primary Accent

#3EF29B

Secondary Accent

#2BD9FE

Card Background

#14141A

Borders

#26262E

Text

Primary: #FFFFFF  
Secondary: #B6B6C2

---

# Typography

Primary font:

Inter

Headers should be bold and clean.

---

# Layout Structure

The homepage should contain these sections:

1. Hero
2. Ecosystem
3. How It Works
4. Architecture
5. Tech Credibility
6. Footer

---

# HERO SECTION

Title:

The Privacy Infrastructure for Rental Markets

Subtitle:

Identity, marketplace and liquidity for the next generation of housing.

Primary CTA:

Launch Apps

Secondary CTA:

Explore Ecosystem

Hero background should include:

- subtle grid pattern
- faint network lines

---

# ECOSYSTEM SECTION

Three large application cards.

Cards should have:

- rounded corners
- glow hover effect
- icon
- description
- launch button

Layout:

3 cards horizontally (desktop)
stacked vertically (mobile)

---

## Card 1

Title:

RoomID

Description:

Privacy-preserving rental identity.

Transform rental history into verifiable credentials.

Button:

Launch RoomID

Color accent:

green

---

## Card 2

Title:

RoomFi

Description:

Rental marketplace powered by verified tenants.

Button:

Launch RoomFi

Accent:

blue

---

## Card 3

Title:

RoomLen

Description:

Liquidity layer for rental deposits and payments.

Button:

Launch RoomLen

Accent:

purple

---

# HOW IT WORKS

3 step process.

Step 1

Create your RoomID

Upload rental history and generate a privacy-preserving credential.

Step 2

Apply through RoomFi

Use your RoomID to qualify instantly for rental listings.

Step 3

Access RoomLen

Unlock liquidity for rent payments and deposits.

Visual flow diagram:

RoomID → RoomFi → RoomLen

---

# ARCHITECTURE SECTION

Explain protocol stack.

Display layered diagram:

Identity Layer

RoomID

Marketplace Layer

RoomFi

Liquidity Layer

RoomLen

Stack layout:

RoomID
↓
RoomFi
↓
RoomLen

---

# TECH CREDIBILITY

Display badges.

Powered by Noir (Aztec)

AI Document Analysis

zk-Ready Architecture

Privacy Proof Infrastructure

---

# UI COMPONENTS

Required components:

Navbar

Hero

AppCard

SectionContainer

Badge

Footer

---

# NAVBAR

Left:

Room Protocol logo

Right:

Links

Apps  
Docs  
GitHub

CTA:

Launch Apps

---

# FOOTER

Simple footer:

Room Protocol

Privacy-preserving infrastructure for rental markets.

Links:

RoomID  
RoomFi  
RoomLen  
GitHub

---

# ANIMATION

Cards should animate on hover.

Use subtle motion:

scale: 1 → 1.03

Glow effect on hover.

Hero elements can fade in.

---

# RESPONSIVE DESIGN

Mobile first.

Stack sections vertically.

Cards should become single column.

---

# DEMO GOAL

The portal must communicate:

This is a **protocol ecosystem**, not a single application.

Structure:

RoomID → identity  
RoomFi → marketplace  
RoomLen → liquidity

Together forming **Room Protocol**.

---

# Expected Outcome

The generated UI should look similar to modern crypto ecosystem portals such as:

EigenLayer  
Uniswap  
Aave

Large cards, minimal text, strong visual hierarchy.

Focus on clarity and ecosystem storytelling.