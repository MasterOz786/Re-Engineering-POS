# A. Legacy System Documentation (Reverse Engineered)

## Table of Contents
1. [System Overview](#system-overview)
2. [Module Inventory](#module-inventory)
3. [Architecture Diagrams](#architecture-diagrams)
4. [Class Diagrams](#class-diagrams)
5. [Code Smells](#code-smells)
6. [Data Smells](#data-smells)
7. [Current Limitations](#current-limitations)

---

## System Overview

The legacy POS system is a desktop-based Java application developed using Swing for the user interface. The system manages three types of transactions: Sales, Rentals, and Returns. It uses plain text files for data persistence, which creates significant scalability and maintainability challenges.

### Core Functionality
- **Employee Management**: Authentication and authorization (Admin/Cashier roles)
- **Inventory Management**: Product catalog with pricing and quantities
- **Sales Processing**: Point-of-sale transactions with tax calculation
- **Rental Management**: Item rental tracking with due dates
- **Return Processing**: Handle item returns with late fee calculation
- **Coupon System**: Discount code validation

### System Entry Point
- `Register.java` - Main class that launches the login interface

---

## Module Inventory

### 1. Authentication & Authorization Module

**Classes:**
- `POSSystem.java` - Main authentication controller
- `Employee.java` - Employee entity
- `EmployeeManagement.java` - Employee CRUD operations
- `Login_Interface.java` - Login GUI

**Responsibilities:**
- User authentication (username/password)
- Role-based access control (Admin/Cashier)
- Employee login/logout logging

**Data Files:**
- `employeeDatabase.txt` - Employee records
- `employeeLogfile.txt` - Login/logout audit trail

### 2. Transaction Processing Module

**Classes:**
- `PointOfSale.java` - Abstract base class for transactions
- `POS.java` - Sale transaction implementation
- `POR.java` - Rental transaction implementation
- `POH.java` - Return transaction implementation
- `Transaction_Interface.java` - Transaction GUI
- `Payment_Interface.java` - Payment processing GUI

**Responsibilities:**
- Transaction creation and management
- Item addition/removal from cart
- Total calculation with tax
- Coupon validation
- Transaction completion

**Data Files:**
- `temp.txt` - Temporary transaction state
- `saleInvoiceRecord.txt` - Sale transaction history
- `returnSale.txt` - Return transaction history

### 3. Inventory Management Module

**Classes:**
- `Inventory.java` - Singleton inventory manager
- `Item.java` - Item entity
- `EnterItem_Interface.java` - Item entry GUI

**Responsibilities:**
- Inventory access and updates
- Item quantity management
- Price tracking

**Data Files:**
- `itemDatabase.txt` - Product inventory
- `rentalDatabase.txt` - Rental items catalog

### 4. Customer & Rental Management Module

**Classes:**
- `Management.java` - Customer and rental operations
- `ReturnItem.java` - Return item entity

**Responsibilities:**
- Customer creation and lookup
- Rental record management
- Return date tracking
- Late fee calculation

**Data Files:**
- `userDatabase.txt` - Customer database with rental history

### 5. Employee Administration Module

**Classes:**
- `Admin_Interface.java` - Admin dashboard
- `AddEmployee_Interface.java` - Add employee form
- `UpdateEmployee_Interface.java` - Update employee form
- `EmployeeManagement.java` - Employee operations

**Responsibilities:**
- Employee CRUD operations
- Employee role management

### 6. Cashier Interface Module

**Classes:**
- `Cashier_Interface.java` - Cashier dashboard

**Responsibilities:**
- Transaction type selection (Sale/Rental/Return)
- Transaction processing interface

---

## Architecture Diagrams

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Login_Intf   │  │ Cashier_Intf │  │ Admin_Intf   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Transaction  │  │ Payment_Intf │  │ AddEmployee  │      │
│  │   Interface  │  │              │  │   Interface  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ POSSystem    │  │ EmployeeMgmt│  │ Management   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PointOfSale (Abstract)                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │   POS    │  │   POR    │  │   POH    │          │   │
│  │  │  (Sale)  │  │ (Rental) │  │ (Return) │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────┐                                           │
│  │ Inventory    │  (Singleton Pattern)                      │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                         │
│              File I/O Operations (No Abstraction)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ FileReader   │  │ FileWriter   │  │ BufferedReader│      │
│  │ BufferedReader│ │ BufferedWriter│ │ PrintWriter   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                        │
│              Plain Text Files (.txt)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ employeeDB  │  │ itemDatabase │  │ userDatabase │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ rentalDB     │  │ couponNumber │  │ temp.txt     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Transaction Flow Architecture

```
User Login
    │
    ├─→ POSSystem.logIn()
    │       │
    │       ├─→ Read employeeDatabase.txt
    │       ├─→ Validate credentials
    │       └─→ Route to Cashier/Admin Interface
    │
    ├─→ Cashier Interface
    │       │
    │       ├─→ Select Transaction Type
    │       │       │
    │       │       ├─→ Sale: Create POS instance
    │       │       ├─→ Rental: Create POR instance
    │       │       └─→ Return: Create POH instance
    │       │
    │       └─→ Process Transaction
    │               │
    │               ├─→ Add Items to Cart
    │               ├─→ Calculate Total
    │               ├─→ Apply Coupon (optional)
    │               ├─→ Process Payment
    │               ├─→ Update Inventory
    │               └─→ Save Transaction Record
    │
    └─→ Admin Interface
            │
            └─→ Employee Management
                    │
                    ├─→ Add Employee
                    ├─→ Update Employee
                    └─→ Delete Employee
```

---

## Class Diagrams

### Core Class Relationships

```
┌─────────────────┐
│   POSSystem     │
├─────────────────┤
│ +logIn()        │
│ +logOut()       │
│ +checkTemp()    │
│ +continueFromTemp()│
└────────┬────────┘
         │ uses
         │
         ▼
┌─────────────────┐
│    Employee      │
├─────────────────┤
│ -username        │
│ -name            │
│ -position        │
│ -password        │
└─────────────────┘

┌─────────────────┐
│ EmployeeMgmt    │
├─────────────────┤
│ +add()           │
│ +delete()        │
│ +update()       │
│ +getEmployeeList()│
└────────┬────────┘
         │ manages
         │
         ▼
┌─────────────────┐
│    Employee      │
└─────────────────┘

┌─────────────────┐
│  PointOfSale     │◄─────── Abstract Class
├─────────────────┤
│ #totalPrice      │
│ #tax             │
│ #databaseItem    │
│ #transactionItem │
│ +enterItem()     │
│ +updateTotal()   │
│ +coupon()        │
│ +removeItems()   │
│ #endPOS()        │◄─────── Abstract
│ #deleteTempItem()│◄─────── Abstract
│ #retrieveTemp()  │◄─────── Abstract
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     POS     │    │     POR     │    │     POH     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ +endPOS()   │    │ +endPOS()   │    │ +endPOS()   │
│ +deleteTemp │    │ +deleteTemp │    │ +deleteTemp │
│ +retrieveTemp│   │ +retrieveTemp│   │ +retrieveTemp│
└─────────────┘    └─────────────┘    └─────────────┘

┌─────────────────┐
│   Inventory     │◄─────── Singleton
├─────────────────┤
│ -uniqueInstance │
│ +getInstance()  │
│ +accessInventory()│
│ +updateInventory()│
└────────┬────────┘
         │ uses
         │
         ▼
┌─────────────────┐
│      Item       │
├─────────────────┤
│ -itemID         │
│ -itemName       │
│ -price          │
│ -amount         │
└─────────────────┘

┌─────────────────┐
│   Management    │
├─────────────────┤
│ +checkUser()    │
│ +createUser()   │
│ +addRental()    │
│ +updateRentalStatus()│
│ +getLatestReturnDate()│
└────────┬────────┘
         │ uses
         │
         ▼
┌─────────────────┐
│   ReturnItem    │
├─────────────────┤
│ -itemID         │
│ -daysSinceReturn│
└─────────────────┘
```

### Design Patterns Used

1. **Singleton Pattern** - `Inventory.java`
   - Ensures only one instance of inventory manager exists
   - Provides global access point

2. **Abstract Factory/Template Method** - `PointOfSale.java`
   - Abstract base class defines transaction workflow
   - Concrete implementations (POS, POR, POH) provide specific behavior

---

## Code Smells

### 1. God Class
**Location:** `POSSystem.java`, `Management.java`

**Issue:** Classes with too many responsibilities
- `POSSystem` handles authentication, file I/O, routing, and logging
- `Management` handles customer management, rental operations, and file I/O

**Impact:** High coupling, difficult to test, violates Single Responsibility Principle

### 2. Long Method
**Location:** `Management.addRental()` (lines 200-277), `Management.updateRentalStatus()` (lines 280-382)

**Issue:** Methods exceed 50 lines, perform multiple operations
- Complex file reading, parsing, modification, and writing in single method
- Difficult to understand and maintain

**Impact:** Low readability, high complexity, difficult to debug

### 3. Magic Numbers
**Location:** Throughout codebase
- Tax rate: `1.06` (hardcoded in `PointOfSale.java`)
- Discount: `0.90` (hardcoded in `PointOfSale.java`)
- Late fee rate: `0.1` (hardcoded in `POH.java`)
- Credit card length: `16` (hardcoded in `PointOfSale.java`)

**Impact:** Difficult to maintain, no configuration flexibility

### 4. Duplicate Code
**Location:** File I/O operations across multiple classes

**Issue:** Same file reading/writing pattern repeated:
- `POSSystem.readFile()`, `EmployeeManagement.readFile()`, `Management.checkUser()`
- All use similar BufferedReader/FileReader patterns

**Impact:** Code duplication, maintenance burden

### 5. Primitive Obsession
**Location:** Throughout codebase
- Phone numbers stored as `long` instead of `PhoneNumber` value object
- Dates stored as `String` instead of proper date objects
- Money stored as `double`/`float` instead of `Money` value object

**Impact:** No type safety, potential for errors

### 6. Feature Envy
**Location:** Multiple classes directly accessing file system

**Issue:** Business logic classes directly manipulate files
- `POSSystem`, `Management`, `EmployeeManagement` all have file I/O code
- No abstraction layer

**Impact:** Tight coupling to file system, difficult to change storage mechanism

### 7. Data Clumps
**Location:** File path strings repeated across classes
- `"Database/employeeDatabase.txt"` appears in multiple places
- `"Database/temp.txt"` repeated in multiple classes

**Impact:** Difficult to change file locations, potential for inconsistencies

### 8. Commented-Out Code
**Location:** Multiple files contain commented-out Windows path handling code

**Issue:** Dead code that should be removed or properly handled

**Impact:** Code clutter, confusion

### 9. Inappropriate Intimacy
**Location:** Classes directly accessing each other's internal data structures

**Issue:** `Management.addRental()` directly manipulates file contents
- No encapsulation of data access

**Impact:** High coupling, difficult to refactor

### 10. Large Class
**Location:** `PointOfSale.java` (243 lines)

**Issue:** Abstract class with many responsibilities
- Handles item management, total calculation, coupon validation, temp file operations

**Impact:** Violates Single Responsibility Principle

---

## Data Smells

### 1. Denormalized Data Structure
**Location:** `userDatabase.txt`

**Issue:** Customer and rental data stored in single denormalized format:
```
phoneNumber itemID1,date1,returned1 itemID2,date2,returned2 ...
```

**Problems:**
- Difficult to query specific rentals
- No referential integrity
- Data redundancy (same item rented multiple times stored as separate entries)
- Difficult to update individual rental records

**Impact:** Poor data integrity, inefficient queries, maintenance issues

### 2. No Data Validation
**Location:** All data files

**Issue:** No constraints or validation on data:
- No unique constraints (duplicate employees possible)
- No foreign key relationships
- No data type validation
- No range checks (negative prices, quantities)

**Impact:** Data corruption risk, inconsistent state

### 3. Inconsistent Data Formats
**Location:** Different files use different delimiters

**Issue:**
- `employeeDatabase.txt`: Space-delimited
- `itemDatabase.txt`: Space-delimited
- `userDatabase.txt`: Space and comma-delimited (mixed)
- `couponNumber.txt`: Line-delimited (one per line)

**Impact:** Difficult to parse, error-prone

### 4. No Transaction Management
**Location:** File updates

**Issue:** File operations are not atomic:
- If system crashes during file write, data can be corrupted
- No rollback capability
- No concurrent access protection

**Impact:** Data loss risk, race conditions

### 5. Plain Text Passwords
**Location:** `employeeDatabase.txt`

**Issue:** Passwords stored in plain text
- Format: `username position firstName lastName password`

**Impact:** Critical security vulnerability

### 6. No Audit Trail
**Location:** Limited logging

**Issue:** 
- Only login/logout events logged
- No transaction audit trail
- No data modification tracking

**Impact:** Cannot track changes, difficult to debug issues

### 7. Temporary File Usage
**Location:** `temp.txt`

**Issue:** Uses temporary files to store transaction state
- If system crashes, transaction state is lost
- No recovery mechanism

**Impact:** Data loss, poor user experience

### 8. No Data Relationships
**Location:** All data files

**Issue:** No explicit relationships between entities:
- Items referenced by ID in transactions, but no foreign key
- Employees referenced by username, but no validation
- Customers referenced by phone, but no customer table

**Impact:** Orphaned records, referential integrity issues

---

## Current Limitations

### Functional Limitations

1. **Single-User System**
   - Cannot handle concurrent users
   - File-based locking not implemented
   - Race conditions possible

2. **Limited Search Capabilities**
   - No search functionality for items, customers, or transactions
   - Must know exact identifiers to find records

3. **No Reporting**
   - Cannot generate sales reports
   - No analytics or business intelligence
   - No inventory reports

4. **No Backup/Recovery**
   - No automated backup system
   - Manual file copying required
   - No point-in-time recovery

5. **Limited Payment Methods**
   - Only credit card validation (no actual processing)
   - No cash, debit, or other payment methods

6. **No Multi-Location Support**
   - Single inventory database
   - Cannot manage multiple store locations

### Technical Limitations

1. **Scalability**
   - File-based storage doesn't scale
   - Performance degrades with large datasets
   - No indexing or query optimization

2. **Concurrency**
   - No transaction isolation
   - File locking not implemented
   - Concurrent access causes data corruption

3. **Error Handling**
   - Basic exception handling
   - No retry mechanisms
   - Limited error recovery

4. **Security**
   - Plain text passwords
   - No encryption
   - No access control beyond login

5. **Maintainability**
   - Tightly coupled code
   - No dependency injection
   - Difficult to test

6. **Deployment**
   - Desktop application requires installation
   - Not accessible remotely
   - Platform-specific (Java Swing)

7. **Data Integrity**
   - No ACID properties
   - No referential integrity
   - No data validation

8. **Performance**
   - Full file reads for every operation
   - No caching
   - Inefficient data structures

### Business Limitations

1. **No Customer Management**
   - Limited customer information (only phone number)
   - No customer history or preferences
   - No loyalty programs

2. **Limited Inventory Features**
   - No low stock alerts
   - No reorder points
   - No supplier management

3. **No Financial Integration**
   - No accounting system integration
   - No tax reporting
   - No financial reconciliation

4. **No E-commerce**
   - Desktop-only application
   - No online ordering
   - No customer self-service

5. **Limited Customization**
   - Hardcoded business rules
   - No configuration options
   - Difficult to adapt to business changes

---

## Summary

The legacy system demonstrates typical characteristics of a system developed without modern software engineering practices:

- **Monolithic architecture** with tight coupling
- **File-based data storage** with no database abstraction
- **No separation of concerns** between layers
- **Limited error handling** and recovery mechanisms
- **Security vulnerabilities** (plain text passwords)
- **Poor scalability** and performance
- **Difficult maintenance** due to code smells

These limitations justify the need for comprehensive reengineering to transform the system into a modern, maintainable, and scalable web-based application.

