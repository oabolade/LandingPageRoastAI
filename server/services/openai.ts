import axios from 'axios';

interface RoastAnalysis {
  grade: string;
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

const PARTIAL_ROAST_PROMPT = `You are a brutally honest but hilarious and highly intelligent landing page conversion expert. Your name is 'RoastMaster'. You analyze landing page screenshots and destroy them with facts and humor. Analyze this landing page screenshot and give a quick, savage 2-3 sentence roast focusing on the most glaring issue that's killing conversions. Be funny, direct, and punchy. If the website is impressive and has little to no design holes, mention it and highlight the features that makes it standout in a fun and humorous. Assign an overall grade from F to A+.

Return your response in this exact JSON format:
{
  "grade": "C-",
  "partialRoast": "Your 2-3 sentence roast here"
}`;

const FULL_ROAST_PROMPT = `You are a brutally honest but constructive landing page conversion expert. Analyze this landing page screenshot comprehensively across these dimensions:

1. Headline - Does it clearly communicate value? Is it compelling?
2. Value Proposition - Is it immediately clear what this product/service does and why someone should care?
3. Visual Hierarchy - Does the design guide the eye to the most important elements?
4. CTA (Call to Action) - Is it clear, compelling, and prominent?
5. Trust Signals - Are there credibility indicators, social proof, or trust elements?

For each dimension, provide:
- A grade (F to A+)
- A brutally honest but funny critique (2-3 sentences)

Then provide 3-5 specific, actionable recommendations ranked by priority.

Be harsh but constructive. Use humor but make it educational. The founder needs to know what's broken and how to fix it.

Return your response in this exact JSON format:
{
  "headline": {
    "grade": "B",
    "critique": "Your critique here"
  },
  "valueProposition": {
    "grade": "C+",
    "critique": "Your critique here"
  },
  "visualHierarchy": {
    "grade": "D",
    "critique": "Your critique here"
  },
  "cta": {
    "grade": "B-",
    "critique": "Your critique here"
  },
  "trustSignals": {
    "grade": "F",
    "critique": "Your critique here"
  },
  "actionableRecommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}`;

export async function analyzeWithOpenAI(imageUrl: string, imageBase64?: string): Promise<RoastAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  let imageContent: string;

  if (imageBase64) {
    imageContent = imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`;
  } else {
    try {
      console.log('[OPENAI] Fetching image from:', imageUrl);
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000
      });
      const base64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
      imageContent = `data:image/png;base64,${base64}`;
      console.log('[OPENAI] Image fetched and converted to base64');
    } catch (error: any) {
      console.error('[OPENAI] Failed to fetch image:', error.message);
      throw new Error('Failed to fetch image for analysis');
    }
  }

  try {
    console.log('[OPENAI] Starting partial roast analysis...');
    const partialResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: PARTIAL_ROAST_PROMPT },
              {
                type: 'image_url',
                image_url: {
                  url: imageContent,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const partialData = JSON.parse(partialResponse.data.choices[0].message.content);
    console.log('[OPENAI] Partial roast complete, grade:', partialData.grade);

    console.log('[OPENAI] Starting full roast analysis...');
    const fullResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: FULL_ROAST_PROMPT },
              {
                type: 'image_url',
                image_url: {
                  url: imageContent,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const fullData = JSON.parse(fullResponse.data.choices[0].message.content);
    console.log('[OPENAI] Full roast complete');

    return {
      grade: partialData.grade,
      partialRoast: partialData.partialRoast,
      fullRoast: fullData,
    };
  } catch (error: any) {
    console.error('[OPENAI] API error:', error.response?.data || error.message);
    throw new Error('Failed to analyze with OpenAI');
  }
}
