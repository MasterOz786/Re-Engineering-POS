# Software Reengineering Report
## Legacy POS System to Modern Web-Based Application

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Phase 1: Inventory Analysis](#phase-1-inventory-analysis)
3. [Phase 2: Document Restructuring](#phase-2-document-restructuring)
4. [Phase 3: Reverse Engineering](#phase-3-reverse-engineering)
5. [Phase 4: Code Restructuring](#phase-4-code-restructuring)
6. [Phase 5: Data Restructuring](#phase-5-data-restructuring)
7. [Phase 6: Forward Engineering](#phase-6-forward-engineering)
8. [Architecture Comparison](#architecture-comparison)
9. [Technology Justification](#technology-justification)

---

## Project Overview

This document outlines the complete software reengineering process applied to transform a legacy Java-based desktop Point-of-Sale (POS) system into a modern, web-based application. The original system used plain text files for data persistence and a Swing-based GUI. The reengineered system implements a modern three-tier architecture with a relational database, RESTful API, and responsive web interface.

---

## Phase 1: Inventory Analysis

### 1.1 Code Assets Identified

#### Core Business Logic Classes
- **POSSystem.java** - Main entry point, handles authentication and routing
- **Employee.java** - Employee entity (username, name, position, password)
- **EmployeeManagement.java** - CRUD operations for employees
- **Item.java** - Product/item entity (ID, name, price, quantity)
- **Inventory.java** - Singleton pattern for inventory management
- **PointOfSale.java** - Abstract base class for transaction types
- **POS.java** - Sale transaction implementation
- **POR.java** - Rental transaction implementation
- **POH.java** - Return transaction implementation
- **Management.java** - Customer/rental management
- **ReturnItem.java** - Return item entity
- **Register.java** - Application entry point

#### GUI Interface Classes
- **Login_Interface.java** - Login screen
- **Cashier_Interface.java** - Cashier dashboard
- **Admin_Interface.java** - Admin dashboard
- **AddEmployee_Interface.java** - Add employee form
- **UpdateEmployee_Interface.java** - Update employee form
- **EnterItem_Interface.java** - Item entry interface
- **Transaction_Interface.java** - Transaction processing
- **Payment_Interface.java** - Payment processing

#### Data Files
- `employeeDatabase.txt` - Employee records (space-delimited)
- `itemDatabase.txt` - Product inventory (space-delimited)
- `rentalDatabase.txt` - Rental items database
- `userDatabase.txt` - Customer database
- `couponNumber.txt` - Valid coupon codes
- `employeeLogfile.txt` - Employee login/logout logs
- `saleInvoiceRecord.txt` - Sale transaction history
- `returnSale.txt` - Return transaction history
- `temp.txt` - Temporary transaction state

### 1.2 Asset Classification

| Category | Assets | Status |
|----------|--------|--------|
| **Active** | Core business logic classes, data files | To be reengineered |
| **Obsolete** | Swing GUI classes | To be replaced with web UI |
| **Reusable** | Business logic patterns, data structures | To be refactored and modernized |
| **Dependencies** | Java Standard Library, Swing | To be replaced with Spring Boot, React |

### 1.3 Dependencies Map

```
POSSystem
├── Employee
├── EmployeeManagement
├── Inventory (Singleton)
├── PointOfSale (Abstract)
│   ├── POS (Sale)
│   ├── POR (Rental)
│   └── POH (Return)
├── Management
├── Item
└── ReturnItem
```

### 1.4 Design Patterns Identified
- **Singleton**: Inventory class
- **Abstract Factory**: PointOfSale abstract class with POS, POR, POH implementations
- **Template Method**: PointOfSale defines transaction flow

---

## Phase 2: Document Restructuring

### 2.1 Legacy System Architecture

```
┌─────────────────────────────────────────┐
│         GUI Layer (Swing)                │
│  Login │ Cashier │ Admin Interfaces     │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│      Business Logic Layer                │
│  POSSystem │ EmployeeManagement          │
│  PointOfSale (Abstract)                  │
│    ├── POS (Sale)                       │
│    ├── POR (Rental)                     │
│    └── POH (Return)                     │
│  Inventory (Singleton) │ Management      │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│      Data Access Layer                   │
│  File I/O Operations                     │
│  (Plain Text Files)                      │
└─────────────────────────────────────────┘
```

### 2.2 Legacy Data Model

**Employee Database Format:**
```
username position firstName lastName password
```

**Item Database Format:**
```
itemID itemName price quantity
```

**User Database Format:**
```
phoneNumber [itemID,returnDate,returned] ...
```

### 2.3 Issues Identified
1. **No separation of concerns** - Business logic mixed with file I/O
2. **No transaction management** - File operations not atomic
3. **No data validation** - Input validation scattered
4. **No error recovery** - Limited exception handling
5. **Tight coupling** - Classes directly depend on file paths
6. **No API layer** - GUI directly calls business logic
7. **No security** - Passwords stored in plain text
8. **No scalability** - File-based storage doesn't scale

---

## Phase 3: Reverse Engineering

### 3.1 Recovered Workflows

#### Authentication Flow
1. User enters username/password
2. POSSystem reads employeeDatabase.txt
3. Validates credentials
4. Logs login to employeeLogfile.txt
5. Routes to Cashier or Admin interface

#### Sale Transaction Flow
1. Cashier selects "Sale"
2. POS instance created
3. Items added to transactionItem list
4. Total calculated with tax (6%)
5. Coupon validation (optional)
6. Payment processed
7. Inventory updated (decrement quantities)
8. Invoice saved to saleInvoiceRecord.txt
9. Transaction cleared

#### Rental Transaction Flow
1. Cashier enters customer phone number
2. Management checks/creates user in userDatabase.txt
3. POR instance created with phone number
4. Items added to transaction
5. Rental records added to userDatabase.txt
6. Inventory updated
7. Transaction completed

#### Return Transaction Flow
1. Cashier enters customer phone number
2. Management retrieves outstanding rentals
3. POH instance created
4. Items selected for return
5. Late fees calculated (10% per day)
6. Inventory updated (increment quantities)
7. Rental status updated in userDatabase.txt
8. Return logged to returnSale.txt

### 3.2 Data Structures Recovered

**Employee Entity:**
- username: String
- name: String
- position: String (Admin/Cashier)
- password: String

**Item Entity:**
- itemID: int
- itemName: String
- price: float
- amount: int (quantity)

**Transaction Item:**
- Extends Item with transaction-specific quantity

**Return Item:**
- itemID: int
- daysSinceReturn: int

### 3.3 Code Smells Identicated
1. **God Class**: POSSystem handles too many responsibilities
2. **Long Method**: Management.addRental() is too complex
3. **Magic Numbers**: Tax rate (1.06), discount (0.90) hardcoded
4. **Duplicate Code**: File I/O repeated across classes
5. **Primitive Obsession**: Phone numbers as long, dates as strings
6. **Feature Envy**: Classes accessing file system directly
7. **Data Clumps**: File path strings repeated

---

## Phase 4: Code Restructuring

### 4.1 Refactoring Strategy

#### Extract Repository Pattern
- Create `EmployeeRepository`, `ItemRepository`, `TransactionRepository`
- Encapsulate all file I/O operations
- Provide clean interface for data access

#### Extract Service Layer
- Create `EmployeeService`, `InventoryService`, `TransactionService`
- Move business logic from controllers
- Implement transaction management

#### Extract Value Objects
- Create `PhoneNumber`, `Money`, `DateRange` value objects
- Replace primitive obsession

#### Extract Constants
- Create `ApplicationConstants` class
- Move magic numbers to constants

#### Simplify Complex Methods
- Break down `Management.addRental()` into smaller methods
- Extract validation logic

---

## Phase 5: Data Restructuring

### 5.1 Database Schema Design

#### Normalized Relational Schema

**employees**
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position VARCHAR(20) NOT NULL CHECK (position IN ('Admin', 'Cashier')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

**items**
```sql
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
```

**customers**
```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**transactions**
```sql
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
```

**transaction_items**
```sql
CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**rentals**
```sql
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
```

**employee_logs**
```sql
CREATE TABLE employee_logs (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**coupons**
```sql
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 Data Migration Strategy

1. **Parse Text Files**: Read all .txt database files
2. **Data Cleaning**: Validate and clean data
3. **Transform**: Convert to normalized format
4. **Load**: Insert into PostgreSQL database
5. **Verify**: Validate data integrity

### 5.3 Schema Improvements Justification

1. **Normalization**: Eliminates data redundancy
2. **Referential Integrity**: Foreign keys ensure data consistency
3. **Constraints**: Check constraints prevent invalid data
4. **Indexes**: Improve query performance
5. **Timestamps**: Audit trail for all records
6. **Soft Deletes**: is_active flag for employees
7. **Security**: Password hashing instead of plain text

---

## Phase 6: Forward Engineering

### 6.1 Technology Stack Selection

#### Backend: Java + Spring Boot
**Justification:**
- Original system is Java-based, reducing migration complexity
- Spring Boot provides enterprise-grade features
- Excellent ORM support (JPA/Hibernate)
- Built-in security, validation, and testing frameworks
- Mature ecosystem with extensive documentation

#### Database: PostgreSQL
**Justification:**
- ACID compliance for transaction integrity
- Strong support for complex queries
- Excellent performance and scalability
- Open-source and widely adopted
- Rich feature set (JSON support, full-text search)

#### Frontend: React + TypeScript
**Justification:**
- Component-based architecture for reusability
- Strong ecosystem and community support
- TypeScript provides type safety
- Excellent performance with virtual DOM
- Easy integration with REST APIs

#### Additional Technologies
- **Spring Security**: Authentication and authorization
- **JWT**: Stateless authentication
- **Spring Data JPA**: Database abstraction
- **Maven**: Dependency management
- **Docker**: Containerization for deployment

### 6.2 Reengineered Architecture

```
┌─────────────────────────────────────────┐
│      Presentation Layer (React)          │
│  Components │ Pages │ Services           │
└─────────────────────────────────────────┘
                    │ HTTP/REST
┌─────────────────────────────────────────┐
│      API Layer (Spring Boot)             │
│  REST Controllers │ DTOs │ Validation    │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│      Business Logic Layer                │
│  Services │ Domain Models │ Validators  │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│      Data Access Layer                   │
│  Repositories │ JPA Entities │ Mappers   │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│      Database Layer (PostgreSQL)         │
│  Tables │ Indexes │ Constraints          │
└─────────────────────────────────────────┘
```

### 6.3 Design Patterns Applied

1. **MVC (Model-View-Controller)**: Separation of concerns
2. **Repository Pattern**: Data access abstraction
3. **Service Layer**: Business logic encapsulation
4. **DTO Pattern**: Data transfer objects for API
5. **Factory Pattern**: Transaction type creation
6. **Strategy Pattern**: Different pricing strategies
7. **Observer Pattern**: Event-driven architecture

### 6.4 Key Improvements

1. **Layered Architecture**: Clear separation of concerns
2. **RESTful API**: Stateless, scalable API design
3. **Database Transactions**: ACID compliance
4. **Security**: Password hashing, JWT authentication
5. **Validation**: Input validation at multiple layers
6. **Error Handling**: Comprehensive exception handling
7. **Logging**: Structured logging for debugging
8. **Testing**: Unit and integration tests
9. **Documentation**: API documentation with Swagger
10. **Scalability**: Horizontal scaling capability

---

## Architecture Comparison

### Legacy vs Reengineered

| Aspect | Legacy System | Reengineered System |
|--------|---------------|---------------------|
| **Architecture** | Monolithic desktop app | Three-tier web application |
| **Data Storage** | Plain text files | PostgreSQL database |
| **UI Framework** | Java Swing | React web application |
| **API** | None (direct method calls) | RESTful API |
| **Authentication** | Plain text passwords | JWT with password hashing |
| **Transaction Management** | File-based (no ACID) | Database transactions (ACID) |
| **Scalability** | Single user | Multi-user, concurrent |
| **Deployment** | Desktop installation | Web-based (browser access) |
| **Error Handling** | Basic try-catch | Comprehensive exception handling |
| **Testing** | Limited | Unit + Integration tests |
| **Documentation** | Minimal | Comprehensive (API docs, code comments) |
| **Maintainability** | Low (tightly coupled) | High (loosely coupled, modular) |

---

## Technology Justification

### Programming Language: Java
- **Continuity**: Original system is Java-based
- **Enterprise Ready**: Mature ecosystem for business applications
- **Performance**: JVM optimization for long-running applications
- **Type Safety**: Compile-time error detection
- **Community**: Large developer community and resources

### Framework: Spring Boot
- **Rapid Development**: Auto-configuration reduces boilerplate
- **Dependency Injection**: Loose coupling and testability
- **Security**: Built-in Spring Security framework
- **Data Access**: Spring Data JPA simplifies database operations
- **Testing**: Excellent testing support
- **Production Ready**: Actuator for monitoring and management

### Database: PostgreSQL
- **ACID Compliance**: Critical for financial transactions
- **Performance**: Excellent query optimization
- **Reliability**: Proven in production environments
- **Features**: Advanced features (JSON, full-text search, arrays)
- **Open Source**: No licensing costs
- **Scalability**: Handles large datasets efficiently

### Frontend: React
- **Component Reusability**: Reduces code duplication
- **Performance**: Virtual DOM for efficient updates
- **Ecosystem**: Rich library ecosystem
- **Developer Experience**: Excellent tooling and debugging
- **TypeScript Support**: Type safety for frontend code
- **Industry Standard**: Widely adopted, good job market

---

## Conclusion

The reengineering process successfully transformed a legacy desktop POS system into a modern, scalable web application. The new architecture provides:

- **Improved Maintainability**: Clear separation of concerns, modular design
- **Better Scalability**: Database-backed, multi-user support
- **Enhanced Security**: Password hashing, JWT authentication
- **Modern User Experience**: Responsive web interface
- **Production Ready**: Comprehensive error handling, logging, testing

The reengineered system maintains all original functionality while providing a solid foundation for future enhancements and scalability.

