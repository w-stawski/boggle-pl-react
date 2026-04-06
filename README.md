# Ploggle

A Boggle-inspired word personal project built to practice and showcase proficiency in **React** and a modern frontend tooling.
> Live deployment: https://boggle-pl-react.vercel.app/
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

## Roadmap
- Improve hot-seat mode
- Add online multiplayer
- Add leaderboard
- More gameplay polish + edge cases
- Better accessibility + keyboard UX
- Next.js rewrite/experiment (App Router)
