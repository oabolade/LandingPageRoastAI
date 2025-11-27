# Deploy Your Backend to Render - Complete Guide

## What Changed (Copy These Changes to Your Repo)

### 1. Update `server/index.ts` - CORS Settings

Find this section around line 16:
```typescript
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

Replace with:
```typescript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('bolt.new')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
```

### 2. Update `src/App.tsx` - API URL

Find line 9:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
```

Change to:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### 3. Update `.env.example`

Change this line:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

To:
```
VITE_API_URL=http://localhost:3001/api
```

### 4. Fix ESM Imports in Server Routes

**File: `server/routes/analyze.ts`** (around lines 4-6)

Change:
```typescript
import { captureScreenshot } from '../services/screenshot';
import { analyzeWithOpenAI } from '../services/openai';
import { uploadImageToStorage, saveRoastToDatabase } from '../services/supabase';
```

To:
```typescript
import { captureScreenshot } from '../services/screenshot.js';
import { analyzeWithOpenAI } from '../services/openai.js';
import { uploadImageToStorage, saveRoastToDatabase } from '../services/supabase.js';
```

**File: `server/routes/email.ts`** (line 3)

Change:
```typescript
import { captureEmailForRoast, getRoastById } from '../services/supabase';
```

To:
```typescript
import { captureEmailForRoast, getRoastById } from '../services/supabase.js';
```

### 5. Create `render.yaml` (NEW FILE)

Create a new file in your project root:

```yaml
services:
  - type: web
    name: roast-landing-page-api
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build:server
    startCommand: npm run start:server
    healthCheckPath: /health
    envVars:
      - key: NODE_VERSION
        value: 20
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_ANON_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: SCREENSHOTAPI_KEY
        sync: false
      - key: RESEND_API_KEY
        sync: false
      - key: ALLOWED_ORIGINS
        value: "*"
```

---

## Deploy to Render.com (Step by Step)

### Step 1: Commit Your Changes

```bash
git add .
git commit -m "Configure backend for Render deployment"
git push
```

### Step 2: Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** to authorize GitHub
3. Find and select your repository
4. Click **"Connect"**

### Step 4: Configure Service

**Basic Info:**
- Name: `roast-landing-page-api` (or any name you like)
- Region: Oregon (or closest to you)
- Branch: `main`
- Root Directory: (leave blank)
- Runtime: **Node**

**Build & Deploy:**
- Build Command: `npm install && npm run build:server`
- Start Command: `npm run start:server`

**Instance Type:**
- Select: **Free**

### Step 5: Add Environment Variables

Click **"Add Environment Variable"** and add each of these:

**Required Variables** (copy from your current `.env` file):

| Variable Name | Value |
|--------------|-------|
| `NODE_VERSION` | `20` |
| `VITE_SUPABASE_URL` | (copy from your .env) |
| `VITE_SUPABASE_ANON_KEY` | (copy from your .env) |
| `OPENAI_API_KEY` | (copy from your .env) |
| `SCREENSHOTAPI_KEY` | (copy from your .env) |
| `ALLOWED_ORIGINS` | `*` |

**Optional:**
| Variable Name | Value |
|--------------|-------|
| `RESEND_API_KEY` | (copy from your .env - for emails) |

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Wait 2-5 minutes for initial deployment
3. Watch the logs - you should see "Deploy succeeded"

### Step 7: Get Your API URL

Once deployed, you'll see a URL at the top like:
```
https://roast-landing-page-api.onrender.com
```

**Copy this URL!**

### Step 8: Test Your Backend

Open this URL in your browser:
```
https://YOUR-APP-NAME.onrender.com/health
```

You should see:
```json
{"status":"ok","timestamp":"2024-..."}
```

If you see that, your backend is working! ✅

### Step 9: Update Bolt Frontend

Back in Bolt.new:

1. Open the `.env` file
2. Update this line:
   ```
   VITE_API_URL=https://YOUR-APP-NAME.onrender.com/api
   ```
   (Use YOUR actual Render URL + `/api` at the end)

3. Save the file
4. Wait for Bolt to rebuild (30-60 seconds)

### Step 10: Test Everything!

1. Go to your Bolt published URL
2. Upload a screenshot
3. Click "ROAST ME"
4. Should work now! 🎉

---

## Troubleshooting

### Backend Not Responding

**First request slow?**
- Render free tier "spins down" after 15 min of inactivity
- First request can take 30-60 seconds
- This is normal for free tier
- Add a loading message in your app

**Check logs in Render:**
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors

**Common issues:**
- Missing environment variables
- Wrong build/start commands
- Package installation failures

### CORS Errors

If you see CORS errors:
- Make sure `ALLOWED_ORIGINS` is set to `*` in Render
- Verify you're using the correct Render URL
- Check that URL includes `/api` at the end

### "Failed to analyze" in Frontend

**Check:**
1. Backend is running (visit `/health` endpoint)
2. `VITE_API_URL` in Bolt `.env` is correct
3. URL ends with `/api`
4. All environment variables are set in Render

**Test API directly:**
```bash
curl https://YOUR-APP.onrender.com/health
```

---

## Important Notes

### Free Tier Limitations

- ✅ Free forever
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 50-second cold start
- ✅ Fast after warm-up
- ✅ 750 hours/month (plenty!)

### Upgrade ($7/month)

For instant responses:
- No cold starts
- Always running
- Better for production

---

## Quick Command Reference

**Test backend health:**
```bash
curl https://YOUR-APP.onrender.com/health
```

**Test analyze endpoint:**
```bash
curl -X POST https://YOUR-APP.onrender.com/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

**View Render logs:**
```bash
# In Render dashboard → Your Service → Logs
```

---

## Success Checklist

- [ ] Code changes committed to GitHub
- [ ] Render account created
- [ ] Web Service created and connected to GitHub
- [ ] All environment variables added
- [ ] Deployment succeeded (check logs)
- [ ] `/health` endpoint returns JSON
- [ ] Bolt `.env` updated with Render URL
- [ ] Bolt frontend rebuilt
- [ ] Test upload works on published Bolt URL

Once all checked, you're done! 🚀

---

## Still Need Help?

Common commands for your GitHub repo:
```bash
# Check what changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Configure for Render deployment"

# Push to GitHub
git push origin main
```

After pushing, Render will auto-deploy if you enabled auto-deploy (recommended).
