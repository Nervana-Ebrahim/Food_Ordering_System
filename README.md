 # Food Ordering System — Backend API

A complete, production-style REST API backend for a Food Ordering System, built with Node.js, Express and MongoDB (Mongoose). It supports authentication with JWT, role-based access control (Admin/Customer), category and food catalog management, a per-user cart, and an order workflow with historical price snapshots.

## 1. Project Description

This backend powers a food-ordering platform where:

- **Customers** can browse categories/foods, manage a cart, place orders, and track/cancel their own orders.
- **Admins** manage categories, foods, users, and the full order lifecycle (status updates).

Prices are always re-fetched from the database (never trusted from the client), and every order stores a historical snapshot of item name/price so past orders remain accurate even if food prices change later.

## 2. Features

- JWT authentication (register/login), bcrypt password hashing
- Role-based authorization middleware (Admin / Customer)
- Full CRUD for Categories and Foods (Admin-protected writes)
- Food search, category filter, price-range filter, availability filter, pagination
- Per-user Cart with automatic total-price calculation and live price validation
- Orders created from the current cart, with:
  - Server-side price recomputation (client-sent prices are ignored)
  - Historical snapshot of item name/price inside each order
  - Status workflow: `Pending → Confirmed → Preparing → OutForDelivery → Delivered`, plus `Cancelled`
  - Customer cancellation restricted to `Pending`/`Confirmed`; Admin can update any non-final status
  - Delivered/Cancelled orders are immutable
- Centralized error handling with consistent JSON response shape
- Input validation & sanitization (express-validator + mongo-sanitize)
- Security headers (Helmet), CORS, request logging (Morgan)
- Swagger/OpenAPI documentation at `/api-docs`
- Seed script for realistic demo data

## 3. Technologies

Node.js · Express.js · MongoDB Atlas · Mongoose · JWT · bcryptjs · dotenv · cors · helmet · morgan · express-validator · express-mongo-sanitize · swagger-jsdoc · swagger-ui-express

## 4. Project Structure

```
food-ordering-backend/
├── src/
│   ├── config/db.js
│   ├── controllers/        # auth, user, category, food, cart, order
│   ├── models/              # User, Category, Food, Cart, Order
│   ├── routes/               # REST routes + Swagger JSDoc annotations
│   ├── middleware/          # auth, role, error, notFound
│   ├── services/              # business logic (auth, food, cart, order)
│   ├── validators/           # express-validator rule sets
│   ├── utils/                  # asyncHandler, ApiError, pagination, apiResponse, generateToken
│   ├── seed/seed.js
│   ├── app.js
│   └── server.js
├── swagger.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 5. Installation

```bash
cd food-ordering-backend
npm install
```

## 6. Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

Never commit `.env` — it is already listed in `.gitignore`.

## 7. How to Run

```bash
# development (auto-restart with nodemon)
npm run dev

# production
npm start
```

The server starts on `http://localhost:5000` (or your configured `PORT`). Health check: `GET /health`.

## 8. How to Seed the Database

```bash
npm run seed           # inserts 1 Admin, 3 Customers, categories and foods
npm run seed:destroy   # wipes all Users/Categories/Foods/Carts/Orders
```

**Default credentials (development only):**

| Role     | Email                | Password      |
|----------|-----------------------|---------------|
| Admin    | admin@foodapp.com     | Admin@123     |
| Customer | mona@foodapp.com      | Customer@123  |
| Customer | youssef@foodapp.com   | Customer@123  |
| Customer | laila@foodapp.com     | Customer@123  |

## 9. API Endpoints

Base URL: `/api`

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Role | Body |
|---|---|---|---|---|
| POST | `/auth/register` | Public | — | `name, email, password, phone?, address?` |
| POST | `/auth/login` | Public | — | `email, password` |
| GET | `/auth/me` | Private | any | — |

### Users (`/api/users`)
| Method | Endpoint | Auth | Role | Body |
|---|---|---|---|---|
| GET | `/users/profile` | Private | any | — |
| PUT | `/users/profile` | Private | any | `name?, phone?, address?, password?` |
| GET | `/users` | Private | Admin | query: `page, limit` |
| GET | `/users/:id` | Private | Admin | — |
| PATCH | `/users/:id/role` | Private | Admin | `role: Admin\|Customer` |
| DELETE | `/users/:id` | Private | Admin | — |

### Categories (`/api/categories`)
| Method | Endpoint | Auth | Role | Body |
|---|---|---|---|---|
| GET | `/categories` | Public | — | — |
| GET | `/categories/:id` | Public | — | — |
| POST | `/categories` | Private | Admin | `name, image?` |
| PUT | `/categories/:id` | Private | Admin | `name?, image?` |
| DELETE | `/categories/:id` | Private | Admin | — |

