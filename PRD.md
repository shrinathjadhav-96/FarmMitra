# FarmMitra — Product Requirement Document (PRD)

## 1. Executive Summary

**FarmMitra** is a simple, direct-to-buyer agricultural marketplace designed to connect Indian farmers directly with verified commercial buyers (wholesalers, retailers, supermarkets, food processors, restaurants). The primary purpose of FarmMitra is to give farmers access to transparent, competing offers for their produce, breaking reliance on local single-buyer monopsonies.

---

## 2. Problem Statement & Core Value Proposition

### Problem Statement

Indian farmers frequently lack direct visibility into market buyers outside their local mandis or local middlemen. This leads to information asymmetry, reduced bargaining power, and forced acceptance of below-market prices.

### Core Value Proposition

> **FarmMitra gives farmers access to more buyers and transparent, comparable offers so they can make better-informed selling decisions.**

---

## 3. Target User Personas

### 3.1 Farmer

- **Profile**: Small to medium-scale crop producer in India.
- **Tech Literacy**: Low-to-moderate; primary access device is a smartphone.
- **Primary Objective**: Quick, simple crop listing ("SELL MY CROP"), receiving multiple buyer offers, comparing price/quantity, and accepting the best deal.

### 3.2 Buyer

- **Profile**: Wholesalers, retailers, supermarkets, food processors, restaurant chains, and verified bulk agricultural buyers.
- **Primary Objective**: Efficient crop discovery ("FIND CROPS"), searching/filtering produce by location/quantity/date, placing transparent offers directly to farmers.

### 3.3 Admin

- **Profile**: Platform operations team.
- **Primary Objective**: User verification (verifying buyer credentials), reviewing listings and offers, moderating platform integrity, and disabling suspicious activities.

---

## 4. Key User Workflows & Journeys

### 4.1 Farmer Marketplace Flow

```text
Register/Login ──> Farmer Dashboard ──> "SELL MY CROP" ──> Create Listing ──> Publish
                     ▲                                                             │
                     └────── Receive & Compare Offers ◄───── Offers Placed ◄───────┘
                                       │
                                 Accept Offer ──> Deal Created & Confirmed
```

### 4.2 Buyer Marketplace Flow

```text
Register/Login ──> Buyer Dashboard ──> "FIND CROPS" ──> Search/Filter Listings ──> View Details
                                                                                          │
                    Deals Tracker ◄── Offer Accepted ◄── Farmer Review ◄── Make Offer ◄───┘
```

---

## 5. Functional Requirements

### 5.1 User Management & Authentication (Phase 1 & Phase 6)

- User registration with Role selection (`Farmer`, `Buyer`, `Admin`).
- Secure authentication via email/phone and password using Amazon Cognito / AWS Amplify Auth.
- Buyer business verification workflow (Pending, Verified, Rejected).
- Profile view & management.

### 5.2 Farmer Listing System (Phase 2)

- Create crop listing:
  - Crop Name (e.g. Tomato, Wheat, Potato, Onion)
  - Quantity & Unit (kg, quintal, ton)
  - Expected Price per unit (₹)
  - Location (District, State, PIN)
  - Harvest/Availability Date
  - Crop Image upload (stored in Amazon S3)
  - Optional description
- Manage listings: View my active/sold listings, Edit listing details, Delete/Close listing.

### 5.3 Buyer Crop Discovery & Search System (Phase 3)

- Browse all active listings in a clean grid/list format.
- Search listings by Crop Name or Location.
- Filter listings by price range, location/state, quantity, and availability.
- Detailed listing page showing farmer location, expected price, harvest date, and crop photos.

### 5.4 Offer & Comparison System (Phase 4)

- Buyer places offer on a listing:
  - Offer price per unit (₹)
  - Requested quantity
  - Message/Note to farmer
- Farmer views received offers for a specific listing side-by-side.
- Farmer can **Accept** or **Reject** an offer.
- Accepting an offer automatically transitions listing/offer status to `ACCEPTED` and generates a binding **Deal record**.

### 5.5 Notifications (Phase 5)

- Real-time / automated notifications when:
  - A buyer submits an offer on a farmer's listing.
  - A farmer accepts or rejects a buyer's offer.
  - Buyer verification status is updated by Admin.
- Amazon SNS integration for alert delivery.

### 5.6 Admin & Verification System (Phase 6)

- Dashboard summarizing active Users, Listings, Offers, and Deals.
- Review buyer verification applications and approve/reject badges.
- Moderation action: disable fraudulent listings or suspend suspicious accounts.

### 5.7 Monitoring & Operational Polishing (Phase 7)

- Operational observability with Amazon CloudWatch (metrics, error logs, request latency).
- Mobile UI polishing, edge-case validation, offline-friendly UX touches.

---

## 6. Non-Functional Requirements & UX Principles

### 6.1 Mobile-First UI Design

- Clean, uncluttered layout optimized for smartphones.
- High-contrast, large touch targets (buttons minimum 48px height).
- Simple vernacular-friendly language; avoid technical jargon.
- Obvious CTA buttons: **"SELL MY CROP"** and **"FIND CROPS"**.

### 6.2 Security & Compliance

- No hardcoded AWS secrets or API keys in frontend code.
- Role-based access control (RBAC) enforced at backend level (Cognito Groups / Lambda authorization).
- Secure upload URLs for S3 assets.

---

## 7. Out of Scope (Strict MVP Boundaries)

To preserve core focus and ensure fast time-to-market, the following features are **explicitly EXCLUDED**:

- ❌ AI Chatbots / Conversational AI
- ❌ AI Crop Disease Detection
- ❌ AI Price Prediction & Recommendation engines
- ❌ Weather & Satellite IoT analytics
- ❌ Blockchain / Cryptocurrency
- ❌ Integrated Payment Gateways / Automated escrow
- ❌ GPS fleet tracking & Automated transport logistics
- ❌ Agronomy recommendations, Loans & Subsidies systems

---

## 8. Demo Scenario (Benchmark Criteria)

The completed MVP must successfully execute the following scenario:

1. **Farmer (Bidar, Karnataka)**:
   - Crop: `Tomato`
   - Quantity: `1,000 kg`
   - Expected Price: `₹18/kg`
2. **Buyer A (Wholesaler)**:
   - Offer: `₹19/kg` for `500 kg`
3. **Buyer B (Supermarket Chain)**:
   - Offer: `₹21/kg` for `800 kg`
4. **Farmer Offer Comparison Screen**:
   - Displays Buyer A and Buyer B side-by-side with price delta highlighting.
   - Farmer accepts Buyer B's offer at ₹21/kg.
   - Deal record created; listing status updated.
