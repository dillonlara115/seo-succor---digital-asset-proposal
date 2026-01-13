# Local Development Setup

## Running the Development Server

### Option 1: Using Vercel CLI (Recommended)

This allows you to test API routes locally:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Run Vercel dev (handles both frontend and API routes)
vercel dev
```

This will:
- Start the Vite dev server on port 3000
- Start API routes on port 3001
- Handle serverless functions locally

### Option 2: Vite Only (No API Routes)

If you just want to work on the frontend without testing form submission:

```bash
npm run dev
```

**Note:** Form submission won't work in this mode. You'll need to deploy to Vercel or use `vercel dev` to test the full functionality.

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Required for form submission
RESEND_API_KEY=re_your_resend_api_key_here

# Optional - for AI generation
GEMINI_API_KEY=your_gemini_api_key_here
```

## Testing Form Submission Locally

1. Make sure you have `RESEND_API_KEY` set in `.env.local`
2. Run `vercel dev` (not `npm run dev`)
3. The form will submit to `http://localhost:3001/api/submit-proposal`
4. Check your Resend dashboard to see if emails were sent

## Troubleshooting

### "404 Not Found" when submitting form
- Make sure you're using `vercel dev` not `npm run dev`
- Check that the API route exists at `api/submit-proposal.ts`

### "API key not valid" error
- Make sure `RESEND_API_KEY` is set in `.env.local`
- Verify the API key is correct in your Resend dashboard
