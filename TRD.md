# FarmMitra — Technical Requirement Document (TRD)

## 1. System Architecture & Tech Stack

### 1.1 Overview

FarmMitra is built as a cloud-native serverless web application. The frontend is a responsive React Single Page Application (SPA) powered by Vite, Tailwind CSS, and Lucide Icons. The backend leverages AWS Serverless primitives for zero-infrastructure maintenance, high scalability, and strict security.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        React SPA (Vite + Tailwind)                     │
│               [ Mobile Responsive / Farmer & Buyer Views ]             │
└──────┬──────────────────────────┬──────────────────────────────┬───────┘
       │ Auth (JWT/Tokens)        │ REST / API Calls             │ Image Upload
       ▼                          ▼                              ▼
┌──────────────┐         ┌────────────────┐             ┌─────────────────┐
│ Amazon       │         │ Amazon API     │             │ Amazon S3       │
│ Cognito      │         │ Gateway        │             │ Bucket          │
└──────────────┘         └───────┬────────┘             └─────────────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │ AWS Lambda     │
                         │ (Node.js/Py)   │
                         └───────┬────────┘
                                 ├──────────────────────────────┐
                                 ▼                              ▼
                         ┌────────────────┐             ┌─────────────────┐
                         │ Amazon         │             │ Amazon SNS      │
                         │ DynamoDB       │             │ (Notifications) │
                         └────────────────┘             └─────────────────┘
                                 │
                                 ▼
                         ┌────────────────┐
                         │ Amazon         │
                         │ CloudWatch     │
                         └────────────────┘
