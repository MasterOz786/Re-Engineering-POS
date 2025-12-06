# Postman API Documentation

This document provides instructions for using the Postman collection to test the POS System API.

## Importing the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select the file: `POS_System.postman_collection.json`
4. The collection will be imported with all endpoints organized in folders

## Environment Variables

The collection uses the following environment variables:

- `base_url`: Base URL for the API (default: `http://localhost:3000`)
- `auth_token`: JWT token (automatically set after login)
- `user_id`: Current user ID (automatically set after login)

### Setting Up Environment Variables

1. In Postman, click on **Environments** (left sidebar)
2. Create a new environment or use the default
3. Add the variables:
   - `base_url` = `http://localhost:3000`
   - `auth_token` = (leave empty, will be set automatically)
   - `user_id` = (leave empty, will be set automatically)
4. Select the environment from the dropdown (top right)

## API Endpoints

### 1. Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2025-12-06T23:43:58.294Z"
}
```

---

### 2. Authentication

#### Login

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
    "username": "admin",
    "password": "admin123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "username": "admin",
        "first_name": "Admin",
        "last_name": "User",
        "position": "Admin"
    }
}
```

**Note:** The token is automatically saved to the `auth_token` variable after successful login.

#### Validate Token

**POST** `/api/auth/validate`

Validate JWT token and get user information.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Response:**
```json
{
    "valid": true,
    "user": {
        "id": 1,
        "username": "admin",
        "position": "Admin"
    }
}
```

---

### 3. Items

All item endpoints require authentication. Admin-only endpoints require Admin role.

#### Get All Items

**GET** `/api/items`

Get all items from inventory.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Response:**
```json
[
    {
        "id": 1,
        "item_code": "ITEM001",
        "name": "Laptop",
        "price": "999.99",
        "quantity": 10,
        "category": "Electronics",
        "created_at": "2025-12-06T10:00:00.000Z",
        "updated_at": "2025-12-06T10:00:00.000Z"
    }
]
```

#### Get Item by ID

**GET** `/api/items/:id`

Get a specific item by ID.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Response:**
```json
{
    "id": 1,
    "item_code": "ITEM001",
    "name": "Laptop",
    "price": "999.99",
    "quantity": 10,
    "category": "Electronics",
    "created_at": "2025-12-06T10:00:00.000Z",
    "updated_at": "2025-12-06T10:00:00.000Z"
}
```

#### Create Item (Admin Only)

**POST** `/api/items`

Create a new item.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Request Body:**
```json
{
    "item_code": "ITEM003",
    "name": "Keyboard",
    "price": 49.99,
    "quantity": 30,
    "category": "Electronics"
}
```

**Response:**
```json
{
    "id": 3,
    "item_code": "ITEM003",
    "name": "Keyboard",
    "price": "49.99",
    "quantity": 30,
    "category": "Electronics",
    "created_at": "2025-12-06T10:00:00.000Z",
    "updated_at": "2025-12-06T10:00:00.000Z"
}
```

#### Update Item (Admin Only)

**PUT** `/api/items/:id`

Update an existing item.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Request Body:**
```json
{
    "name": "Gaming Keyboard",
    "price": 59.99,
    "quantity": 25,
    "category": "Electronics"
}
```

**Response:**
```json
{
    "id": 3,
    "item_code": "ITEM003",
    "name": "Gaming Keyboard",
    "price": "59.99",
    "quantity": 25,
    "category": "Electronics",
    "created_at": "2025-12-06T10:00:00.000Z",
    "updated_at": "2025-12-06T10:05:00.000Z"
}
```

---

### 4. Transactions

All transaction endpoints require authentication.

#### Create Sale

**POST** `/api/transactions/sale`

Create a new sale transaction.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Request Body:**
```json
{
    "items": [
        {
            "itemId": 1,
            "quantity": 2,
            "unitPrice": 999.99
        },
        {
            "itemId": 2,
            "quantity": 1,
            "unitPrice": 29.99
        }
    ],
    "customerId": 1,
    "couponCode": "SAVE10"
}
```

**Response:**
```json
{
    "id": 1,
    "transaction_type": "Sale",
    "employee_id": 1,
    "customer_id": 1,
    "total_amount": "2029.97",
    "tax_amount": "162.40",
    "discount_amount": "202.99",
    "coupon_code": "SAVE10",
    "status": "Completed",
    "created_at": "2025-12-06T10:00:00.000Z",
    "items": [
        {
            "id": 1,
            "transaction_id": 1,
            "item_id": 1,
            "quantity": 2,
            "unit_price": "999.99",
            "subtotal": "1999.98"
        }
    ]
}
```

#### Create Rental

**POST** `/api/transactions/rental`

Create a new rental transaction.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Request Body:**
```json
{
    "customerId": 1,
    "itemId": 1,
    "quantity": 1,
    "rentalDate": "2025-12-06",
    "dueDate": "2025-12-13"
}
```

**Response:**
```json
{
    "id": 1,
    "transaction_id": 1,
    "customer_id": 1,
    "item_id": 1,
    "rental_date": "2025-12-06",
    "due_date": "2025-12-13",
    "return_date": null,
    "is_returned": false,
    "late_fee": "0.00",
    "quantity": 1,
    "created_at": "2025-12-06T10:00:00.000Z"
}
```

#### Process Return

**POST** `/api/transactions/return`

Process a rental return.

**Headers:**
- `Authorization: Bearer {{auth_token}}`

**Request Body:**
```json
{
    "rentalId": 1,
    "returnDate": "2025-12-10"
}
```

**Response:**
```json
{
    "id": 1,
    "transaction_id": 1,
    "customer_id": 1,
    "item_id": 1,
    "rental_date": "2025-12-06",
    "due_date": "2025-12-13",
    "return_date": "2025-12-10",
    "is_returned": true,
    "late_fee": "0.00",
    "quantity": 1,
    "created_at": "2025-12-06T10:00:00.000Z"
}
```

## Testing Workflow

1. **Start the server:**
   ```bash
   cd reengineered-system/backend
   npm run dev
   ```

2. **Check Health:**
   - Run the "Health Check" request to verify server is running

3. **Login:**
   - Run the "Login" request with valid credentials
   - The token will be automatically saved to `auth_token` variable

4. **Test Protected Endpoints:**
   - All other endpoints will automatically use the saved token
   - Try getting items, creating transactions, etc.

## Error Responses

All endpoints return consistent error responses:

**401 Unauthorized:**
```json
{
    "error": "Invalid credentials"
}
```

**400 Bad Request:**
```json
{
    "error": "Validation error message"
}
```

**404 Not Found:**
```json
{
    "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
    "error": "Internal server error message"
}
```

## Notes

- All dates should be in ISO format: `YYYY-MM-DD`
- Prices are stored as decimals with 2 decimal places
- The JWT token expires after a set time (check your server configuration)
- Admin-only endpoints require the user to have `position: "Admin"` in the database

