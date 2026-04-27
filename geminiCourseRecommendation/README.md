# Gemini Course Recommendation API (TypeScript)

This is a backend service built with TypeScript, Express, and Zod that provides course recommendations based on user preferences using the Gemini AI API.

## Features

- **TypeScript**: Type-safe development.
- **ESM**: Uses modern `import` syntax.
- **Zod**: Robust request body validation.
- **Gemini AI**: Integration with Google's Generative AI.
- **Mock Fallback**: Works out of the box even without an API key.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the API Key:
   Open the `.env` file and replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API key.

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/recommendations

Accepts user preferences and returns course recommendations.

**Request Body (Validated by Zod):**
```json
{
  "topics": "Web Development",
  "skillLevel": "Intermediate", // Must be "Beginner", "Intermediate", or "Advanced"
  "additionalPreferences": "React, Node.js" // Optional
}
```

**Response:**
Returns a JSON object with a list of recommended courses.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Validation**: Zod
- **AI**: @google/generative-ai
- **Dev Tooling**: tsx (for ESM support)
