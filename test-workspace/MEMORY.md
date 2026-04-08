# Long-Term Memory

## Preferences

- Always use TypeScript over JavaScript for new projects
- Prefer dark mode in all development tools
- Use 2-space indentation, never tabs
- Never use semicolons in TypeScript unless required

## Decisions

- Decided to use PostgreSQL for the main database instead of MySQL
- Going with Next.js App Router for the frontend rewrite
- Chose Tailwind CSS over styled-components for styling

## People

- Sarah Chen works at the infrastructure team, manages Kubernetes clusters
- Mike Torres is the lead backend engineer, owns the auth service
- Dana Kim is the product manager for the dashboard project

## Projects

- `/home/user/projects/acme-api` — Main REST API, Node.js + Express
- `/home/user/projects/dashboard-v2` — React dashboard rewrite
- The staging environment URL is https://staging.acme.dev

## Rules

- Must run tests before pushing to main branch
- Should always create a PR for changes, never push directly
- Database migrations must be reviewed by at least two people
- Never store secrets in environment files committed to git

## Other Notes

- The CI pipeline takes about 12 minutes on average
- Redis cache TTL is set to 300 seconds for most endpoints
- The legacy API will be deprecated by Q3 2026
