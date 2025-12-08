# Missing Backend Functionality

## Current Backend Routes

### ✅ Existing Routes:
- `GET /health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/validate` - Validate token
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create item (Admin only)
- `PUT /api/items/:id` - Update item (Admin only)
- `POST /api/transactions/sale` - Create sale
- `POST /api/transactions/rental` - Create rental
- `POST /api/transactions/return` - Process return

## ❌ Missing Functionality

### 1. Employee Management (CRUD)
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/:id` - Update employee (Admin only)
- `DELETE /api/employees/:id` - Delete/deactivate employee (Admin only)

### 2. Customer Management
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/phone/:phone` - Get customer by phone
- `PUT /api/customers/:id` - Update customer
- `POST /api/customers` - Create customer (if needed separately)

### 3. Transaction History
- `GET /api/transactions` - List all transactions (with filters)
- `GET /api/transactions/:id` - Get transaction details
- `GET /api/transactions/sales` - Get all sales
- `GET /api/transactions/rentals` - Get all rentals
- `GET /api/transactions/returns` - Get all returns

### 4. Rental Management
- `GET /api/rentals` - List all rentals
- `GET /api/rentals/:id` - Get rental by ID
- `GET /api/rentals/active` - Get active/outstanding rentals
- `GET /api/rentals/customer/:customerId` - Get rentals by customer
- `GET /api/rentals/outstanding` - Get outstanding rentals

### 5. Coupon Management
- `GET /api/coupons` - List all coupons
- `GET /api/coupons/:id` - Get coupon by ID
- `GET /api/coupons/code/:code` - Get coupon by code
- `POST /api/coupons` - Create coupon (Admin only)
- `PUT /api/coupons/:id` - Update coupon (Admin only)
- `DELETE /api/coupons/:id` - Delete coupon (Admin only)
- `POST /api/coupons/validate` - Validate coupon code

### 6. Item Management
- `DELETE /api/items/:id` - Delete item (Admin only)

### 7. Employee Logs
- `GET /api/employee-logs` - Get employee activity logs
- `GET /api/employee-logs/:employeeId` - Get logs for specific employee

### 8. Dashboard Statistics
- `GET /api/stats` - Get dashboard statistics
  - Total sales
  - Active rentals
  - Inventory items count
  - Recent transactions

