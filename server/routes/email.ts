import express from 'express';
import axios from 'axios';
import { captureEmailForRoast, getRoastById } from '../services/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/email/capture-email', async (req, res) => {
  try {
    const { email, roastId } = req.body;

    if (!email || !roastId) {
      return res.status(400).json({ error: 'Email and roastId are required' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    await captureEmailForRoast(email, roastId);

    const roast = await getRoastById(roastId);

    // Send email with PDF in background (don't wait for it)
    sendRoastEmail({
      email,
      grade: roast.grade,
      url: roast.url,
      screenshotUrl: roast.screenshot_url,
      partialRoast: roast.partial_roast,
      fullRoast: roast.full_roast,
    }).catch(error => {
      console.error('Failed to send email:', error);
    });

    res.json({
      success: true,
      fullRoast: roast.full_roast,
    });
  } catch (error: any) {
    console.error('Error capturing email:', error);
    res.status(500).json({ error: error.message || 'Failed to capture email' });
  }
});

router.get('/email/roast/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const roast = await getRoastById(id);

    res.json({
      roastId: roast.id,
      url: roast.url,
      screenshotUrl: roast.screenshot_url,
      grade: roast.grade,
      partialRoast: roast.partial_roast,
      isEmailCaptured: roast.is_email_captured,
      fullRoast: roast.is_email_captured ? roast.full_roast : null,
      createdAt: roast.created_at,
    });
  } catch (error: any) {
    console.error('Error fetching roast:', error);
    res.status(404).json({ error: 'Roast not found' });
  }
});

async function sendRoastEmail(data: {
  email: string;
  grade: string;
  url?: string;
  screenshotUrl: string;
  partialRoast: string;
  fullRoast: any;
}) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured');
  }

  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/send-roast-email`;

  console.log('[EMAIL] Preparing to send email...');
  console.log('[EMAIL] Email:', data.email);
  console.log('[EMAIL] Grade:', data.grade);
  console.log('[EMAIL] Full roast structure:', JSON.stringify(data.fullRoast, null, 2));

  try {
    const response = await axios.post(
      edgeFunctionUrl,
      data,
      {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[EMAIL] Successfully sent roast report to:', data.email);
    return response.data;
  } catch (error: any) {
    console.error('[EMAIL] Failed to send email. Status:', error.response?.status);
    console.error('[EMAIL] Error response:', JSON.stringify(error.response?.data, null, 2));
    console.error('[EMAIL] Error message:', error.message);
    throw error;
  }
}

export default router;
