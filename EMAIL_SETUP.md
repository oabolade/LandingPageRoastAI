# Email Setup Guide

This app sends PDF roast reports via email using Resend and Supabase Edge Functions.

## Prerequisites

1. A [Resend](https://resend.com) account (free tier available)
2. A verified domain in Resend (or use their test domain for development)

## Setup Steps

### 1. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your email address
3. Navigate to [API Keys](https://resend.com/api-keys)
4. Create a new API key
5. Copy the API key (you'll only see it once!)

### 2. Configure the Edge Function Secret

The `send-roast-email` edge function needs the Resend API key as an environment variable.

**Important:** Edge function secrets are configured separately from your local `.env` file.

To set the secret, you'll need to configure it in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Settings**
3. Add a new secret:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key

Alternatively, if using the Supabase CLI (not required for this setup):
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### 3. Configure Email Domain (Optional for Production)

For production use, you should:

1. Add and verify your domain in Resend
2. Update the `from` field in `supabase/functions/send-roast-email/index.ts`:
   ```typescript
   from: "Roast My Landing Page <noreply@yourdomain.com>"
   ```

For development, Resend provides a test domain that works out of the box.

## How It Works

1. User enters their email to unlock the full roast report
2. Server saves the email to the database
3. Server calls the `send-roast-email` edge function (non-blocking)
4. Edge function:
   - Generates HTML email with the full analysis
   - Creates a PDF attachment with the complete report
   - Sends the email via Resend API
5. User receives the report in their inbox

## Testing

To test the email functionality:

1. Complete a landing page roast analysis
2. Enter a valid email address
3. Check your inbox (and spam folder) for the report

## Troubleshooting

### Email not received?

- Check your Resend dashboard for delivery logs
- Verify the `RESEND_API_KEY` secret is set correctly
- Check the edge function logs in Supabase dashboard
- Verify your email is not in spam folder

### Edge function errors?

- Check the edge function logs in Supabase dashboard
- Ensure the secret is configured correctly
- Test the edge function directly using the Supabase dashboard

## Cost

- **Resend Free Tier**: 100 emails/day, 3,000 emails/month
- **Paid Plans**: Start at $20/month for 50,000 emails

For most development and small production use cases, the free tier is sufficient.
