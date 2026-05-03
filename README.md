# CalmConnect Backend

A scalable backend service for **CalmConnect**, an online therapy platform that connects users with certified psychologists for secure, real-time video counseling sessions.

The system supports **instant booking, psychologist availability management, wallet-based transactions, real-time communication, and complaint handling**, built using Clean Architecture principles.

---

## 📌 Overview

CalmConnect Backend powers a multi-role mental wellness platform with three main actors:

- 👤 Users → Book and attend therapy sessions  
- 🧑‍⚕️ Psychologists → Manage availability and conduct sessions  
- 🛠️ Admin → Approve psychologists and manage platform operations  

Key design philosophy:
> **Finding the suitable and genuine psychologist,keeping the privacy of user**

---

## 🏗️ Architecture

This project follows a **Clean Architecture (application-centric, event-aware design)** where the core business logic is isolated from frameworks, databases, and external services.

The dependency rule is strictly maintained:
> **Outer layers depend on inner layers, never the reverse.**

```
src/
│
├── domain/ # Core business rules (pure & framework-free)
│ ├── entities/ # Business entities (core models)
│ ├── enums/ # Domain-level enums and constants
│ └── interfaces/ # Domain contracts (repository/service interfaces)
│
├── application/ # Business use cases layer
│ ├── usecases/ # Application workflows (core logic execution)
│ ├── dtos/ # Data Transfer Objects
│ ├── mappers/ # Transformations between domain <-> DTOs
│ ├── interfaces/ # Application-level contracts
│ ├── constants/ # Application-specific constants
│ ├── utils/ # Application utilities
│ ├── errors/ # Custom application error classes
│ └── event-handlers/ # Domain/application event handlers
│
├── infrastructure/ # External systems & implementations
│ ├── config/ # Configuration (env, app configs)
│ ├── database/ # Database layer
│ │ ├── models/ # ORM/Mongoose models
│ │ └── repositories/ # Repository implementations
│ └── external/ # External services (payments, email, APIs, etc.)
│
├── interfaces/ # API layer (framework-specific layer)
│ ├── controllers/ # Request handlers
│ ├── routes/ # Route definitions (DI happens here)
│ ├── middlewares/ # Auth, validation, error handling
│ ├── constants/ # API-level constants
│ └── types/ # Request/response types (API layer)
│
├── types/ # Global TypeScript type definitions
│
├── utils/ # Global utility functions (shared helpers)
│
├── app.ts # Express app configuration
└── server.ts # Server bootstrap & startup
```

### 🔹 Design Principles
- Separation of concerns  
- Dependency inversion  
- Framework-agnostic business logic  
- Event-driven readiness (WebSocket integration)

---


## 🛠️ Tech Stack

- **Runtime:** Node.js (>=18)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)

- **Authentication:**
  - JWT (jsonwebtoken)
  - bcrypt

- **Real-time Communication:**
  - Socket.io

- **Payments:**
  - Razorpay

- **File Storage:**
  - Cloudinary
  - Multer

- **Task scheduler:**
  - BullMQ
  - Redis (ioredis)

- **Email Service:**
  - Nodemailer

- **Architecture:**
  - Clean Architecture (application-centric, event-driven)

- **Code Quality:**
  - ESLint
  - Prettier
  - TypeScript (strict mode)
---
## ✨ Features

- Instant session booking with slot locking  
- Real-time video consultation (WebRTC + Socket.io)  
- Psychologist application and admin approval workflow  
- Psychologist availability management  
- Wallet-based transaction ledger system  
- Automated refund handling  
- Complaint management system  
- Role-based access control (User, Psychologist, Admin) 
---

## 🔐 Authentication & Authorization

- JWT-based stateless authentication
- Role-based access control:
  - USER
  - PSYCHOLOGIST
  - ADMIN
- Protected routes via middleware guards

---

## 🔄 Core System Workflows

This section describes how the core backend systems interact in real-world usage.

---

### 1. Psychologist Application & Verification Flow
Psychologist registers on the platform → submits required documents (resume, license, ID proof) → application enters **PENDING state** → admin reviews application → application is either APPROVED or REJECTED → upon approval, psychologist gains access to dashboard features (availability management, sessions, consultations).

---

### 2. Booking & Payment Flow (User → System)
User selects a psychologist → views available slots → selects a slot → completes payment via Razorpay → session is created instantly → slot is locked → booking confirmation is reflected in the Sessions page.

---

### 3. Session Lifecycle (WebRTC Consultation Flow)
User joins scheduled session → WebRTC connection is established → real-time video and chat session runs → session ends → session is marked COMPLETED → user can view session history and optionally rate the psychologist or raise a complaint.

---

### 4. Availability Management (Psychologist Side)
Psychologist defines weekly availability → system generates available slots → optional override for special days → users can only book from available slots → once booked, slots are locked automatically to prevent conflicts.

---

### 5. Complaint Management Flow
User raises complaint against a psychologist he has consulted → complaint is stored in the system → admin reviews user, psychologist, and session context → resolution is recorded → both user and psychologist are notified of the outcome.

---

### 6. Wallet & Refund Flow
All payments are recorded in the wallet ledger system → successful sessions remain as completed transactions → failed or cancelled sessions trigger refund logic → refunded amounts are credited back to the wallet and visible in transaction history.

---


## 🔐 Environment Variables

The project uses separate environment configurations for **development** and **production**.

---

### 🌱 Development (.env)
Create an .env file at root
Use .env.development.example file for examples


### 🌱 Production (.env.prod)
Create a .env.prod file at root
Use .env.production.example file for examples

---

## ⚙️ Installation & Setup

### 1. Clone repository

```bash
git clone https://github.com/gokulrl-developer/calmconnect-backend.git
cd calmconnect-backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run development server

```bash
npm run dev
```

---



## 📊 Key Design Decisions

- ❌ No request-based booking → instant booking system
- 📅 Psychologists control availability
- 💳 Wallet used as transaction ledger (not user-controlled fund system)
- 🔁 Refunds handled automatically via wallet credits
- 🧠 Clean Architecture for scalability & maintainability

---

## 🚀 Deployment

Backend is currently deployed on:
- AWS EC2
- Docker (production)

### 🔹 Requirements for deployment
- Node.js (v18+)
- MongoDB (Atlas or self-hosted)
- Redis (required for BullMQ job queues)

### Docker Deployment

Build Docker image:


docker build -t calmconnect-backend .


Run container:

development:

docker run -p 3000:3000 --env-file .env calmconnect-backend

production:

docker run -p 3000:3000 --env-file .env.prod calmconnect-backend

> Ensure environment variables are configured correctly before deployment.


## 🔗 API Reference

Frontend Repository: https://github.com/gokulrl-developer/calmconnect-frontend.git


## 🤝 Contributing

This is a personal portfolio project and is not open for contributions.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Gokul R.L

github profile: https://github.com/gokulrl-developer