```

---

## 2. Component Breakdown & AWS Services

| Service                         | Role / Function in FarmMitra                                                            |
| :------------------------------ | :-------------------------------------------------------------------------------------- |
| **Vite + React + Tailwind CSS** | Mobile-first SPA frontend, quick render, clean agricultural UI components               |
| **Amazon Cognito**              | User directory, authentication, role claims (`Farmer`, `Buyer`, `Admin`)                |
| **Amazon DynamoDB**             | NoSQL database storing Users, Listings, Offers, and Deals                               |
| **AWS Lambda**                  | Serverless REST API endpoints for business logic, status transitions, and deal creation |
| **Amazon API Gateway**          | API routing, CORS handling, authentication verification via Cognito Authorizer          |
| **Amazon S3**                   | High-durability object storage for crop images with pre-signed upload URLs              |
| **Amazon SNS**                  | Notification delivery service for buyer offers and deal updates                         |
| **Amazon CloudWatch**           | Application logs, metric dashboards, and API error tracking                             |

---

## 3. Data Schema & Models (DynamoDB)

### 3.1 `Users` Table

- **Partition Key**: `userId` (String)

```json
{
  "userId": "usr_982347102",
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phone": "+919876543210",
  "role": "Farmer", // "Farmer" | "Buyer" | "Admin"
  "location": "Bidar, Karnataka",
  "verificationStatus": "VERIFIED", // "PENDING" | "VERIFIED" | "REJECTED"
  "createdAt": "2026-09-18T10:00:00.000Z"
}
```

### 3.2 `CropListings` Table

- **Partition Key**: `listingId` (String)
- **GSI 1 (FarmerListings)**: `farmerId` (Partition Key), `createdAt` (Sort Key)
- **GSI 2 (StatusIndex)**: `status` (Partition Key), `createdAt` (Sort Key)

```json
{
  "listingId": "lst_1029384",
  "farmerId": "usr_982347102",
  "cropName": "Tomato",
  "quantity": 1000,
  "unit": "kg", // "kg" | "quintal" | "ton"
  "expectedPrice": 18,
  "location": "Bidar, Karnataka",
  "availabilityDate": "2026-09-25",
  "imageUrl": "https://farmmitra-assets.s3.amazonaws.com/crops/tomato_1.jpg",
  "description": "Fresh harvest organic tomatoes ready for pickup.",
  "status": "ACTIVE", // "ACTIVE" | "DEAL_CLOSED" | "CANCELLED"
  "createdAt": "2026-09-18T10:30:00.000Z",
  "updatedAt": "2026-09-18T10:30:00.000Z"
}
```

### 3.3 `Offers` Table

- **Partition Key**: `offerId` (String)
- **GSI 1 (ListingOffers)**: `listingId` (Partition Key), `offerPrice` (Sort Key)
- **GSI 2 (BuyerOffers)**: `buyerId` (Partition Key), `createdAt` (Sort Key)

```json
{
  "offerId": "off_55443322",
  "listingId": "lst_1029384",
  "buyerId": "usr_buyer_001",
  "buyerName": "Agro Wholesale Corp",
  "farmerId": "usr_982347102",
  "offerPrice": 21,
  "quantity": 800,
  "message": "Can arrange transport tomorrow.",
  "status": "ACCEPTED", // "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED"
  "createdAt": "2026-09-18T11:15:00.000Z",
  "updatedAt": "2026-09-18T11:45:00.000Z"
}
```

### 3.4 `Deals` Table

- **Partition Key**: `dealId` (String)
- **GSI 1 (FarmerDeals)**: `farmerId` (Partition Key), `createdAt` (Sort Key)
- **GSI 2 (BuyerDeals)**: `buyerId` (Partition Key), `createdAt` (Sort Key)

```json
{
  "dealId": "dl_99887766",
  "listingId": "lst_1029384",
  "offerId": "off_55443322",
  "farmerId": "usr_982347102",
  "buyerId": "usr_buyer_001",
  "agreedPrice": 21,
  "quantity": 800,
  "unit": "kg",
  "totalValue": 16800,
  "status": "CONFIRMED", // "CONFIRMED" | "COMPLETED" | "CANCELLED"
  "createdAt": "2026-09-18T11:45:00.000Z"
}
```

---

## 4. REST API Endpoint Specification

### 4.1 Auth & User Management

- `POST /auth/register` — Create new user record with role (`Farmer`, `Buyer`, `Admin`).
- `POST /auth/login` — Authenticate user and return session token + user profile.
- `GET /users/me` — Fetch currently logged-in user profile.
- `GET /users` — [Admin] List all registered users.
- `PATCH /users/:userId/verify` — [Admin] Approve or reject buyer verification.

### 4.2 Listings API

- `POST /listings` — [Farmer] Create new crop listing.
- `GET /listings` — Browse all active crop listings (Supports `cropName`, `location`, `minPrice`, `maxPrice` query parameters).
- `GET /listings/:id` — Get detailed view of specific listing.
- `GET /listings/farmer/:farmerId` — Get listings created by specific farmer.
- `PATCH /listings/:id` — [Farmer] Update crop listing details or status.
- `DELETE /listings/:id` — [Farmer/Admin] Delete listing.
- `POST /listings/upload-url` — Get pre-signed AWS S3 URL for uploading crop images.

### 4.3 Offers API

- `POST /offers` — [Buyer] Create offer for a listing.
- `GET /offers/listing/:listingId` — [Farmer] View all offers received for a listing.
- `GET /offers/buyer/:buyerId` — [Buyer] View all offers placed by buyer.
- `POST /offers/:offerId/accept` — [Farmer] Accept buyer offer (Triggers Deal creation and updates listing status).
- `POST /offers/:offerId/reject` — [Farmer] Reject buyer offer.

### 4.4 Deals API

- `GET /deals/farmer/:farmerId` — Get confirmed deals for farmer.
- `GET /deals/buyer/:buyerId` — Get confirmed deals for buyer.
- `GET /deals/:dealId` — Get details of single deal.

---

## 5. Phase-by-Phase Technical Implementation Plan

| Phase       | Core Objective                    | Key Deliverables                                                                             | Primary AWS Focus               |
| :---------- | :-------------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------ |
| **Phase 1** | Project Foundation + Auth + Roles | SPA setup, Cognito / Mock Auth state, Role routing (Farmer/Buyer/Admin)                      | Amazon Cognito                  |
| **Phase 2** | Farmer Crop Listing System        | Listing creation form, S3 image upload, My Listings dashboard, CRUD endpoints                | Amazon DynamoDB + S3            |
| **Phase 3** | Buyer Discovery & Search          | Browse grid, Search by crop/location, Filter controls, Listing detail view                   | AWS API Gateway + Lambda        |
| **Phase 4** | Buyer Offer System                | Offer submission, Side-by-side offer comparison table, Offer accept/reject & Deal generation | AWS Lambda                      |
| **Phase 5** | Notifications                     | Automated notifications upon offer creation and deal acceptance                              | Amazon SNS                      |
| **Phase 6** | Verification & Trust              | Buyer verification application flow, Admin verification dashboard, Moderation                | Amazon Cognito + Admin workflow |
| **Phase 7** | Monitoring & Final Polishing      | CloudWatch metrics integration, Demo scenario end-to-end testing, UX polish                  | Amazon CloudWatch               |

---

## 6. Development Setup & Security Standards

### 6.1 Local Development Stack

- Node.js (v18+)
- Vite + React
- Tailwind CSS for styling
- Lucide React for clean icon sets
- Local/Mock fallback service layer with seamless toggle to live AWS SDK / API Gateway endpoints.

### 6.2 Security Rules

1. Never commit `.env` containing sensitive credentials to repository.
2. API Gateway CORS configured strictly for trusted origin endpoints.
3. Strict IAM role permissions scoped to exact DynamoDB tables and S3 prefixes.
