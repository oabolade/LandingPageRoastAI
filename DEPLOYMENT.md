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

In Netlify's site settings, go to "Site settings" → "Environment variables" and add all of these:

**CRITICAL: You MUST add ALL of these environment variables for the app to work:**

```
VITE_SUPABASE_URL=https://pskscjjuyqnrdieqembg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=/api
SUPABASE_URL=https://pskscjjuyqnrdieqembg.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
SCREENSHOTAPI_KEY=your_screenshotapi_key_here
```

**Where to get these keys:**

1. **Supabase Keys** (SUPABASE_URL and SUPABASE_ANON_KEY):
   - Go to your Supabase project dashboard
   - Click on "Settings" → "API"
   - Copy the "Project URL" for SUPABASE_URL
   - Copy the "anon public" key for SUPABASE_ANON_KEY

2. **OpenAI API Key** (OPENAI_API_KEY):
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy and save the key (you won't see it again!)

3. **ScreenshotAPI Key** (SCREENSHOTAPI_KEY):
   - Sign up at https://screenshotapi.net
   - Copy your API token from the dashboard

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

### "Failed to analyze. Please try again." Error

This is the most common error after deploying. It means the backend API is not working. Here's how to fix it:

1. **Check Environment Variables**: Make sure ALL 7 environment variables are set in Netlify:
   - Go to "Site settings" → "Environment variables"
   - Verify all variables are present: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY, SCREENSHOTAPI_KEY
   - **Important**: After adding/changing environment variables, you MUST trigger a new deployment (Netlify won't automatically rebuild)

2. **Check Function Logs**:
   - Go to "Functions" tab in Netlify dashboard
   - Click on the "server" function
   - Check the logs for error messages
   - Common errors:
     - "SUPABASE_URL not configured" → Missing environment variables
     - "OpenAI API error" → Invalid OPENAI_API_KEY
     - "Failed to capture screenshot" → Invalid SCREENSHOTAPI_KEY

3. **Trigger a New Deployment**:
   - After fixing environment variables, go to "Deploys" tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

### Frontend can't connect to backend
- Check that `VITE_API_BASE_URL=/api` (exactly like this, no trailing slash)
- Check Netlify function logs for errors
- Verify the redirects in netlify.toml are correct

### Email not sending
- Verify `RESEND_API_KEY` is set in Supabase edge function secrets
- Check edge function logs in Supabase dashboard
- Verify domain is configured in Resend (free tier only sends to verified emails)

### Screenshot capture failing
- Verify `SCREENSHOTAPI_KEY` is set correctly
- Check API quota limits on ScreenshotAPI dashboard
- Review Netlify function logs

## Support

If you encounter issues, check:
- Platform logs (Vercel/Railway/Render dashboard)
- Supabase logs for database/edge function errors
- Browser console for frontend errors
