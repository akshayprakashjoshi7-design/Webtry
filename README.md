# TechVision — Batch 1

TechVision is planned as a learning, coding, development, and authorized cybersecurity platform. This batch establishes the responsive public homepage, shared design tokens, a minimal Express server, security headers, static asset delivery, and an API health endpoint.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

1. Copy `.env.example` to `.env`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.
5. Check `http://localhost:3000/api/health`.

Run syntax checks and the included health test:

```bash
npm run check
npm test
```

## What is implemented in this batch

- Responsive public homepage and navigation.
- Shared CSS variables and reusable button styles.
- Mobile navigation toggle and reduced-motion support.
- Express application with Helmet, compression, CORS configuration, request logging, JSON limits, and centralized error handling.
- API health endpoint that reports whether optional service configuration exists.
- Basic automated health test.

## What is not implemented yet

Authentication, OAuth providers, database persistence, course APIs, Gemini calls, compiler execution, terminal sessions, cybersecurity tool execution, repositories, publishing, and admin workflows are not implemented in Batch 1. The health endpoint reports configuration presence only; it does not verify that external services are operational.

## Security notes

- Never commit `.env` or real credentials.
- Do not expose compiler or terminal workers directly to the public internet.
- Production deployment requires HTTPS, a carefully reviewed Content Security Policy, trusted proxy configuration, CSRF/session design, authorization middleware, database migrations, and isolated execution workers.
- The current static homepage is not an authentication boundary. Protected routes must be enforced by the backend in later batches.

## Project direction

The target architecture uses PostgreSQL and Prisma for persistence, Redis/BullMQ for background jobs, server-side Gemini integration, CodeMirror 6 for the editor, and isolated workers for code execution. These are planned components, not claims of current functionality.
