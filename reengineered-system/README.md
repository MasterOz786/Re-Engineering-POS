# Reengineered POS System

Modern web-based Point-of-Sale system built with Node.js, Express, React, and PostgreSQL.

## Technology Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt

## Project Structure

```
reengineered-system/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── repositories/# Data access layer
│   │   ├── models/      # Sequelize models
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utility functions
│   │   └── types/       # TypeScript types
│   └── package.json
│
└── frontend/         # React application
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── store/       # State management
    │   ├── utils/        # Utility functions
    │   └── types/        # TypeScript types
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure database connection in .env
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Architecture Improvements

1. **Layered Architecture**: Clear separation of concerns
2. **Repository Pattern**: Abstracted data access
3. **Service Layer**: Centralized business logic
4. **Type Safety**: TypeScript throughout
5. **Database Transactions**: ACID compliance
6. **RESTful API**: Stateless, scalable design
7. **JWT Authentication**: Secure, stateless auth
8. **Input Validation**: Multi-layer validation

## Key Features

- Employee authentication and authorization
- Sales transaction processing
- Rental management with late fee calculation
- Return processing
- Inventory management
- Customer management
- Coupon system
- Real-time inventory updates

