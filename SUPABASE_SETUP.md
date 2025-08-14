# Supabase Setup Guide

Your Next.js application requires Supabase environment variables to function properly. Follow these steps to configure them:

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hiwmylwkhtmcagedmuks.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpd215bHdraHRtY2FnZWRtdWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzYwNzEsImV4cCI6MjA3MDc1MjA3MX0.vbw9uZcZ4CMf8ooHWff7Qnb6hIvRrt5n_HolVom3F8U

# Optional: Redirect URL for development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

## How to Get These Values

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

## Project URL Format
- Looks like: `https://xxxxxxxxxxxxxxxxxxxxx.supabase.co`

## Anon Key Format
- Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## After Configuration

1. Save the `.env.local` file
2. Restart your Next.js development server
3. The Supabase errors should be resolved

## Security Note

- Never commit `.env.local` to version control
- The `.env.local` file is already in your `.gitignore`
- These are public keys that are safe to expose in client-side code 