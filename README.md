# 📦 Lab 3: Inventory Management System REST API

A robust, production-ready RESTful API for managing inventory, tracking stock levels, performing real-time stock adjustments, and generating analytical business reports. Built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

---

## 👨‍🎓 Student & Submission Details

| Field | Details |
| :--- | :--- |
| **Student Name** | **Anubhav** |
| **Section** | **F** |
| **Roll Number** | **2501730406** |
| **Course / Assignment** | **Lab 3 - Inventory Management System** |

---

## 🚀 Key Features

- **Full Product Lifecycle (CRUD)**: Create, view, update, and delete inventory products with comprehensive schema validation.
- **Smart Stock Value Virtual Field**: Automatically computes total inventory monetary value (`stockValue = price * quantity`) without storing redundant data in MongoDB.
- **Advanced Querying & Pagination**: Filter products by category, sort dynamically by price (ascending/descending), and paginate results with page & limit parameters.
- **Real-Time Low Stock Alerting**: Dedicated reporting endpoint that dynamically surfaces items where stock quantity has dropped below or reached their defined reorder threshold (`quantity <= reorderLevel`).
- **Category-wise Aggregation Summary**: MongoDB Aggregation Pipeline computing total product counts, aggregate physical quantities, and cumulative inventory valuations grouped by category.
- **Safe & Atomic Stock Adjustments**: Fast PATCH endpoint supporting both `restock` and `sale` operations with validation ensuring sales do not exceed available stock.
- **REST Best Practices**: Consistent HTTP status codes (200, 201, 400, 404, 500) and structured JSON error responses.

---

