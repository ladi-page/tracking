# Central Redirect Dashboard

A GitHub-ready Next.js + Supabase redirect manager. Create one permanent URL such as `/go/offer` and change its destination from the dashboard whenever you want.

## Stack
- Next.js
- Supabase Auth + Postgres
- Vercel
- Server-side 302 redirects

## 1. Create Supabase project
Create a project at https://supabase.com, then open **SQL Editor** and run `supabase/schema.sql`.

Create an admin account in **Authentication → Users → Add user**. Use that email/password to log into the dashboard.

## 2. Configure environment variables
Copy `.env.example` to `.env.local` for local development. In Vercel, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Get the first three from Supabase **Project Settings → API**. Never expose the service role key in browser code or commit it to GitHub.

## 3. Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## 4. Deploy to GitHub + Vercel
Push this folder to a GitHub repository, import the repository into Vercel, add the environment variables, and deploy.

Your redirect will look like:
`https://YOUR-VERCEL-DOMAIN.vercel.app/go/offer`

After connecting a custom domain, it becomes:
`https://yourdomain.com/go/offer`

## How it works
The public redirect route is `/go/[slug]`. It reads the current destination from Supabase and returns a server-side HTTP 302 redirect. Therefore, changing the destination in the dashboard changes where the same permanent URL goes without changing the URL used in your ads/posts/sites.

## Important
If you use the redirect URL in paid advertising, affiliate campaigns, or other platforms, make sure the destination and redirect behavior comply with that platform's rules. Avoid using this system to conceal prohibited destinations or evade review.
