# Deployment Guide

This guide will help you deploy the Roast My Landing Page app to production.

## Architecture Overview

This app consists of:
- **Frontend**: React + Vite (static files)
- **Backend**: Express.js server (Node.js) - runs as Netlify Functions
- **Database**: Supabase (already configured)
- **Edge Functions**: Supabase Edge Functions for email sending

## Netlify Deployment (Recommended)

This app is configured for easy deployment to Netlify with both frontend and backend in one platform.

## Prerequisites

Before deploying, make sure you have:
1. A Netlify account (sign up at [netlify.com](https://netlify.com))
2. Your code pushed to GitHub, GitLab, or Bitbucket
3. OpenAI API key
4. ScreenshotAPI key (from [screenshotapi.net](https://screenshotapi.net))

## Step-by-Step Deployment

### Step 1: Push Your Code to Git

If you haven't already, push your code to a Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### Step 2: Import to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions` (auto-detected)

### Step 3: Add Environment Variables

In Netlify's site settings, go to "Environment variables" and add:

**Frontend Variables:**
```
VITE_SUPABASE_URL=https://pskscjjuyqnrdieqembg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=/api
```

**Backend Variables (for Netlify Functions):**
```
SUPABASE_URL=https://pskscjjuyqnrdieqembg.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
SCREENSHOTAPI_KEY=your_screenshotapi_key
```

### Step 4: Deploy

Click "Deploy site" and wait for the build to complete. Your site will be live at a Netlify subdomain (e.g., `your-site.netlify.app`).

### Step 5: Setup Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

### Step 6: Resend Email Configuration

To send emails to any recipient:

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add and verify your domain
3. Update the edge function to use your domain:
   - The edge function code needs `from` address updated
   - Use: `roast@yourdomain.com` instead of `onboarding@resend.dev`

## How It Works

- The frontend is built as static files and served by Netlify's CDN
- API requests to `/api/*` are automatically routed to Netlify Functions
- The Express server runs as a serverless function
- All routes work seamlessly without CORS issues

## Local Development

```bash
# Install dependencies
npm install

# Run both frontend and backend
npm run dev

# Frontend runs on http://localhost:5173
# Backend runs on http://localhost:3001
```

## Testing Your Deployment

1. Visit your frontend URL
2. Try analyzing a landing page
3. Enter an email address
4. Check that the email is sent successfully

## Troubleshooting

### Frontend can't connect to backend
- Check that `VITE_API_BASE_URL` is set correctly
- Verify CORS settings on backend
- Check backend logs for errors

### Email not sending
- Verify `RESEND_API_KEY` is set in Supabase
- Check edge function logs in Supabase dashboard
- Verify domain is configured in Resend

### Screenshot capture failing
- Verify `SCREENSHOTAPI_KEY` is set correctly
- Check API quota limits
- Review backend logs

## Support

If you encounter issues, check:
- Platform logs (Vercel/Railway/Render dashboard)
- Supabase logs for database/edge function errors
- Browser console for frontend errors
