# ShopNest — Mini E-Commerce Web Application

A full-stack e-commerce web application built with React and Node.js/Express as a college assignment demonstrating modern web development concepts.

## Technologies

### Frontend
- React 18
- Vite
- JavaScript (JSX)
- React Router DOM v6
- CSS (responsive, custom properties)

### Backend
- Node.js
- Express.js
- CORS

## Features

- **Product Browsing** — View all products with category filtering
- **Product Details** — Detailed product view with stock info
- **Shopping Cart** — Add, remove, update quantities with real-time totals
- **Quantity Validation** — Prevents exceeding stock, invalid quantities
- **User Authentication** — Login/logout with localStorage persistence
- **Order Placement** — Backend-verified orders with stock management
- **Order History** — View past orders with details
- **Protected Routes** — Orders page requires authentication
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Error Handling** — Comprehensive error states for all operations
- **Loading States** — Visual feedback during API calls

## Folder Structure

```
shopnest/
├── README.md
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   ├── CartItem.jsx
│       │   ├── QuantitySelector.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── ErrorMessage.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Products.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Cart.jsx
│       │   ├── Orders.jsx
│       │   ├── Account.jsx
│       │   └── NotFound.jsx
│       ├── context/
│       │   ├── CartContext.jsx
│       │   └── AuthContext.jsx
│       └── services/
│           └── api.js
└── backend/
    ├── package.json
    ├── server.js
    ├── data/
    │   ├── products.js
    │   └── orders.js
    ├── routes/
    │   ├── productRoutes.js
    │   └── orderRoutes.js
    └── controllers/
        ├── productController.js
        └── orderController.js
```

## Installation & Running

### Backend

```bash
cd shopnest/backend
npm install
npm start
```

The backend runs on **http://localhost:5000**

### Frontend

```bash
cd shopnest/frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

> **Note:** Start the backend first, then the frontend.

## API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /api/products      | Get all products         |
| GET    | /api/products/:id  | Get a single product     |
| POST   | /api/orders        | Create a new order       |
| GET    | /api/orders        | Get all orders           |

### POST /api/orders — Request Body

```json
{
  "user": {
    "name": "John",
    "email": "john@example.com"
  },
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

## Authentication

This project uses a simple localStorage-based authentication suitable for a college assignment:

- User enters Name, Email, and Password on the Account page
- Credentials are stored in `localStorage` under the key `shopnest_user`
- Login state persists across page refreshes
- Navbar updates dynamically to show username/logout
- Protected routes redirect to login when not authenticated
- Logout clears the stored user data

**Test Login:** Any name, valid email, and password (6+ characters) will work.

## Validation

### Frontend Validation
- Login: required fields, valid email format, minimum password length (6 chars)
- Cart: quantity must be positive integer, cannot exceed stock
- Orders: user must be logged in, cart cannot be empty

### Backend Validation
- Product ID must exist
- Order items array must be non-empty
- Quantity must be positive integer
- Quantity must not exceed available stock
- User name and email are required
- Order total is calculated server-side using backend prices

## Data Storage

No database is used. Products and orders are stored in JavaScript arrays on the backend (in-memory). Data resets when the server restarts.