## 🛠️ Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/) (v18+)
- **Backend Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Object Data Modeling (ODM)**: [Mongoose](https://mongoosejs.com/) (v9)
- **Environment Management**: [dotenv](https://www.npmjs.com/package/dotenv)
- **Development Tooling**: [Nodemon](https://nodemon.io/)
- **API Testing**: Thunder Client for VS Code

---

## 📂 Project Structure

```text
Lab3-Inventory-Management-System/
├── models/
│   └── product.js                 # Mongoose schema and virtual properties
├── routes/
│   └── productRoutes.js           # REST API route handlers and business logic
├── testing on thunderclient/      # Test execution screenshots
│   ├── Screenshot (342).png       # POST /api/products
│   ├── Screenshot (344).png       # GET /api/products
│   ├── Screenshot (345).png       # GET /api/products (detailed)
│   ├── Screenshot (347).png       # PUT /api/products/:id
│   ├── Screenshot (348).png       # DELETE /api/products/:id
│   ├── Screenshot (349).png       # GET /api/products/reports/low-stock
│   ├── Screenshot (352).png       # GET /api/products/reports/category-summary
│   ├── Screenshot (353).png       # PATCH /api/products/:id/stock (restock)
│   └── Screenshot (354).png       # PATCH /api/products/:id/stock (sale)
├── .env                           # Environment configuration
├── .env.example                   # Sample environment template
├── .gitignore                     # Git ignored files & directories
├── package.json                   # Project metadata and dependencies
├── server.js                      # Express server entry point & MongoDB connection
└── README.md                      # Project documentation
```

---

## 🗄️ Data Model (Product Schema)

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `name` | `String` | Yes | Trimmed | Product name (e.g., "Laptop", "Keyboard") |
| `sku` | `String` | Yes | Unique, Trimmed | Stock Keeping Unit code (e.g., "LAP001") |
| `category` | `String` | Yes | - | Category classification (e.g., "Electronics") |
| `price` | `Number` | Yes | Min: 0 | Unit price in local currency |
| `quantity` | `Number` | Yes | Min: 0, Default: 0 | Available physical stock quantity |
| `reorderLevel` | `Number` | Yes | Min: 0 | Threshold level triggering reorder alert |
| `supplier` | `String` | Yes | - | Name of the product supplier/vendor |
| `stockValue` | `Number` | - | *Virtual field* | Computed dynamically: `price * quantity` |
| `createdAt` | `Date` | - | Auto-generated | Timestamp of product creation |
| `updatedAt` | `Date` | - | Auto-generated | Timestamp of last modification |

---

## 📡 API Reference & Endpoints

Base URL: `http://localhost:5000`

### 1. Health Check
- **Endpoint**: `GET /`
- **Description**: Returns API status and developer details.
- **Response (200 OK)**:
  ```json
  {
    "message": "Inventory Management API is running",
    "developer": {
      "name": "Anubhav",
      "section": "F",
      "rollNo": "2501730406"
    },
    "status": "Active"
  }
  ```

---

### 2. Create Product
- **Endpoint**: `POST /api/products`
- **Description**: Adds a new product to inventory.
- **Request Body**:
  ```json
  {
    "name": "Laptop",
    "sku": "LAP001",
    "category": "Electronics",
    "price": 55000,
    "quantity": 20,
    "reorderLevel": 5,
    "supplier": "Dell"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Product created successfully",
    "product": {
      "_id": "6af1703eb34759ecf9f640b7",
      "name": "Laptop",
      "sku": "LAP001",
      "category": "Electronics",
      "price": 55000,
      "quantity": 20,
      "reorderLevel": 5,
      "supplier": "Dell",
      "stockValue": 1100000,
      "createdAt": "2026-11-09T07:03:26.776Z",
      "updatedAt": "2026-11-09T07:03:26.776Z"
    }
  }
  ```

---

### 3. Get All Products (Filter, Sort & Pagination)
- **Endpoint**: `GET /api/products`
- **Query Parameters**:
  - `category` *(optional)*: Filter products by category (e.g., `?category=Electronics`)
  - `sort` *(optional)*: Sort by price (`asc` or `desc`, e.g., `?sort=asc`)
  - `page` *(optional, default: 1)*: Page number for pagination
  - `limit` *(optional, default: 10)*: Number of items per page
- **Example Request**: `GET /api/products?category=Electronics&sort=asc&page=1&limit=10`
- **Response (200 OK)**:
  ```json
  {
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "count": 1,
    "products": [
      {
        "_id": "6af1703eb34759ecf9f640b7",
        "name": "Laptop",
        "sku": "LAP001",
        "category": "Electronics",
        "price": 55000,
        "quantity": 20,
        "reorderLevel": 5,
        "supplier": "Dell",
        "stockValue": 1100000
      }
    ]
  }
  ```

---

### 4. Get Product By ID
- **Endpoint**: `GET /api/products/:id`
- **Description**: Retrieves single product information by its MongoDB `_id`.
- **Response (200 OK)**: Product JSON object.
- **Errors**: `404 Not Found` if ID doesn't exist, `400 Bad Request` if ID format is invalid.

---

### 5. Update Product By ID
- **Endpoint**: `PUT /api/products/:id`
- **Description**: Updates specific fields of an existing product.
- **Request Body**:
  ```json
  {
    "price": 60000,
    "quantity": 25
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Product updated successfully",
    "product": {
      "_id": "6af1703eb34759ecf9f640b7",
      "name": "Laptop",
      "sku": "LAP001",
      "category": "Electronics",
      "price": 60000,
      "quantity": 25,
      "reorderLevel": 5,
      "supplier": "Dell",
      "stockValue": 1500000
    }
  }
  ```

---

### 6. Delete Product By ID
- **Endpoint**: `DELETE /api/products/:id`
- **Description**: Permanently deletes a product from inventory.
- **Response (200 OK)**:
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

---

### 7. Low Stock Alert Report
- **Endpoint**: `GET /api/products/reports/low-stock`
- **Description**: Returns all items whose current quantity is less than or equal to their reorder level (`quantity <= reorderLevel`).
- **Response (200 OK)**:
  ```json
  {
    "count": 1,
    "products": [
      {
        "_id": "6af174ebbc29b08555460741",
        "name": "Keyboard",
        "sku": "KEY001",
        "category": "Electronics",
        "price": 1200,
        "quantity": 3,
        "reorderLevel": 10,
        "supplier": "Logitech",
        "stockValue": 3600
      }
    ]
  }
  ```

---

### 8. Category-Wise Summary Report
- **Endpoint**: `GET /api/products/reports/category-summary`
- **Description**: Uses MongoDB aggregation to summarize inventory counts, physical quantities, and monetary valuations grouped by category.
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "Electronics",
      "totalProducts": 1,
      "totalQuantity": 3,
      "totalValue": 3600
    }
  ]
  ```

---

### 9. Stock Adjustment (Restock / Sale)
- **Endpoint**: `PATCH /api/products/:id/stock`
- **Description**: Performs inventory adjustments without overwriting other attributes.
- **Actions Supported**:
  1. `restock`: Increments the product stock quantity.
  2. `sale`: Decrements the product stock quantity (fails with 404 if stock is insufficient).

#### Restock Example:
- **Request Body**:
  ```json
  {
    "type": "restock",
    "quantity": 10
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Stock adjusted successfully",
    "product": {
      "name": "Keyboard",
      "quantity": 13,
      "stockValue": 15600
    }
  }
  ```

#### Sale Example:
- **Request Body**:
  ```json
  {
    "type": "sale",
    "quantity": 5
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Stock adjusted successfully",
    "product": {
      "name": "Keyboard",
      "quantity": 8,
      "stockValue": 9600
    }
  }
  ```

---

## 🧪 Thunder Client Test Verification

All routes have been verified using Thunder Client. Screenshots of each test case are saved inside the `testing on thunderclient/` folder:

| Test Case | Method & Route | Screenshot |
| :--- | :--- | :--- |
| **Product Creation** | `POST /api/products` | `Screenshot (342).png` |
| **Get All Products** | `GET /api/products` | `Screenshot (344).png` & `Screenshot (345).png` |
| **Product Update** | `PUT /api/products/:id` | `Screenshot (347).png` |
| **Product Deletion** | `DELETE /api/products/:id` | `Screenshot (348).png` |
| **Low Stock Report** | `GET /api/products/reports/low-stock` | `Screenshot (349).png` |
| **Category Summary** | `GET /api/products/reports/category-summary` | `Screenshot (352).png` |
| **Stock Adjustment (Restock)** | `PATCH /api/products/:id/stock` | `Screenshot (353).png` |
| **Stock Adjustment (Sale)** | `PATCH /api/products/:id/stock` | `Screenshot (354).png` |

---

## ⚙️ Setup and Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI

### Step-by-Step Setup

1. **Clone or Open the Repository Directory**:
   ```bash
   cd Lab3-Inventory-Management-System
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root folder (or use the provided `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/inventory_db
   ```

4. **Start the Application**:
   - For Development (with Nodemon auto-restart):
     ```bash
     npm run dev
     ```
   - For Production:
     ```bash
     npm start
     ```

5. **Verify Server Status**:
   Open `http://localhost:5000/` in your browser or Postman/Thunder Client. You should see:
   ```json
   {
     "message": "Inventory Management API is running",
     "developer": {
       "name": "Anubhav",
       "section": "F",
       "rollNo": "2501730406"
     },
     "status": "Active"
   }
   ```

---

## 📜 License & Credits

Developed by **Anubhav** (Section: **F**, Roll No: **2501730406**) for **Lab 3: Inventory Management System**. All rights reserved.

# WEB-DEV-III-ASSIGNMENT---3-
