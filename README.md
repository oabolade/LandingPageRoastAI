# Roast My Landing Page

An AI-powered landing page analysis tool that provides brutally honest, humorous, and actionable feedback to help improve conversion rates. Features a dark mode aesthetic with neon accents and delivers detailed PDF reports via email.

## Features

- **Dual Input Methods**: Enter a URL for auto-screenshot or upload your own screenshot
- **AI-Powered Analysis**: Uses GPT-4o Vision for comprehensive landing page evaluation
- **Two-Tier Roast System**:
  - Free partial roast with overall grade and summary
  - Complete analysis with email capture (includes PDF report)
- **Detailed Breakdown**: Analyzes 5 key areas (headline, value prop, visual hierarchy, CTA, trust signals)
- **Actionable Recommendations**: 3-5 prioritized quick wins
- **Email Delivery**: Full analysis sent as formatted PDF to user's inbox
- **Dark Mode UI**: Neon purple/pink accents with modern design
- **Data Persistence**: All roasts stored in Supabase with screenshot URLs

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS with custom dark theme
- Lucide React for icons
- Axios for API communication

### Backend
- Express.js server (Node.js)
- OpenAI GPT-4o Vision API for analysis
- ScreenshotAPI for URL-based screenshots
- Supabase for database and storage
- Supabase Edge Functions for email delivery

### Email System
- Resend for email delivery
- HTML email templates
- PDF report generation
- Automatic sending on email capture

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then fill in your credentials:

```env
# Supabase (get from https://supabase.com/dashboard)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your_openai_api_key

# ScreenshotAPI (get from https://screenshotapi.net)
SCREENSHOTAPI_KEY=your_screenshotapi_key

# Resend (get from https://resend.com/api-keys)
RESEND_API_KEY=your_resend_api_key
```

### 3. Set Up Database

The Supabase migrations will run automatically. The database includes:
- `roasts` table for storing analysis results
- `email_captures` table for tracking email submissions
- Storage bucket for landing page screenshots
- RLS policies for public access

### 4. Configure Email Sending

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed instructions on setting up the Resend integration and edge function secrets.

**Quick Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Set it as a secret in your Supabase Edge Function settings (name: `RESEND_API_KEY`)

### 5. Run Development Server

```bash
npm run dev
```

This starts both the frontend (Vite) and backend (Express) servers concurrently:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 6. Build for Production

```bash
npm run build
```

This compiles both the TypeScript server and React frontend.

## Project Structure

```
/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── Hero.tsx             # Hero section with branding
│   │   ├── InputSection.tsx     # URL/file upload interface
│   │   ├── PartialRoast.tsx     # Free tier roast display
│   │   ├── FullRoast.tsx        # Complete analysis display
│   │   └── EmailModal.tsx       # Email capture modal
│   ├── App.tsx                  # Main application logic
│   └── index.css                # Global styles
├── server/                       # Express backend
│   ├── routes/
│   │   ├── analyze.ts           # Analysis endpoints
│   │   └── email.ts             # Email capture endpoints
│   ├── services/
│   │   ├── openai.ts            # OpenAI integration
│   │   ├── screenshot.ts        # Screenshot capture
│   │   └── supabase.ts          # Database operations
│   └── index.ts                 # Server entry point
├── supabase/
│   ├── functions/
│   │   └── send-roast-email/    # Edge function for email sending
│   └── migrations/               # Database migrations
└── package.json
```

## How It Works

### User Flow

1. **Input**: User enters a URL or uploads a screenshot
2. **Screenshot**: System captures screenshot (if URL) and stores in Supabase Storage
3. **Analysis**: GPT-4o Vision analyzes the landing page across 5 key areas
4. **Partial Roast**: User sees grade and summary for free
5. **Email Gate**: To unlock full analysis, user enters email
6. **Full Report**: Complete breakdown displayed in UI
7. **Email Delivery**: PDF report sent to user's inbox automatically

### Analysis Categories

1. **Headline** - Clarity, value proposition, attention-grabbing
2. **Value Proposition** - Unique benefits, differentiation
3. **Visual Hierarchy** - Layout, readability, information flow
4. **Call to Action** - Clarity, prominence, action-oriented
5. **Trust Signals** - Credibility indicators, social proof

### Email Report

- HTML formatted email with color-coded grades
- PDF attachment with complete analysis
- All 5 category critiques with individual grades
- 3-5 actionable recommendations prioritized by impact

## API Endpoints

### POST `/api/analyze-url`
Analyzes a landing page from URL
```json
{
  "url": "https://example.com"
}
```

### POST `/api/analyze-screenshot`
Analyzes an uploaded screenshot (multipart/form-data)

### POST `/api/capture-email`
Captures email and triggers full report delivery
```json
{
  "email": "user@example.com",
  "roastId": "uuid"
}
```

### GET `/api/roast/:id`
Retrieves a specific roast analysis

## Development Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run build` - Build both frontend and backend
- `npm run build:client` - Build only the frontend
- `npm run build:server` - Build only the backend
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking

## Environment Setup

### Required Services

1. **Supabase** - Database, storage, and edge functions (free tier available)
2. **OpenAI** - GPT-4o Vision API (pay-per-use)
3. **ScreenshotAPI** - URL screenshot capture (free tier: 100/month)
4. **Resend** - Email delivery (free tier: 100/day)

### Cost Estimates (Monthly)

- Supabase: Free (up to 500MB database, 1GB storage)
- OpenAI: ~$0.01-0.02 per analysis
- ScreenshotAPI: Free tier (100 screenshots)
- Resend: Free tier (100 emails/day)

**Total for 100 roasts/month**: ~$1-2

## Security

- RLS policies on all database tables
- API keys stored as environment variables
- Edge function secrets managed separately
- User emails stored securely in database
- No authentication required (public tool)

## Troubleshooting

### "Failed to capture email" error
- Check that `RESEND_API_KEY` is set in Edge Function secrets
- Verify Resend account is active and verified
- Check Edge Function logs in Supabase dashboard

### Screenshot not working
- Verify `SCREENSHOTAPI_KEY` is correct
- Check API quota hasn't been exceeded
- Ensure URL is publicly accessible

### Analysis failing
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has credits
- Ensure image is under 20MB

## License

MIT