### Foods (`/api/foods`)
| Method | Endpoint | Auth | Role | Notes |
|---|---|---|---|---|
| GET | `/foods` | Public | — | query: `page, limit, category, available, minPrice, maxPrice` |
| GET | `/foods/search?q=` | Public | — | name search |
| GET | `/foods/category/:categoryId` | Public | — | paginated |
| GET | `/foods/:id` | Public | — | — |
| POST | `/foods` | Private | Admin | `name, description?, price, image?, category, available?` |
| PUT | `/foods/:id` | Private | Admin | partial update |
| DELETE | `/foods/:id` | Private | Admin | — |

### Cart (`/api/cart`) — all require authentication
| Method | Endpoint | Body |
|---|---|---|
| GET | `/cart` | — |
| DELETE | `/cart` | — (clears cart) |
| POST | `/cart/items` | `food, quantity` |
| PUT | `/cart/items/:foodId` | `quantity` |
| DELETE | `/cart/items/:foodId` | — |

### Orders (`/api/orders`) — all require authentication
| Method | Endpoint | Role | Body |
|---|---|---|---|
| POST | `/orders` | any | `address, paymentMethod: Cash\|Card` |
| GET | `/orders/my` | any | query: `status, page, limit` |
| GET | `/orders/:id` | owner/Admin | — |
| PATCH | `/orders/:id/cancel` | owner/Admin | — |
| GET | `/orders` | Admin | query: `status, page, limit` |
| PATCH | `/orders/:id/status` | Admin | `status` |

**Success response shape:**
```json
{ "success": true, "message": "...", "data": { ... }, "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
```

**Error response shape:**
```json
{ "success": false, "message": "Food not found" }
```

## 10. Authentication Instructions

1. Register or log in to receive a JWT (`data.token`).
2. Send it on every protected request:
   ```
   Authorization: Bearer <token>
   ```
3. Tokens expire based on `JWT_EXPIRES_IN` (default `7d`).

## 11. Swagger Instructions

Start the server, then open:

```
http://localhost:5000/api-docs
```

Click **Authorize** and paste `Bearer <your JWT>` to test protected endpoints directly from the Swagger UI.

## 12. Postman Testing Instructions

1. Create a Postman environment with variables `baseUrl = http://localhost:5000/api` and `token`.
2. Call `POST {{baseUrl}}/auth/login` with seeded credentials, copy `data.token` into the `token` variable.
3. For protected requests, set header `Authorization: Bearer {{token}}`.
4. Suggested flow: login as Admin → create a Category → create Foods → login as Customer → add items to cart → create an Order → login as Admin → update order status.

## 13. Team Responsibilities (suggested split)

- **Backend/API owner:** models, controllers, services, business rules
- **Auth/Security owner:** JWT, bcrypt, role middleware, input sanitization
- **Docs/QA owner:** Swagger annotations, Postman collection, seed data, README upkeep
- **DevOps owner:** environment config, MongoDB Atlas setup, deployment

## 14. Common Errors and Solutions

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Failed to connect to MongoDB` on boot | Wrong/missing `MONGODB_URI` | Check `.env`, confirm Atlas IP allowlist includes your IP |
| `401 Not authorized, no token provided` | Missing `Authorization` header | Add `Bearer <token>` header |
| `401 Not authorized, invalid or expired token` | Expired or malformed JWT | Log in again to get a fresh token |
| `403 Role '...' is not allowed...` | Customer hitting an Admin-only route | Use an Admin account |
| `409 Email is already registered` | Duplicate email on register | Use a different email or log in instead |
| `400 Cannot create an order from an empty cart` | No items in cart | Add items via `POST /cart/items` first |
| `400 Order is already ... and cannot be modified` | Trying to change a Delivered/Cancelled order | Delivered/Cancelled orders are final by design |
| `400 must be a valid MongoDB ObjectId` | Malformed `:id` in URL | Double-check the id copied from a prior response |

## Frontend Integration Notes

- Store the JWT (e.g., in memory or a secure cookie) after login/register and attach it as `Authorization: Bearer <token>` on every request to `/api/users`, `/api/cart`, and `/api/orders`.
- Never send `price` from the frontend for cart/order operations — only `food` (id) and `quantity`; the server always uses the authoritative DB price.
- Use the `meta` object in list responses (`page`, `limit`, `total`, `totalPages`) to drive pagination UI for Foods, Users and Orders.
- Read `data.order.items[].price` / `.name` from Order responses for receipts — these are frozen at order time and independent of later Food changes.
- Handle `success: false` responses uniformly by showing `message` to the user; validation errors additionally include a `details` array of `{ field, message }`.
