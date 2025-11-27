# QUICK FIX - Module Not Found Error

## The Problem
You saw this error in Render logs:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/render/project/src/server/dist/services/screenshot'
```

## The Solution
ESM (ES Modules) requires `.js` extensions in import paths.

## Files to Update in GitHub

### 1. `server/routes/analyze.ts`

**Lines 4-6, change:**
```typescript
import { captureScreenshot } from '../services/screenshot';
import { analyzeWithOpenAI } from '../services/openai';
import { uploadImageToStorage, saveRoastToDatabase } from '../services/supabase';
```

**To:**
```typescript
import { captureScreenshot } from '../services/screenshot.js';
import { analyzeWithOpenAI } from '../services/openai.js';
import { uploadImageToStorage, saveRoastToDatabase } from '../services/supabase.js';
```

### 2. `server/routes/email.ts`

**Line 3, change:**
```typescript
import { captureEmailForRoast, getRoastById } from '../services/supabase';
```

**To:**
```typescript
import { captureEmailForRoast, getRoastById } from '../services/supabase.js';
```

## After Making These Changes

1. **Commit to GitHub:**
   ```bash
   git add .
   git commit -m "Fix ESM imports for Render deployment"
   git push
   ```

2. **Render will auto-redeploy** (if you have auto-deploy enabled)
   - Or manually trigger a deploy in Render dashboard

3. **Wait for deployment** (2-3 minutes)

4. **Test the `/health` endpoint:**
   ```
   https://your-app.onrender.com/health
   ```

5. **Should work now!** ✅

## Why This Happened

TypeScript with ES Modules requires explicit `.js` extensions in relative imports. When TypeScript compiles, it doesn't add these automatically, so we must include them in our `.ts` source files.

This is specific to Node.js ESM mode (which we're using because of `"type": "module"` in package.json).
