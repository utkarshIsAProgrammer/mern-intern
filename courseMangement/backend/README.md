# Course Management API

A robust Node.js backend built with TypeScript for managing course data. It features CSV data ingestion, advanced search capabilities, and high-performance caching.

## 🚀 Features

-   **CSV Data Ingestion**: Bulk upload and upsert course data from CSV files.
-   **Advanced Search**: Text-based search and filtering by category, instructor, and level.
-   **Intelligent Caching**: Redis-based caching (via Upstash) for search results and course details.
-   **Type Safety**: Fully implemented in TypeScript with runtime validation using Zod.
-   **Data Integrity**: Schema validation during CSV parsing to ensure database consistency.

## 🛠 Tech Stack

-   **Runtime**: Node.js
-   **Language**: TypeScript (ES Modules)
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose)
-   **Cache**: Redis (Upstash)
-   **Validation**: Zod
-   **Parsing**: csv-parser
-   **File Handling**: Multer

## 📋 Prerequisites

-   Node.js (v18+)
-   MongoDB connection string
-   Upstash Redis REST URL and Token

## ⚙️ Setup

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:

    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    UPSTASH_REDIS_REST_URL=your_upstash_url
    UPSTASH_REDIS_REST_TOKEN=your_upstash_token
    ```

3. **Development Mode**:
    ```bash
    npm run dev
    ```

## 🔌 API Endpoints

### 1. Upload Courses

-   **Endpoint**: `POST /api/courses/upload`
-   **Body**: `multipart/form-data` with field `file` (CSV)
-   **Description**: Parses the CSV, validates data with Zod, and upserts to MongoDB. Clears relevant cache.

### 2. Search Courses

-   **Endpoint**: `GET /api/courses/search`
-   **Query Parameters**:
    -   `q`: Global text search (title, description, category, instructor)
    -   `category`: Filter by discipline/major
    -   `instructor`: Filter by professor name
    -   `level`: Filter by course level (e.g., Graduate)
-   **Description**: Returns results from Redis cache if available, otherwise queries MongoDB.

### 3. Get Course by ID

-   **Endpoint**: `GET /api/courses/:id`
-   **Description**: Fetches a single course by its `courseId`. Uses caching.

## 🧪 Example Requests

**Search for "Robotics"**:

```bash
curl "http://localhost:5000/api/courses/search?q=Robotics"
```

**Filter by Category**:

```bash
curl "http://localhost:5000/api/courses/search?category=Marketing"
```

**Upload CSV**:

```bash
curl -X POST -F "file=@course_template.csv" http://localhost:5000/api/courses/upload
```

## 🏗 Scripts

-   `npm run dev`: Starts the development server with `tsx` watch mode.
-   `npm start`: Starts the server in production mode.
-   `npm run test`: Placeholder for test suite.
