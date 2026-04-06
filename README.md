# Ploggle

Personal demo project (open source). A Boggle-inspired word game built to practice and showcase proficiency in **React** and a modern frontend toolchain (with a future **Next.js** port planned).

> **Status:** Work in progress (not finished yet).

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- i18next / react-i18next
- Vitest + Testing Library

## Running locally

```bash
npm install
```

Create `.env` (git-ignored) and provide the dictionary API key:

```bash
VITE_SJP_API_KEY=your_token_here
```

Start dev server:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test -- --run
npm run lint
```

## Deployment (Vercel)

- **Import the repo** in Vercel.
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:** set `VITE_SJP_API_KEY` in Vercel (Preview + Production)
- `vercel.json` contains an SPA rewrite (excluding `/api/*`).

Notes:
- `npm run preview` serves static files only (no serverless functions).
- `VITE_*` vars are bundled into client JS — treat the key as **public**.

## Roadmap

- More gameplay polish + edge cases
- Better accessibility + keyboard UX
- CI hardening
- Next.js rewrite/experiment (App Router)

## License

Open source (add a `LICENSE` file if you want a specific license like MIT).
