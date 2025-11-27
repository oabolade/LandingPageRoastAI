# Deploy Frontend to Netlify

Your backend is already deployed at: `https://landingpageroastai.onrender.com/`

Now let's deploy the frontend (the actual website users will visit).

## Option 1: Deploy to Netlify (Recommended - Free & Fast)

### Step 1: Sign Up for Netlify

1. Go to https://netlify.com
2. Click "Sign up" and connect with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Create New Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Find and select your repository
4. Click on your repository name

### Step 3: Configure Build Settings

**Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions` (optional, leave blank for now)

Click **"Show advanced"** to add environment variables.

### Step 4: Add Environment Variables

Click **"Add environment variable"** for each:

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | (your Supabase project URL) |
| `VITE_SUPABASE_ANON_KEY` | (your Supabase anon key) |
| `VITE_API_URL` | `https://landingpageroastai.onrender.com/api` |

**IMPORTANT:** For frontend, use the `VITE_` prefix!

### Step 5: Deploy!

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build and deployment
3. Netlify will give you a URL like: `https://random-name-123456.netlify.app`

### Step 6: Test Your Site

Visit your Netlify URL and test the landing page roaster!

### Step 7: Update CORS in Backend (Important!)

Go back to your Render dashboard → Environment variables

Update `ALLOWED_ORIGINS` to include your Netlify URL:
```
https://your-site-name.netlify.app
```

Or use `*` to allow all origins:
```
ALLOWED_ORIGINS=*
```

---

## Option 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your repository
5. Add environment variables (same as Netlify step 4)
6. Click **"Deploy"**

---

## After Deployment

### Custom Domain (Optional)

Both Netlify and Vercel allow you to add a custom domain:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed

### Testing

Test these features:
- ✅ Enter a URL to roast a landing page
- ✅ Upload a screenshot to roast
- ✅ View partial roast (free preview)
- ✅ Enter email to get full roast
- ✅ Receive email with full analysis

---

## Troubleshooting

**"API call failed"**
- Check that `VITE_API_URL` is set correctly in Netlify
- Check that your backend is running at `https://landingpageroastai.onrender.com/health`
- Check CORS settings in backend `ALLOWED_ORIGINS`

**"CORS error"**
- Update `ALLOWED_ORIGINS` in Render to include your Netlify URL

**"Build failed"**
- Check build logs in Netlify
- Verify all environment variables are set correctly
