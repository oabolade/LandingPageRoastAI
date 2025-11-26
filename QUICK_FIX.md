# Quick Fix for Netlify Deployment Error

Your site is showing "ERROR Failed to analyze. Please try again." This means environment variables are missing.

## Fix Steps (5 minutes):

### 1. Go to Netlify Dashboard
- Open your site: https://app.netlify.com
- Select your "landingpageroast" site

### 2. Add Environment Variables
- Click "Site settings" → "Environment variables"
- Click "Add a variable" and add each of these:

```
Variable name: VITE_SUPABASE_URL
Value: https://pskscjjuyqnrdieqembg.supabase.co

Variable name: VITE_SUPABASE_ANON_KEY
Value: [Get from Supabase Dashboard → Settings → API → anon public key]

Variable name: VITE_API_BASE_URL
Value: /api

Variable name: SUPABASE_URL
Value: https://pskscjjuyqnrdieqembg.supabase.co

Variable name: SUPABASE_ANON_KEY
Value: [Same as VITE_SUPABASE_ANON_KEY]

Variable name: OPENAI_API_KEY
Value: [Get from https://platform.openai.com/api-keys]

Variable name: SCREENSHOTAPI_KEY
Value: [Get from https://screenshotapi.net dashboard]
```

### 3. Trigger New Deployment
- Go to "Deploys" tab
- Click "Trigger deploy" → "Clear cache and deploy site"
- Wait 2-3 minutes for deployment to complete

### 4. Test Your Site
- Visit your site URL: https://landingpageroast.netlify.app
- Try entering a URL like "tripkitapp.com"
- Should work now!

## Still Not Working?

### Check Function Logs:
1. Go to "Functions" tab in Netlify
2. Click "server" function
3. Look for error messages in logs

### Common Issues:
- **"SUPABASE_URL not configured"** → Environment variables not set correctly. Redeploy after adding them.
- **"OpenAI API error"** → Invalid or missing OPENAI_API_KEY
- **"Failed to capture screenshot"** → Invalid or missing SCREENSHOTAPI_KEY
- **No logs showing** → Function isn't being called, check VITE_API_BASE_URL is set to `/api`

## Need API Keys?

**Supabase** (Free):
- Already have project at https://pskscjjuyqnrdieqembg.supabase.co
- Go to Settings → API to get keys

**OpenAI** (Pay-as-you-go):
- Sign up: https://platform.openai.com
- Add payment method
- Create API key: https://platform.openai.com/api-keys
- Cost: ~$0.01 per analysis

**ScreenshotAPI** (Free tier: 100/month):
- Sign up: https://screenshotapi.net
- Get API token from dashboard
- Free tier is enough for testing

## Push to GitHub

Since git isn't available in Bolt, download your project and run locally:

```bash
# In your local project directory
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/cabolade/LandingPageRoastAI.git
git push -u origin main
```
