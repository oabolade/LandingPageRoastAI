import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RoastData {
  email: string;
  grade: string;
  url?: string;
  screenshotUrl: string;
  partialRoast: string;
  fullRoast: {
    headline: { grade: string; critique: string };
    valueProposition: { grade: string; critique: string };
    visualHierarchy: { grade: string; critique: string };
    cta: { grade: string; critique: string };
    trustSignals: { grade: string; critique: string };
    actionableRecommendations: string[];
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('[EMAIL] Starting email send process...');
    
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error('[EMAIL] RESEND_API_KEY not found in environment');
      throw new Error("RESEND_API_KEY is not configured");
    }
    
    console.log('[EMAIL] API key found, parsing request body...');

    const roastData: RoastData = await req.json();
    const { email, grade, url, screenshotUrl, partialRoast, fullRoast } = roastData;
    
    console.log(`[EMAIL] Processing email for: ${email}, Grade: ${grade}`);

    const htmlContent = generateEmailHTML({
      grade,
      url,
      screenshotUrl,
      partialRoast,
      fullRoast,
    });

    console.log('[EMAIL] HTML content generated');

    const pdfBase64 = generatePDF({
      grade,
      url,
      screenshotUrl,
      partialRoast,
      fullRoast,
    });

    console.log('[EMAIL] PDF content generated');

    const emailPayload = {
      from: "Roast My Landing Page <onboarding@resend.dev>",
      to: [email],
      subject: `Your Landing Page Roast Report - Grade: ${grade}`,
      html: htmlContent,
      attachments: [
        {
          filename: "roast-report.txt",
          content: pdfBase64,
        },
      ],
    };
    
    console.log('[EMAIL] Sending to Resend API...');

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseText = await emailResponse.text();
    console.log(`[EMAIL] Resend API response status: ${emailResponse.status}`);
    console.log(`[EMAIL] Resend API response: ${responseText}`);

    if (!emailResponse.ok) {
      console.error('[EMAIL] Resend API error:', responseText);
      throw new Error(`Failed to send email: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log(`[EMAIL] Successfully sent! Email ID: ${result.id}`);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[EMAIL] Error in send-roast-email:", error);
    console.error("[EMAIL] Error stack:", error.stack);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateEmailHTML(emailData: Omit<RoastData, "email">): string {
  const { grade, url, partialRoast, fullRoast } = emailData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
    .grade { font-size: 48px; font-weight: bold; margin: 20px 0; }
    .section { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #9333ea; }
    .section-title { font-size: 18px; font-weight: bold; color: #9333ea; margin-bottom: 10px; }
    .recommendation { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 3px solid #10b981; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔥 Your Landing Page Roast Report</h1>
    <div class="grade">Grade: ${grade}</div>
    ${url ? `<p style="margin: 0; opacity: 0.9;">${url}</p>` : ''}
  </div>

  <div class="section">
    <div class="section-title">The Roast</div>
    <p>${partialRoast}</p>
  </div>

  <div class="section">
    <div class="section-title">Headline - ${fullRoast.headline.grade}</div>
    <p>${fullRoast.headline.critique}</p>
  </div>

  <div class="section">
    <div class="section-title">Value Proposition - ${fullRoast.valueProposition.grade}</div>
    <p>${fullRoast.valueProposition.critique}</p>
  </div>

  <div class="section">
    <div class="section-title">Visual Hierarchy - ${fullRoast.visualHierarchy.grade}</div>
    <p>${fullRoast.visualHierarchy.critique}</p>
  </div>

  <div class="section">
    <div class="section-title">Call to Action - ${fullRoast.cta.grade}</div>
    <p>${fullRoast.cta.critique}</p>
  </div>

  <div class="section">
    <div class="section-title">Trust Signals - ${fullRoast.trustSignals.grade}</div>
    <p>${fullRoast.trustSignals.critique}</p>
  </div>

  <div class="section" style="border-left-color: #10b981;">
    <div class="section-title" style="color: #10b981;">Quick Wins - Top Priority Fixes</div>
    ${fullRoast.actionableRecommendations.map((rec, idx) => `
      <div class="recommendation">
        <strong>${idx + 1}.</strong> ${rec}
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p>This report was generated by Roast My Landing Page</p>
    <p>Powered by GPT-4o Vision + Brutal Honesty</p>
  </div>
</body>
</html>
  `;
}

function generatePDF(pdfData: Omit<RoastData, "email">): string {
  const { grade, url, partialRoast, fullRoast } = pdfData;
  
  const pdfContent = `
ROAST MY LANDING PAGE - ANALYSIS REPORT
${'='.repeat(60)}

OVERALL GRADE: ${grade}
${url ? `URL: ${url}` : ''}

${'='.repeat(60)}
THE ROAST
${'='.repeat(60)}

${partialRoast}

${'='.repeat(60)}
DETAILED ANALYSIS
${'='.repeat(60)}

1. HEADLINE - Grade: ${fullRoast.headline.grade}
${'-'.repeat(60)}
${fullRoast.headline.critique}

2. VALUE PROPOSITION - Grade: ${fullRoast.valueProposition.grade}
${'-'.repeat(60)}
${fullRoast.valueProposition.critique}

3. VISUAL HIERARCHY - Grade: ${fullRoast.visualHierarchy.grade}
${'-'.repeat(60)}
${fullRoast.visualHierarchy.critique}

4. CALL TO ACTION - Grade: ${fullRoast.cta.grade}
${'-'.repeat(60)}
${fullRoast.cta.critique}

5. TRUST SIGNALS - Grade: ${fullRoast.trustSignals.grade}
${'-'.repeat(60)}
${fullRoast.trustSignals.critique}

${'='.repeat(60)}
QUICK WINS - TOP PRIORITY FIXES
${'='.repeat(60)}

${fullRoast.actionableRecommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n\n')}

${'='.repeat(60)}

Generated by Roast My Landing Page
Powered by GPT-4o Vision + Brutal Honesty
  `;

  const encoder = new TextEncoder();
  const bytes = encoder.encode(pdfContent);
  
  const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  
  while (i < bytes.length) {
    const byte1 = bytes[i++];
    const byte2 = i < bytes.length ? bytes[i++] : 0;
    const byte3 = i < bytes.length ? bytes[i++] : 0;
    
    const encoded1 = byte1 >> 2;
    const encoded2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
    const encoded3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
    const encoded4 = byte3 & 0x3f;
    
    result += base64chars.charAt(encoded1) + base64chars.charAt(encoded2);
    result += (i - 2 < bytes.length) ? base64chars.charAt(encoded3) : '=';
    result += (i - 1 < bytes.length) ? base64chars.charAt(encoded4) : '=';
  }
  
  return result;
}
