# SkillForge

SkillForge is an AI-powered microlearning platform designed to help users learn skills like coding, design, and languages in 5-minute daily sessions.

## Features

- **Engaging Homepage**: Modern, interactive landing page with multiple sections
- **Popular Skills**: Interactive carousel showcase of top courses
- **AI Recommendations**: Personalized skill recommendations based on interests
- **Daily Streak Tracking**: Gamified learning progress visualization
- **Why SkillForge Works**: Educational methodology explanation
- **Testimonials**: User success stories
- **Newsletter & Call-to-Action**: Sign-up and conversion elements

## 🔧 Fixing Google OAuth Authentication Issues

If you're experiencing the **"missing_code"** error during Google authentication, follow these steps to fix it:

### 1. Set Up Environment Variables

The most common cause of authentication failures is missing or incorrect environment variables.

**Backend (.env file in skillforge-backend/ — see `skillforge-backend/.env.example`):**

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (used for CORS and redirect)
FRONTEND_URL=http://localhost:3000

# JWT Configuration (required — no default; generate a long random value)
JWT_SECRET=change-me-to-a-long-random-value-in-local-env

# Google OAuth Configuration (leave empty to disable Google login locally)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Session Configuration (required if sessions are enabled)
SESSION_SECRET=change-me-to-a-long-random-value-in-local-env
```

> Security note: any credential previously committed to this repository must be
> treated as compromised. Rotate the Google OAuth client secret, JWT secret,
> and session secret in Google Cloud Console / your deployment environment.
> Never commit real `.env` values — only `.env.example` placeholders.

**Frontend (.env file in skillforge/):**

```bash
# API URL (Backend Server URL)
VITE_API_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### 2. Google Cloud Console Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Create or edit an OAuth 2.0 Client ID
5. Add the following authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (development)
   - Your production callback URL if applicable

### 3. Common Issues and Solutions

#### "missing_code" Error:

- **Cause 1**: User is refreshing or directly accessing the callback URL
  - **Fix**: We've added protection for this in the latest code
  
- **Cause 2**: Redirect URI mismatch
  - **Fix**: Ensure the GOOGLE_CALLBACK_URL in your .env matches exactly with the URI registered in Google Cloud Console

- **Cause 3**: Google OAuth configuration issues
  - **Fix**: Verify client ID and secret are correct, and that the OAuth screen is properly configured

#### CSRF Protection:

We've implemented state parameter validation to protect against CSRF attacks. The state parameter is generated and verified between the frontend and backend.

### 4. Testing the OAuth Flow

To test your OAuth configuration:

1. Start both the frontend and backend servers
2. Navigate to `http://localhost:3001/auth/test-google` in your browser
3. Click the provided test URL to simulate the OAuth flow
4. If successful, you'll be redirected to the lessons page

### 5. Debugging Tools

- Check the backend console logs for authentication process details
- Use the debug info in the AuthCallback component
- Access `http://localhost:3001/auth/debug-page` for a manual token testing tool

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Google Cloud Platform account with OAuth credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd skillforge
   npm install
   cd skillforge-backend
   npm install
   ```
3. Set up environment variables (see above)
4. Run database migrations:
   ```bash
   cd skillforge-backend
   npm run prisma:migrate
   ```

### Running the app

1. Start the backend:
   ```bash
   cd skillforge-backend
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd skillforge
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser

## 🔍 Troubleshooting

If you continue experiencing issues:

1. Check browser console and network tab for error details
2. Verify all environment variables are set correctly
3. Look at browser cookies and session storage for token and state persistence
- **src/components/home/**: Contains all the homepage components
- **src/pages/**: Main application pages
- **src/data/**: Mock data for courses
- **public/screenshots/**: Application mockup images

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Vite
