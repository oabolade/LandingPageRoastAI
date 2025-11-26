import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[SUPABASE] Environment check failed:');
  console.error('[SUPABASE] SUPABASE_URL:', supabaseUrl ? 'Found' : 'NOT FOUND');
  console.error('[SUPABASE] SUPABASE_ANON_KEY:', supabaseKey ? 'Found (' + supabaseKey.substring(0, 10) + '...)' : 'NOT FOUND');
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
}

console.log('[SUPABASE] Client initialized successfully');
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImageToStorage(imageBuffer: Buffer, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('landing-page-screenshots')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('landing-page-screenshots')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function saveRoastToDatabase(data: {
  url?: string;
  screenshotUrl: string;
  partialRoast: any;
  fullRoast: any;
  grade: string;
}) {
  const { data: roast, error } = await supabase
    .from('roasts')
    .insert({
      url: data.url,
      screenshot_url: data.screenshotUrl,
      partial_roast: data.partialRoast,
      full_roast: data.fullRoast,
      grade: data.grade,
      is_email_captured: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save roast: ${error.message}`);
  }

  return roast;
}

export async function captureEmailForRoast(email: string, roastId: string) {
  const { data: emailCapture, error } = await supabase
    .from('email_captures')
    .insert({
      email,
      roast_id: roastId,
      has_received_full_audit: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to capture email: ${error.message}`);
  }

  await supabase
    .from('roasts')
    .update({ is_email_captured: true })
    .eq('id', roastId);

  return emailCapture;
}

export async function getRoastById(id: string) {
  const { data, error } = await supabase
    .from('roasts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to get roast: ${error.message}`);
  }

  return data;
}

export async function getTotalRoastsCount() {
  const { count, error } = await supabase
    .from('roasts')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to get roast count: ${error.message}`);
  }

  return count || 0;
}
