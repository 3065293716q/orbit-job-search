# Orbit Job Search Platform

Orbit is a full-stack job-search tracker built with TypeScript, React, Vinext, Cloudflare D1, and ChatGPT sign-in. It supports user-scoped applications, opportunity catalogs for the U.S. and China, application status tracking, follow-up actions, and a goal calendar.

This is a public source snapshot of the app. Private application records and database contents are not included. Personal migration and seed scripts from the hosted deployment were removed; a new account starts with an empty tracker and can import curated opportunities.

## Structure

- `app/`: UI, server actions, authentication, and curated opportunity catalogs
- `db/`: D1 queries and schema
- `drizzle/`: database migrations
- `public/`: visual assets

## Running your own copy

Install Node.js 22.13+ and run `npm ci`. For local development, configure a Sites project with a D1 binding named `DB`, replace the placeholder `project_id` in `.openai/hosting.json`, and run `npm run dev`. The deployed Orbit site uses a private D1 database and ChatGPT authentication; cloning this repository does not grant access to that data or deployment.
