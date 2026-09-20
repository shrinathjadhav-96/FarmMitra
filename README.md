# 🌾 FarmMitra — Kisan Ka Direct Marketplace

> **Connecting Indian farmers directly with verified commercial buyers for transparent crop offer discovery and direct deal closure.**

FarmMitra solves a critical problem faced by Indian farmers: **limited visibility into competing buyer price offers outside local mandis**. FarmMitra enables farmers to publish crop produce, receive multiple competing buyer offers, compare price bids side-by-side, and lock in direct deals.

---

## 🚀 Key Features

### 👨‍🌾 Farmer Features

- **Mobile-First Produce Listing ("SELL MY CROP")**: Easy step-by-step form to list crops (Tomato, Wheat, Soyabean, Potato, Onion, Cotton, etc.).
- **📍 Auto-Location Detection**: Uses browser geolocation permissions and reverse-geocoding to automatically detect District & State (e.g. _Bidar, Karnataka_).
- **Exact Produce Photo Matching**: Automatically assigns verified high-resolution crop photos to every produce name listed.
- **Side-by-Side Offer Comparison Engine**: Evaluate multiple buyer bids side-by-side with target price delta indicators (`+₹3 above target`).
- **Listing Management**: View active listings, mark crops as unavailable, or edit details.

### 🏢 Buyer Features

- **Crop Discovery ("FIND CROPS")**: Browse live agricultural produce across India.
- **Search & Multi-Parameter Filters**: Search by Crop Name or District/State; filter by Crop Category, Location, Max Price (₹), and Min Quantity (kg).
- **Produce Detail Modal**: View complete crop specs, harvest availability dates, quality notes, and verified seller credentials.
- **Make an Offer**: Submit custom price bids (₹/unit), requested quantities, and delivery notes directly to farmers.

### 🛡️ Admin & Verification Console

- **Buyer Verification Workflow**: Review commercial buyer applications (`Wholesaler`, `Retailer`, `Supermarket`, `Food Processor`, `Restaurant`) and award **✓ Verified Buyer** badges.
- **Account Moderation**: Verify, reject, or disable suspicious accounts.
- **Amazon CloudWatch Dashboard**: Real-time telemetry monitoring registered user metrics, active listings, offer acceptance rates, API health, and Lambda logs.

---

## 🏗️ AWS Serverless Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│                         React SPA (Vite + Tailwind CSS)                        │
│            [ Ronas IT Mobile-First UX / Bottom Navigation Bar / PWA ]           │
└──────┬───────────────────────────┬─────────────────────────────┬───────────────┘
       │ Auth (JWT/Tokens)         │ REST APIs / Gateway         │ Image Assets
       ▼                           ▼                             ▼
┌──────────────┐          ┌───────────────────┐        ┌───────────────────┐
│ Amazon       │          │ Amazon API        │        │ Amazon S3         │
│ Cognito      │          │ Gateway           │        │ Bucket            │
└──────────────┘          └────────┬──────────┘        └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │ AWS Lambda        │
                          │ (State Engine)    │
                          └────────┬──────────┘
                                   ├──────────────────────────────┐
                                   ▼                              ▼
                          ┌───────────────────┐          ┌───────────────────┐
                          │ Amazon            │          │ Amazon SNS        │
                          │ DynamoDB          │          │ (Notifications)   │
                          └────────┬──────────┘          └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │ Amazon            │
                          │ CloudWatch        │
                          └───────────────────┘
