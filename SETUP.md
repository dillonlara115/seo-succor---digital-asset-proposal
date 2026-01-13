# Proposal Form Setup Guide

## Prerequisites

1. **Vercel Account** - Deploy your project to Vercel
2. **Resend Account** - Sign up at [resend.com](https://resend.com) (free tier available)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Resend

1. Sign up/login at [resend.com](https://resend.com)
2. Go to API Keys and create a new API key
3. Add your domain (or use Resend's test domain for development)

### 3. Set Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

```
RESEND_API_KEY=re_your_api_key_here
```

**Important:** Update the email addresses in `api/submit-proposal.ts`:
- Line 18: Change `proposals@seosuccor.com` to your verified domain
- Line 19: Change `austin@seosuccor.com` to your team email
- Line 35: Change `hello@seosuccor.com` to your verified domain

### 4. Deploy to Vercel

```bash
# If using Vercel CLI
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

### 5. Verify Domain in Resend (Required for Production)

1. In Resend dashboard, go to Domains
2. Add your domain (e.g., `seosuccor.com`)
3. Add the DNS records provided by Resend to your domain
4. Wait for verification (usually takes a few minutes)

## How It Works

1. User clicks "Accept Proposal" button
2. Modal opens showing proposal summary and contact form
3. User fills out contact information
4. Form submits to `/api/submit-proposal` (Vercel serverless function)
5. Two emails are sent:
   - **Team email**: Notification with proposal details
   - **Client email**: Confirmation with next steps

## Testing Locally

For local development, you can use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This will run your Vercel functions locally. Make sure to set `RESEND_API_KEY` in a `.env.local` file.

## Alternative: Using Formspree (No Backend Required)

If you prefer a simpler solution without serverless functions, you can use Formspree:

1. Sign up at [formspree.io](https://formspree.io)
2. Create a form endpoint
3. Update `AcceptProposalModal.tsx` to submit directly to Formspree
4. No API route needed!

Example Formspree integration:
```typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...formData, proposalSummary })
});
```
