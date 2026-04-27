# Admin Auth System

A robust Authentication and Authorization system built with the MERN stack (focused on the backend), featuring Role-Based Access Control (RBAC), JWT authentication via cookies, and schema validation.

## 🚀 Features

-   **User Authentication**: Secure Signup, Login, and Logout functionality.
-   **JWT via Cookies**: Secure token-based authentication using HTTP-only cookies.
-   **Role-Based Access Control (RBAC)**: Middleware to restrict access to specific routes based on user roles (e.g., Admin).
-   **Schema Validation**: Robust data validation using [Zod](https://zod.dev/).
-   **Security**:
    -   Password hashing with `bcryptjs`.
    -   Rate limiting support with Upstash Redis.
    -   Protected routes with custom authentication middleware.
-   **Type Safety**: Fully written in TypeScript for better developer experience and reliability.

## 🛠️ Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB (via Mongoose)
-   **Validation**: Zod
-   **Auth**: JSON Web Tokens (JWT)
-   **Rate Limiting**: Upstash Redis

## 📂 Project Structure

```text
backend/
├── src/
│   ├── configs/       # Configuration files
│   ├── controllers/   # Request handlers
│   ├── db/            # Database connection logic
│   ├── middlewares/   # Auth and RBAC middlewares
│   ├── models/        # Mongoose schemas and models
│   ├── routes/        # API endpoints
│   ├── schemas/       # Zod validation schemas
│   └── server.ts      # Entry point
└── tsconfig.json      # TypeScript configuration
```

## ⚙️ Setup Instructions

### Prerequisites

-   Node.js (v18 or higher recommended)
-   MongoDB account (Atlas or local)
-   (Optional) Upstash Redis account for rate limiting

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd adminAuth
    ```

2. Install dependencies for the backend:

    ```bash
    cd backend
    npm install
    ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory and add the following:
    ```env
    PORT=5500
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    # Upstash Redis (Optional)
    UPSTASH_REDIS_REST_URL=your_upstash_url
    UPSTASH_REDIS_REST_TOKEN=your_upstash_token
    ```

### Running the Project

-   **Development Mode**:
    ```bash
    npm run dev
    ```
-   **Build**:
    ```bash
    npm run build
    ```
-   **Production Mode**:
    ```bash
    npm start
    ```

## 🛣️ API Endpoints

| Method | Endpoint               | Description               | Access |
| :----- | :--------------------- | :------------------------ | :----- |
| POST   | `/api/auth/signup`     | Register a new user       | Public |
| POST   | `/api/auth/login`      | Login user                | Public |
| POST   | `/api/auth/logout`     | Logout user               | Public |
| GET    | `/api/auth/admin-only` | Access admin-only content | Admin  |

## 🛡️ License

This project is licensed under the [ISC License](LICENSE).
