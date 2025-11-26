import axios from 'axios';

export async function captureScreenshot(url: string): Promise<string> {
  const apiKey = process.env.SCREENSHOTAPI_KEY;

  if (!apiKey) {
    throw new Error('ScreenshotAPI key not configured');
  }

  console.log('[SCREENSHOT] Capturing screenshot for URL:', url);

  try {
    const response = await axios.get('https://shot.screenshotapi.net/screenshot', {
      params: {
        token: apiKey,
        url: url,
        width: 1440,
        height: 900,
        output: 'image',
        file_type: 'png',
        wait_for_event: 'load',
      },
      responseType: 'arraybuffer',
      timeout: 45000,
    });

    console.log('[SCREENSHOT] Screenshot captured successfully');
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error: any) {
    console.error('[SCREENSHOT] Error:', error.response?.status || error.message);
    throw new Error('Failed to capture screenshot');
  }
}
