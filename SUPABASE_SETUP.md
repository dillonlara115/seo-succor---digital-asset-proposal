# Supabase Admin Dashboard Setup Guide

## Overview

This guide will help you set up the Supabase backend for the SEO Succor proposal system admin dashboard.

## Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com) (free tier available)
2. **Vercel Account** - For deploying serverless functions
3. **Node.js** - Version 18+ recommended

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon Key (public key)
   - Service Role Key (secret key - keep this secure!)

## Step 2: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it in the SQL Editor
4. This will create all necessary tables, indexes, and RLS policies

## Step 3: Create Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Create two buckets:
   - `portfolio-images` (public)
   - `testimonial-images` (public)
3. Set both buckets to **Public** so images can be accessed without authentication

## Step 4: Create Admin User

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click **Add User** > **Create New User**
3. Enter an email and password for your admin account
4. Note: You can also use **Email** authentication and invite users

## Step 5: Configure Environment Variables

### Local Development (.env.local)

Create a `.env.local` file in the project root:

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Existing
RESEND_API_KEY=your-resend-key
GEMINI_API_KEY=your-gemini-key
```

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all the variables from above

**Important:** Make sure to add these to all environments (Production, Preview, Development)

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Test Locally

```bash
# Run Vite dev server
npm run dev

# In another terminal, run Vercel dev for API routes
npx vercel dev
```

## Step 8: Access Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Log in with your admin credentials
3. You should see the admin dashboard

## Step 9: Seed Initial Data (Optional)

You can manually add initial data through the admin dashboard, or use Supabase's SQL Editor:

### Example: Add a Testimonial

```sql
INSERT INTO testimonials (name, role, company, quote, rating, is_active)
VALUES (
  'Josh Traeger',
  'Founder',
  'The Military Defense Firm',
  'I have trusted SEO Succor to help me build two different businesses...',
  5,
  true
);
```

### Example: Add a Service

```sql
INSERT INTO services (name, type, base_price, description, features, is_active)
VALUES (
  'The Foundation',
  'pricing',
  '$3,000',
  'The essential Digital Asset build.',
  '["Custom WordPress Theme", "Essential On-Page SEO", "301 Redirect Mapping"]'::jsonb,
  true
);
```

## Step 10: Deploy to Vercel

```bash
# If using Vercel CLI
vercel

# Or connect your GitHub repo for automatic deployments
```

## Troubleshooting

### "Cannot find module" errors

- Make sure all dependencies are installed: `npm install`
- Restart your dev server
- Check that `node_modules` exists

### API routes not working locally

- Make sure you're running `vercel dev` for API routes
- Check that environment variables are set in `.env.local`
- Verify Vercel CLI is installed: `npm install -g vercel`

### Authentication not working

- Verify Supabase credentials are correct
- Check that RLS policies are set up correctly
- Ensure admin user exists in Supabase Auth

### Database connection errors

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that tables were created successfully
- Review Supabase logs in the dashboard

## Next Steps

1. **Add Content**: Use the admin dashboard to add testimonials, portfolio items, and services
2. **Create Proposals**: Use the proposal builder to create your first dynamic proposal
3. **Test Proposal Flow**: Create a proposal and test the client acceptance flow
4. **Customize**: Adjust styling, add more features, or extend functionality as needed

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review Vercel serverless functions docs: https://vercel.com/docs/functions
- Check the project README for general setup
