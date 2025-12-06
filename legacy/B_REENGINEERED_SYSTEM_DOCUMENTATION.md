# B. Reengineered System Documentation (Forward Engineered)

## Table of Contents
1. [Updated Architecture](#updated-architecture)
2. [Design Diagrams](#design-diagrams)
3. [Refactored Module Structure](#refactored-module-structure)
4. [Database Schema](#database-schema)
5. [Migration Plan](#migration-plan)
6. [Technology Stack Selection](#technology-stack-selection)
7. [Component Mapping](#component-mapping)
8. [Architecture Improvements](#architecture-improvements)

---

## Updated Architecture

### Three-Tier Web Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                    (React Frontend)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login      │  │   Dashboard  │  │  Transaction │      │
│  │  Component   │  │  Component   │  │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Inventory  │  │   Employee   │  │   Customer   │      │
│  │  Management  │  │  Management  │  │  Management  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  React Router │ State Management (Redux/Context)           │
│  Axios/Fetch for API calls                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                 │
│              (Express.js Backend)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │  Transaction │  │  Inventory   │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Employee   │  │   Customer   │  │   Coupon     │      │
│  │  Controller  │  │  Controller  │  │  Controller│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Middleware: Auth │ Validation │ Error Handling │ Logging   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                       │
│                    (Service Layer)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │  Transaction │  │  Inventory   │      │
│  │  Service     │  │  Service     │  │  Service     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Employee   │  │   Customer   │  │   Pricing    │      │
│  │  Service     │  │  Service     │  │  Service     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Business Rules │ Validation │ Calculations │ Workflows     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                         │
│              (Repository Pattern)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Employee   │  │  Transaction │  │  Inventory   │      │
│  │  Repository  │  │  Repository  │  │  Repository  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Customer   │  │   Rental     │  │   Coupon     │      │
│  │  Repository  │  │  Repository  │  │  Repository  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ORM (Sequelize/TypeORM) │ Query Builders │ Data Mappers    │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                           │
│              (PostgreSQL)                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  employees   │  │ transactions │  │    items     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  customers   │  │   rentals    │  │   coupons    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ACID Transactions │ Indexes │ Constraints │ Triggers        │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Architecture

```
Client Request
    │
    ├─→ React Component
    │       │
    │       ├─→ API Service (Axios)
    │       │       │
    │       │       └─→ HTTP Request
    │       │
    │       └─→ State Update (Redux/Context)
    │
    ├─→ Express Server
    │       │
    │       ├─→ Middleware Chain
    │       │       │
    │       │       ├─→ CORS
    │       │       ├─→ Body Parser
    │       │       ├─→ Authentication (JWT)
    │       │       ├─→ Authorization
    │       │       └─→ Validation
    │       │
    │       ├─→ Route Handler
    │       │       │
    │       │       └─→ Controller
    │       │               │
    │       │               └─→ Service Layer
    │       │                       │
    │       │                       └─→ Repository
    │       │                               │
    │       │                               └─→ Database Query
    │       │
    │       └─→ Response
    │
    └─→ Client Response
```

---

## Design Diagrams

### Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Services   │      │
│  │              │  │              │  │              │      │
│  │ - Login      │  │ - Button     │  │ - Auth API    │      │
│  │ - Dashboard  │  │ - Input      │  │ - Item API    │      │
│  │ - Sales      │  │ - Modal      │  │ - Transaction│      │
│  │ - Rentals    │  │ - Table      │  │   API        │      │
│  │ - Returns    │  │ - Form       │  │              │      │
│  │ - Inventory  │  │              │  │              │      │
│  │ - Employees  │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  State Management: Redux Toolkit / React Context            │
│  Routing: React Router                                      │
│  HTTP Client: Axios                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                    REST API (JSON)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Routes      │  │ Controllers  │  │  Services    │      │
│  │              │  │              │  │              │      │
│  │ /api/auth    │  │ AuthCtrl     │  │ AuthService  │      │
│  │ /api/items   │  │ ItemCtrl     │  │ ItemService  │      │
│  │ /api/trans   │  │ TransCtrl    │  │ TransService │      │
│  │ /api/rentals │  │ RentalCtrl   │  │ RentalService│      │
│  │ /api/employees│ │ EmployeeCtrl │  │ EmpService   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Repositories │  │  Models      │  │  Middleware  │      │
│  │              │  │              │  │              │      │
│  │ EmployeeRepo │  │ Employee     │  │ Auth         │      │
│  │ ItemRepo     │  │ Item         │  │ Validation   │      │
│  │ TransRepo    │  │ Transaction  │  │ Error Handler│      │
│  │ RentalRepo   │  │ Rental       │  │ Logger       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ORM: Sequelize / TypeORM                                   │
│  Validation: Joi / express-validator                        │
│  Authentication: JWT (jsonwebtoken)                         │
└─────────────────────────────────────────────────────────────┘
                            │
                    SQL Queries
                            │
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tables: employees, items, transactions,                    │
│          transaction_items, customers, rentals,               │
│          coupons, employee_logs                             │
│                                                              │
│  Indexes, Constraints, Foreign Keys, Triggers               │
└─────────────────────────────────────────────────────────────┘
```

### Class/Module Structure (TypeScript/JavaScript)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  src/                                                        │
│  ├── components/                                            │
│  │   ├── common/                                            │
│  │   │   ├── Button.tsx                                    │
│  │   │   ├── Input.tsx                                     │
│  │   │   ├── Modal.tsx                                     │
│  │   │   └── Table.tsx                                     │
│  │   ├── auth/                                              │
│  │   │   └── LoginForm.tsx                                 │
│  │   ├── transactions/                                      │
│  │   │   ├── SaleForm.tsx                                   │
│  │   │   ├── RentalForm.tsx                                │
│  │   │   └── ReturnForm.tsx                                │
│  │   └── inventory/                                         │
│  │       └── ItemList.tsx                                   │
│  ├── pages/                                                 │
│  │   ├── LoginPage.tsx                                     │
│  │   ├── DashboardPage.tsx                               │
│  │   ├── SalesPage.tsx                                     │
│  │   ├── RentalsPage.tsx                                   │
│  │   └── InventoryPage.tsx                                  │
│  ├── services/                                              │
│  │   ├── api.ts                                             │
│  │   ├── authService.ts                                    │
│  │   ├── itemService.ts                                    │
│  │   └── transactionService.ts                             │
│  ├── store/                                                 │
│  │   ├── slices/                                            │
│  │   │   ├── authSlice.ts                                   │
│  │   │   └── itemSlice.ts                                  │
│  │   └── store.ts                                           │
│  └── utils/                                                 │
│      ├── constants.ts                                       │
│      └── validators.ts                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  src/                                                        │
│  ├── routes/                                                 │
│  │   ├── auth.routes.ts                                     │
│  │   ├── item.routes.ts                                     │
│  │   ├── transaction.routes.ts                              │
│  │   └── employee.routes.ts                                 │
│  ├── controllers/                                           │
│  │   ├── auth.controller.ts                                 │
│  │   ├── item.controller.ts                                 │
│  │   ├── transaction.controller.ts                          │
│  │   └── employee.controller.ts                             │
│  ├── services/                                              │
│  │   ├── auth.service.ts                                    │
│  │   ├── item.service.ts                                    │
│  │   ├── transaction.service.ts                             │
│  │   ├── pricing.service.ts                                 │
│  │   └── rental.service.ts                                  │
│  ├── repositories/                                          │
│  │   ├── employee.repository.ts                             │
│  │   ├── item.repository.ts                                 │
│  │   ├── transaction.repository.ts                          │
│  │   └── rental.repository.ts                              │
│  ├── models/                                                │
│  │   ├── Employee.ts                                        │
│  │   ├── Item.ts                                            │
│  │   ├── Transaction.ts                                    │
│  │   └── Rental.ts                                          │
│  ├── middleware/                                            │
│  │   ├── auth.middleware.ts                                 │
│  │   ├── validation.middleware.ts                           │
│  │   └── error.middleware.ts                                │
│  ├── utils/                                                 │
│  │   ├── constants.ts                                       │
│  │   ├── validators.ts                                      │
│  │   └── helpers.ts                                         │
│  └── config/                                                │
│      ├── database.ts                                        │
│      └── app.ts                                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Refactored Module Structure

### 1. Authentication Module

**Legacy:** `POSSystem.java`, `Employee.java`, `EmployeeManagement.java`

**Reengineered:**
- **Frontend:** `LoginPage.tsx`, `LoginForm.tsx`, `authService.ts`
- **Backend:** `auth.controller.ts`, `auth.service.ts`, `auth.routes.ts`
- **Models:** `Employee.ts` (Sequelize model)
- **Repository:** `employee.repository.ts`

**Improvements:**
- JWT-based stateless authentication
- Password hashing with bcrypt
- Role-based access control middleware
- Token refresh mechanism
- Secure session management

### 2. Transaction Processing Module

**Legacy:** `PointOfSale.java`, `POS.java`, `POR.java`, `POH.java`

**Reengineered:**
- **Frontend:** `SalesPage.tsx`, `RentalsPage.tsx`, `ReturnsPage.tsx`
- **Backend:** `transaction.controller.ts`, `transaction.service.ts`
- **Services:** `pricing.service.ts`, `tax.service.ts`, `coupon.service.ts`
- **Repository:** `transaction.repository.ts`, `rental.repository.ts`

**Improvements:**
- Strategy pattern for transaction types
- Service layer separation
- Database transactions for ACID compliance
- Event-driven architecture for notifications
- Comprehensive validation

### 3. Inventory Management Module

**Legacy:** `Inventory.java` (Singleton), `Item.java`

**Reengineered:**
- **Frontend:** `InventoryPage.tsx`, `ItemList.tsx`, `ItemForm.tsx`
- **Backend:** `item.controller.ts`, `item.service.ts`
- **Repository:** `item.repository.ts`
- **Models:** `Item.ts`

**Improvements:**
- Repository pattern instead of Singleton
- Database-backed inventory
- Real-time stock updates
- Low stock alerts
- Inventory history tracking

### 4. Customer & Rental Management Module

**Legacy:** `Management.java`, `ReturnItem.java`

**Reengineered:**
- **Frontend:** `CustomerPage.tsx`, `RentalHistory.tsx`
- **Backend:** `customer.controller.ts`, `rental.controller.ts`
- **Services:** `customer.service.ts`, `rental.service.ts`
- **Repository:** `customer.repository.ts`, `rental.repository.ts`
- **Models:** `Customer.ts`, `Rental.ts`

**Improvements:**
- Normalized customer data
- Proper rental tracking with relationships
- Automated late fee calculation
- Customer history and analytics
- Email notifications for due dates

### 5. Employee Administration Module

**Legacy:** `Admin_Interface.java`, `AddEmployee_Interface.java`, `UpdateEmployee_Interface.java`

**Reengineered:**
- **Frontend:** `EmployeeManagementPage.tsx`, `EmployeeForm.tsx`
- **Backend:** `employee.controller.ts`, `employee.service.ts`
- **Repository:** `employee.repository.ts`

**Improvements:**
- RESTful API for CRUD operations
- Comprehensive validation
- Audit logging
- Soft delete support
- Role management

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│  employees   │         │  customers   │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ username (UQ)│         │ phone (UQ)   │
│ password_hash│         │ first_name   │
│ first_name   │         │ last_name    │
│ last_name    │         │ email        │
│ position     │         │ created_at  │
│ is_active    │         │ updated_at  │
│ created_at   │         └──────┬───────┘
│ updated_at   │                │
└──────┬───────┘                │
       │                        │
       │                        │
       │         ┌──────────────▼──────────────┐
       │         │     transactions            │
       │         ├─────────────────────────────┤
       │         │ id (PK)                     │
       │         │ transaction_type            │
       └─────────► employee_id (FK)            │
                 │ customer_id (FK)            │
                 │ total_amount                │
                 │ tax_amount                  │
                 │ discount_amount              │
                 │ coupon_code                 │
                 │ status                      │
                 │ created_at                  │
                 └──────────────┬─────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                                │
        ┌────────▼────────┐          ┌──────────▼──────────┐
        │ transaction_items│          │      rentals        │
        ├──────────────────┤          ├─────────────────────┤
        │ id (PK)          │          │ id (PK)             │
        │ transaction_id(FK)│         │ transaction_id (FK)  │
        │ item_id (FK)     │          │ customer_id (FK)    │
        │ quantity         │          │ item_id (FK)        │
        │ unit_price       │          │ rental_date         │
        │ subtotal         │          │ due_date            │
        └────────┬─────────┘          │ return_date         │
                 │                     │ is_returned         │
                 │                     │ late_fee            │
                 │                     └─────────────────────┘
                 │
        ┌────────▼─────────┐
        │      items        │
        ├───────────────────┤
        │ id (PK)           │
        │ item_code (UQ)     │
        │ name               │
        │ price              │
        │ quantity           │
        │ category           │
        │ created_at         │
        │ updated_at         │
        └────────────────────┘
```

### Complete Schema Definition

```sql
-- Employees Table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position VARCHAR(20) NOT NULL CHECK (position IN ('Admin', 'Cashier')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_username ON employees(username);
CREATE INDEX idx_employees_position ON employees(position);

-- Items Table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_code ON items(item_code);
CREATE INDEX idx_items_category ON items(category);

-- Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone_number);

-- Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Sale', 'Rental', 'Return')),
    employee_id INTEGER REFERENCES employees(id),
    customer_id INTEGER REFERENCES customers(id),
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    coupon_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_employee ON transactions(employee_id);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);

-- Transaction Items Table
CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_items_trans ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_item ON transaction_items(item_id);

-- Rentals Table
CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    customer_id INTEGER REFERENCES customers(id),
    item_id INTEGER REFERENCES items(id),
    rental_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    is_returned BOOLEAN DEFAULT FALSE,
    late_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rentals_customer ON rentals(customer_id);
CREATE INDEX idx_rentals_item ON rentals(item_id);
CREATE INDEX idx_rentals_due_date ON rentals(due_date);
CREATE INDEX idx_rentals_returned ON rentals(is_returned);

-- Coupons Table
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- Employee Logs Table
CREATE TABLE employee_logs (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    action VARCHAR(50) NOT NULL,
    details JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employee_logs_employee ON employee_logs(employee_id);
CREATE INDEX idx_employee_logs_timestamp ON employee_logs(timestamp);
```

### Schema Improvements Justification

1. **Normalization**
   - Eliminated data redundancy
   - Proper foreign key relationships
   - Third normal form compliance

2. **Data Integrity**
   - CHECK constraints prevent invalid data
   - Foreign keys ensure referential integrity
   - UNIQUE constraints prevent duplicates

3. **Performance**
   - Indexes on frequently queried columns
   - Composite indexes for common query patterns
   - Optimized for read and write operations

4. **Security**
   - Password hashing (not stored in database)
   - Audit trail with employee_logs
   - Soft deletes with is_active flag

5. **Scalability**
   - Proper indexing for large datasets
   - Partitioning-ready structure
   - Efficient query patterns

---

## Migration Plan

### Phase 1: Data Extraction

1. **Parse Text Files**
   ```javascript
   // Migration script: migrate-data.js
   const fs = require('fs');
   const path = require('path');
   
   // Read employee database
   function parseEmployeeDatabase(filePath) {
     const content = fs.readFileSync(filePath, 'utf-8');
     const lines = content.split('\n').filter(line => line.trim());
     
     return lines.map(line => {
       const parts = line.split(' ');
       return {
         username: parts[0],
         position: parts[1],
         firstName: parts[2],
         lastName: parts[3],
         password: parts[4] // Will be hashed
       };
     });
   }
   ```

2. **Data Cleaning**
   - Remove duplicate records
   - Validate data formats
   - Handle missing fields
   - Normalize phone numbers

3. **Data Transformation**
   - Convert space-delimited to structured objects
   - Parse dates from strings
   - Convert prices to decimal format
   - Split customer/rental data

### Phase 2: Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE pos_system;
   ```

2. **Run Migrations**
   - Use Sequelize migrations or raw SQL
   - Create all tables with constraints
   - Set up indexes

3. **Seed Initial Data**
   - Insert default admin user
   - Insert system configuration
   - Insert default categories

### Phase 3: Data Migration

1. **Employee Migration**
   ```javascript
   async function migrateEmployees() {
     const employees = parseEmployeeDatabase('employeeDatabase.txt');
     
     for (const emp of employees) {
       const hashedPassword = await bcrypt.hash(emp.password, 10);
       await Employee.create({
         username: emp.username,
         password_hash: hashedPassword,
         first_name: emp.firstName,
         last_name: emp.lastName,
         position: emp.position,
         is_active: true
       });
     }
   }
   ```

2. **Item Migration**
   ```javascript
   async function migrateItems() {
     const items = parseItemDatabase('itemDatabase.txt');
     
     for (const item of items) {
       await Item.create({
         item_code: item.itemID.toString(),
         name: item.itemName,
         price: parseFloat(item.price),
         quantity: parseInt(item.amount),
         category: null // Can be categorized later
       });
     }
   }
   ```

3. **Customer & Rental Migration**
   ```javascript
   async function migrateCustomersAndRentals() {
     const userData = parseUserDatabase('userDatabase.txt');
     
     for (const user of userData) {
       // Create or find customer
       const customer = await Customer.findOrCreate({
         where: { phone_number: user.phone },
         defaults: {
           phone_number: user.phone
         }
       });
       
       // Create rental records
       for (const rental of user.rentals) {
         await Rental.create({
           customer_id: customer.id,
           item_id: rental.itemID,
           rental_date: parseDate(rental.date),
           due_date: calculateDueDate(rental.date),
           is_returned: rental.returned === 'true',
           return_date: rental.returned === 'true' ? parseDate(rental.date) : null
         });
       }
     }
   }
   ```

4. **Coupon Migration**
   ```javascript
   async function migrateCoupons() {
     const coupons = parseCouponDatabase('couponNumber.txt');
     
     for (const code of coupons) {
       await Coupon.create({
         code: code.trim(),
         discount_percentage: 10.0, // Default 10% discount
         is_active: true
       });
     }
   }
   ```

### Phase 4: Validation

1. **Data Integrity Checks**
   - Verify all records migrated
   - Check foreign key relationships
   - Validate data types
   - Check constraints

2. **Reconciliation**
   - Compare record counts
   - Verify totals match
   - Check for data loss
   - Validate relationships

### Phase 5: Rollback Plan

1. **Backup Original Files**
   - Keep original .txt files
   - Create database backup before migration
   - Document migration process

2. **Rollback Procedure**
   - Restore database from backup
   - Revert to original system if needed
   - Document issues encountered

---

## Technology Stack Selection

### Frontend: React + TypeScript

**Justification:**
- **Component-Based Architecture**: Enables reusable UI components
- **Type Safety**: TypeScript catches errors at compile time
- **Large Ecosystem**: Extensive library support (React Router, Redux, Material-UI)
- **Performance**: Virtual DOM for efficient rendering
- **Developer Experience**: Excellent tooling (Vite, ESLint, Prettier)
- **Industry Standard**: Widely adopted, good job market
- **Hot Reload**: Fast development iteration

**Key Libraries:**
- React 18+ for UI components
- TypeScript for type safety
- React Router for navigation
- Redux Toolkit for state management
- Axios for HTTP requests
- Material-UI or Tailwind CSS for styling
- React Hook Form for form handling

### Backend: Node.js + Express + TypeScript

**Justification:**
- **JavaScript Ecosystem**: Same language for frontend and backend
- **Performance**: Non-blocking I/O for high concurrency
- **Rapid Development**: Fast prototyping and iteration
- **Rich Ecosystem**: NPM packages for common tasks
- **Scalability**: Handles many concurrent connections
- **TypeScript Support**: Type safety on backend
- **RESTful API**: Standard HTTP-based API design
- **Middleware Architecture**: Flexible request/response handling

**Key Libraries:**
- Express.js for web framework
- TypeScript for type safety
- Sequelize or TypeORM for ORM
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- Joi or express-validator for validation
- Winston for logging
- Helmet for security
- CORS for cross-origin requests

### Database: PostgreSQL

**Justification:**
- **ACID Compliance**: Critical for financial transactions
- **Relational Model**: Well-suited for POS data relationships
- **Performance**: Excellent query optimization
- **Scalability**: Handles large datasets efficiently
- **Features**: Advanced features (JSON support, full-text search)
- **Open Source**: No licensing costs
- **Mature**: Proven in production environments
- **Data Integrity**: Strong constraints and validation

**Key Features Used:**
- Foreign keys for referential integrity
- CHECK constraints for data validation
- Indexes for query performance
- Transactions for ACID properties
- Triggers for automated actions
- JSONB for flexible data storage

### Additional Technologies

**Development Tools:**
- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **Supertest**: API testing

**DevOps:**
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Git**: Version control
- **CI/CD**: GitHub Actions or GitLab CI

**Monitoring:**
- **Winston**: Logging
- **Morgan**: HTTP request logging
- **PM2**: Process management

---

## Component Mapping

### Legacy to Reengineered Mapping

| Legacy Component | Reengineered Component | Technology | Improvements |
|-----------------|------------------------|------------|--------------|
| `POSSystem.java` | `auth.controller.ts`<br>`auth.service.ts` | Express + TypeScript | RESTful API, JWT auth, separation of concerns |
| `Employee.java` | `Employee.ts` (Model)<br>`employee.repository.ts` | Sequelize/TypeORM | ORM, type safety, validation |
| `EmployeeManagement.java` | `employee.controller.ts`<br>`employee.service.ts` | Express + TypeScript | Service layer, repository pattern |
| `PointOfSale.java` (Abstract) | `transaction.service.ts`<br>`pricing.service.ts` | Express + TypeScript | Strategy pattern, service separation |
| `POS.java` | `transaction.service.ts`<br>`SalesPage.tsx` | Express + React | Database transactions, real-time UI |
| `POR.java` | `rental.service.ts`<br>`RentalsPage.tsx` | Express + React | Normalized data, proper relationships |
| `POH.java` | `rental.service.ts`<br>`ReturnsPage.tsx` | Express + React | Automated late fee calculation |
| `Inventory.java` (Singleton) | `item.repository.ts`<br>`item.service.ts` | Express + TypeScript | Repository pattern, no singleton |
| `Item.java` | `Item.ts` (Model)<br>`ItemList.tsx` | Sequelize + React | Database-backed, real-time updates |
| `Management.java` | `customer.service.ts`<br>`rental.service.ts` | Express + TypeScript | Separated concerns, proper services |
| `ReturnItem.java` | `Rental.ts` (Model) | Sequelize | Proper entity with relationships |
| `Login_Interface.java` | `LoginPage.tsx`<br>`LoginForm.tsx` | React | Modern UI, better UX |
| `Cashier_Interface.java` | `DashboardPage.tsx`<br>`Transaction components` | React | Component-based, responsive |
| `Admin_Interface.java` | `EmployeeManagementPage.tsx`<br>`AdminDashboard.tsx` | React | Modern admin interface |
| File I/O (scattered) | Repository pattern | Sequelize/TypeORM | Database abstraction, no direct file I/O |
| Plain text files | PostgreSQL database | PostgreSQL | ACID transactions, relationships, integrity |

### Functional Mapping

| Legacy Functionality | Reengineered Implementation |
|---------------------|----------------------------|
| File-based authentication | JWT-based stateless authentication |
| Plain text passwords | bcrypt hashed passwords |
| File I/O for data | Database queries via ORM |
| Temporary file state | Database transactions with session |
| Space-delimited data | Normalized relational database |
| Manual transaction management | Database ACID transactions |
| Single-user system | Multi-user concurrent system |
| Desktop application | Web-based application |
| Swing GUI | React web interface |
| No API | RESTful API |
| Limited error handling | Comprehensive error handling |
| No validation | Multi-layer validation |
| No logging | Structured logging |
| No testing | Unit and integration tests |

---

## Architecture Improvements

### 1. Separation of Concerns

**Legacy:** Business logic mixed with file I/O and UI

**Reengineered:**
- **Presentation Layer**: React components (UI only)
- **API Layer**: Express controllers (request/response handling)
- **Business Logic Layer**: Services (business rules)
- **Data Access Layer**: Repositories (database operations)

**Benefit:** Each layer has single responsibility, easier to test and maintain

### 2. Database Abstraction

**Legacy:** Direct file I/O scattered throughout codebase

**Reengineered:**
- Repository pattern abstracts database operations
- ORM handles SQL generation
- Easy to switch databases if needed

**Benefit:** No direct file manipulation, consistent data access

### 3. Stateless Architecture

**Legacy:** File-based state management

**Reengineered:**
- JWT tokens for authentication
- Database for state persistence
- No server-side sessions

**Benefit:** Horizontally scalable, works with load balancers

### 4. API-First Design

**Legacy:** Direct method calls from GUI

**Reengineered:**
- RESTful API endpoints
- JSON data exchange
- API documentation (Swagger/OpenAPI)

**Benefit:** Frontend and backend can be developed independently

### 5. Type Safety

**Legacy:** Java with minimal type checking

**Reengineered:**
- TypeScript on both frontend and backend
- Compile-time type checking
- Interface definitions

**Benefit:** Catch errors early, better IDE support

### 6. Error Handling

**Legacy:** Basic try-catch, console output

**Reengineered:**
- Centralized error handling middleware
- Structured error responses
- Logging with Winston
- Error tracking

**Benefit:** Better debugging, user-friendly error messages

### 7. Validation

**Legacy:** Minimal validation, scattered checks

**Reengineered:**
- Frontend validation (React Hook Form)
- Backend validation (Joi/express-validator)
- Database constraints
- Multi-layer validation

**Benefit:** Data integrity, security, better UX

### 8. Testing

**Legacy:** Limited or no tests

**Reengineered:**
- Unit tests (Jest)
- Integration tests (Supertest)
- Frontend tests (React Testing Library)
- Test coverage reporting

**Benefit:** Confidence in changes, regression prevention

### 9. Security

**Legacy:** Plain text passwords, no encryption

**Reengineered:**
- Password hashing (bcrypt)
- JWT tokens
- HTTPS support
- Input sanitization
- SQL injection prevention (ORM)
- CORS configuration
- Helmet security headers

**Benefit:** Production-ready security

### 10. Scalability

**Legacy:** Single-user, file-based

**Reengineered:**
- Database-backed (handles concurrent users)
- Stateless API (horizontal scaling)
- Connection pooling
- Caching strategies
- Load balancing ready

**Benefit:** Can handle growth, multiple users

### 11. Maintainability

**Legacy:** Tightly coupled, difficult to change

**Reengineered:**
- Modular structure
- Dependency injection
- Clear interfaces
- Documentation
- Code organization

**Benefit:** Easier to understand, modify, and extend

### 12. Developer Experience

**Legacy:** Manual compilation, limited tooling

**Reengineered:**
- Hot reload (Vite)
- TypeScript IntelliSense
- ESLint/Prettier
- Modern tooling
- Clear project structure

**Benefit:** Faster development, fewer errors

---

## Summary

The reengineered system transforms the legacy desktop application into a modern, scalable web application with:

- **Modern Technology Stack**: Node.js, Express, React, PostgreSQL
- **Layered Architecture**: Clear separation of concerns
- **Database-Backed**: ACID transactions, data integrity
- **RESTful API**: Stateless, scalable design
- **Type Safety**: TypeScript throughout
- **Security**: Industry-standard practices
- **Maintainability**: Modular, testable, documented
- **Scalability**: Multi-user, concurrent, horizontally scalable

This architecture provides a solid foundation for future enhancements and growth.

