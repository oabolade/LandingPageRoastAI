import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { captureScreenshot } from '../services/screenshot.js';
import { analyzeWithOpenAI } from '../services/openai.js';
import { uploadImageToStorage, saveRoastToDatabase } from '../services/supabase.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.post('/analyze-url', async (req, res) => {
  try {
    console.log('[ANALYZE-URL] Received request:', req.body);
    const { url } = req.body;

    if (!url) {
      console.log('[ANALYZE-URL] Error: No URL provided');
      return res.status(400).json({ error: 'URL is required' });
    }

    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      console.log('[ANALYZE-URL] Error: Invalid URL format:', url);
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log('[ANALYZE-URL] Capturing screenshot for:', url);
    const screenshotBase64 = await captureScreenshot(url);

    const imageBuffer = Buffer.from(screenshotBase64.split(',')[1], 'base64');
    console.log('[ANALYZE-URL] Screenshot captured, size:', imageBuffer.length, 'bytes');

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    console.log('[ANALYZE-URL] Uploading to Supabase storage:', fileName);
    const screenshotUrl = await uploadImageToStorage(imageBuffer, fileName);
    console.log('[ANALYZE-URL] Uploaded to:', screenshotUrl);

    console.log('[ANALYZE-URL] Analyzing with OpenAI...');
    const analysis = await analyzeWithOpenAI(screenshotUrl, screenshotBase64);
    console.log('[ANALYZE-URL] Analysis complete, grade:', analysis.grade);

    console.log('[ANALYZE-URL] Saving to database...');
    const roast = await saveRoastToDatabase({
      url,
      screenshotUrl,
      partialRoast: analysis.partialRoast,
      fullRoast: analysis.fullRoast,
      grade: analysis.grade,
    });

    console.log('[ANALYZE-URL] Success! Roast ID:', roast.id);
    res.json({
      roastId: roast.id,
      grade: analysis.grade,
      partialRoast: analysis.partialRoast,
      screenshotUrl,
    });
  } catch (error: any) {
    console.error('[ANALYZE-URL] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze URL' });
  }
});

router.post('/analyze-screenshot', upload.single('screenshot'), async (req, res) => {
  try {
    console.log('[ANALYZE-SCREENSHOT] Received request');

    if (!req.file) {
      console.log('[ANALYZE-SCREENSHOT] Error: No file provided');
      return res.status(400).json({ error: 'Screenshot file is required' });
    }

    let imageBuffer = req.file.buffer;
    console.log('[ANALYZE-SCREENSHOT] File received, size:', imageBuffer.length, 'bytes');

    const metadata = await sharp(imageBuffer).metadata();
    if (metadata.width && metadata.width > 1920) {
      console.log('[ANALYZE-SCREENSHOT] Resizing image from', metadata.width, 'to 1920px');
      imageBuffer = await sharp(imageBuffer)
        .resize(1920, null, { withoutEnlargement: true })
        .png()
        .toBuffer();
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    console.log('[ANALYZE-SCREENSHOT] Uploading to Supabase storage:', fileName);
    const screenshotUrl = await uploadImageToStorage(imageBuffer, fileName);
    console.log('[ANALYZE-SCREENSHOT] Uploaded to:', screenshotUrl);

    const imageBase64 = imageBuffer.toString('base64');
    console.log('[ANALYZE-SCREENSHOT] Analyzing with OpenAI...');
    const analysis = await analyzeWithOpenAI(screenshotUrl, imageBase64);
    console.log('[ANALYZE-SCREENSHOT] Analysis complete, grade:', analysis.grade);

    console.log('[ANALYZE-SCREENSHOT] Saving to database...');
    const roast = await saveRoastToDatabase({
      screenshotUrl,
      partialRoast: analysis.partialRoast,
      fullRoast: analysis.fullRoast,
      grade: analysis.grade,
    });

    console.log('[ANALYZE-SCREENSHOT] Success! Roast ID:', roast.id);
    res.json({
      roastId: roast.id,
      grade: analysis.grade,
      partialRoast: analysis.partialRoast,
      screenshotUrl,
    });
  } catch (error: any) {
    console.error('[ANALYZE-SCREENSHOT] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze screenshot' });
  }
});

export default router;