```

| Technology             | Role                                                                          |
| :--------------------- | :---------------------------------------------------------------------------- |
| **Vite + React 18**    | Ultra-fast mobile-responsive Single Page Application                          |
| **Tailwind CSS**       | Custom agricultural palette & Ronas IT style card design                      |
| **Amazon Cognito**     | Authentication, user directory, role permissions (`FARMER`, `BUYER`, `ADMIN`) |
| **Amazon DynamoDB**    | Low-latency NoSQL database for `Users`, `CropListings`, `Offers`, and `Deals` |
| **AWS Lambda**         | Serverless state machine logic for offer validation and deal generation       |
| **Amazon API Gateway** | RESTful endpoint routing, request sanitization, and CORS handling             |
| **Amazon S3**          | Object storage hosting produce harvest photos                                 |
| **Amazon SNS**         | Event topic publisher delivering real-time notification alerts (`🔔`)         |
| **Amazon CloudWatch**  | Operational metric dashboards, log groups, and error tracking                 |

---

## 📁 Project Directory Structure

```text
FARMMITRA/
├── server/                        # Backend Serverless API Controllers
│   └── api/
│       ├── listingsController.js  # API Gateway Crop Listings Handler
│       ├── offersController.js    # AWS Lambda Offer & Deal Controller
│       ├── snsController.js       # Amazon SNS Event Notification Controller
│       └── cloudwatchController.js# Amazon CloudWatch Metrics Controller
├── src/                           # Frontend React Application
│   ├── components/                # Modular Reusable UI Components
│   │   ├── Navbar.jsx             # Top Header Navigation & Role Indicators
│   │   ├── BottomNav.jsx          # Mobile Bottom Navigation Bar (Ronas IT UX)
│   │   ├── CreateListingModal.jsx # Crop Publishing & Auto-Location Form
│   │   ├── ListingCard.jsx        # Farmer Dashboard Produce Card
│   │   ├── BuyerListingCard.jsx   # Buyer Crop Discovery Card
│   │   ├── CropDetailsModal.jsx   # Detailed Crop Specs View
│   │   ├── MakeOfferModal.jsx     # Buyer Offer Submission Modal
│   │   ├── OfferComparisonView.jsx# Side-by-Side Offer Evaluation Engine
│   │   ├── DealCard.jsx           # Confirmed Direct Deal Record Card
│   │   ├── NotificationBell.jsx   # Real-time SNS Notification Drawer (🔔)
│   │   └── CloudWatchDashboardWidget.jsx # Admin CloudWatch Telemetry Widget
│   ├── context/
│   │   └── AuthContext.jsx        # Session State & Role Routing
│   ├── pages/                     # Main Application Views
│   │   ├── LandingPage.jsx        # Public Home Page & CTA Buttons
│   │   ├── LoginPage.jsx          # Auth Page & Fast Demo Accounts
│   │   ├── RegisterPage.jsx       # User Registration with Role & Buyer Types
│   │   ├── FarmerDashboard.jsx    # Farmer Portal & Offer Comparison
│   │   ├── BuyerDashboard.jsx     # Buyer Produce Discovery & Search Grid
│   │   └── AdminDashboard.jsx     # Admin Verification & CloudWatch Console
│   ├── services/                  # API Services & DB Interfaces
│   │   ├── apiClient.js           # REST API Gateway Client
│   │   ├── dynamoService.js       # Amazon DynamoDB Data Access Layer
│   │   ├── offerService.js        # AWS Lambda Offer & Deal Service
│   │   ├── notificationService.js # Amazon SNS Event Client
│   │   ├── userService.js         # Amazon Cognito User Directory Service
│   │   ├── locationService.js     # Geolocation & Reverse Geocoding
│   │   └── cloudWatchService.js   # Amazon CloudWatch Metrics Collector
│   ├── utils/
│   │   └── cropImageRegistry.js   # Verified High-Res Crop Photo Matcher
│   ├── aws-exports.js             # AWS Amplify Configuration
│   ├── App.jsx                    # Router & Role-Based Protected Routes
│   └── main.jsx                   # React Entry Point
├── PRD.md                         # Product Requirement Document
├── TRD.md                         # Technical Requirement Document
├── PROJECT_PROGRESS.md            # Phase Execution Ledger
├── package.json                   # Dependencies & Run Scripts
├── vite.config.js                 # Vite Bundler Configuration
└── tailwind.config.js             # Custom Agricultural Theme Styling
```

---

## ⚡ Quick Start & Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies

```bash
cd FARMMITRA
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**

### 3. Build for Production

```bash
npm run build
```

---

## 🔑 One-Click Demo Accounts

To test the application instantly, open `http://localhost:3000/login` and click any one-click demo account:

1. **Demo Farmer (Ramesh Kumar)**
   - Email: `farmer@farmmitra.in`
   - Dashboard: `/farmer-dashboard`
   - Access: Publish crops, compare competing buyer offers side-by-side, accept/reject deals.

2. **Demo Buyer (Wholesale Agro Traders)**
   - Email: `buyer@farmmitra.in`
   - Dashboard: `/buyer-dashboard`
   - Access: Browse produce, search by crop/district, submit custom price offers.

3. **Demo Admin (FarmMitra Admin)**
   - Email: `admin@farmmitra.in`
   - Dashboard: `/admin-dashboard`
   - Access: Review buyer verification applications, assign **✓ Verified Buyer** badges, monitor Amazon CloudWatch telemetry.

---

## 🌟 Hackathon Benchmark Demo Flow

```text
FARMER (Ramesh Kumar, Bidar, Karnataka)
Crop: Tomato (1,000 kg @ ₹18/kg expected)
        │
        ▼
   PUBLISHED
        │
        ├──────────────────────────────────────┐
        ▼                                      ▼
BUYER A (Wholesale Agro Traders)     BUYER B (FreshSupermarket Ltd)
Offer: ₹19/kg for 500 kg             Offer: ₹21/kg for 800 kg
        │                                      │
        └──────────────────┬───────────────────┘
                           ▼
               FARMER COMPARES OFFERS
      (Side-by-side comparison displays +₹3 delta)
                           │
                           ▼
               FARMER ACCEPTS BUYER B
                           │
                           ▼
                 DIRECT DEAL CONFIRMED
           Total Value: ₹16,800 (800 kg @ ₹21/kg)
```

---

## 📄 Documentation Links

- [Product Requirement Document (PRD)](file:///c:/Users/vaibh/Desktop/FARMMITRA/PRD.md)
- [Technical Requirement Document (TRD)](file:///c:/Users/vaibh/Desktop/FARMMITRA/TRD.md)
- [Project Progress Ledger](file:///c:/Users/vaibh/Desktop/FARMMITRA/PROJECT_PROGRESS.md)

---

## 📜 License

Built for the AWS Hackathon. All rights reserved.
