# Ploggle

**Ploggle** is a browser-based word game inspired by Boggle, tailored for Polish letter sets and dictionary validation. Players roll a 4×4 letter grid, form words by chaining adjacent letters, and score turns against a remote validation service.

---

## Features

- **Single-player** and **hot-seat** (shared device, multiple players) modes
- Configurable **round count**, **turn timer**, and optional **non-linear letter unselection** (“word breaking”)
- **Internationalization** (English and Polish) with runtime-loaded locale bundles
- **Accessible results flow**: turn summary, round comparison (multiplayer), and final standings with per-round history
- **WebGL-style background** on the main layout for visual polish

---

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, Tailwind CSS 4 |
| Tooling | Vite 7, TypeScript 5.9 (strict + `strictNullChecks`) |
| Routing | React Router 7 (`createBrowserRouter`, nested routes) |
| i18n | i18next, `react-i18next`, HTTP backend + language detector |
| Testing | Vitest 4, Testing Library, jsdom |
| Analytics | Vercel Analytics (client) |
| Icons | Lucide React |

---

## Architecture

### High-level layout

The app is a **client-side SPA** deployed as static assets. **Game rules and board generation** live in pure TypeScript (`helpers`, `constants`) so they stay testable without the DOM.

```
┌─────────────────────────────────────────────────────────┐
│ App (Router + SettingsContextProvider + Analytics)       │
│   Layout (header, shader background, outlet)              │
│     Start / Setup / Game routes                           │
└─────────────────────────────────────────────────────────┘
```

### State and game flow

Gameplay is orchestrated by **`useGameLogic`**, which combines:

1. **`useReducer`** with a **`gameReducer`** and explicit **phases** (`IDLE` → `ROLLING` → `PLAYING` → `CHECKING` → `TURN_REVIEW` / `ROUND_COMPARISON` / `GAME_SUMMARY`).
2. **`useTimer`** — countdown per turn; fires a dispatch when time expires.
3. **`useDice`** — animated roll; on settle, moves phase to `PLAYING` and starts the timer.
4. **`useDictionaryCheck`** — POST submitted words to the validation API; race-safe (latest request wins) and mount-guarded.

Side effects that must stay async (dictionary) are triggered in a **`useEffect`** when phase becomes `CHECKING`; results are applied with a `CHECK_DONE` action so the reducer stays the single source of truth for scores and history.

### UI decomposition

The **`<Game />`** route is intentionally thin: it reads **settings** from context, runs **`useGameLogic`**, and renders:

| Component | Role |
|-----------|------|
| `GameSidebar` | Word list for the current turn |
| `GamePlayfield` | Round info, roll control, letter selection, board |
| `GameResultsModal` | Turn results, round comparison, game summary |

Presentation is separated from flow; all **navigation between modal “views”** is derived from **reducer phase** (see `showModal` / `modalView` mapping in `useGameLogic`).

### Shared settings

**`SettingsContext`** holds match configuration (players, time limit, round limit, word-breaking). **`Setup`** writes these values from a form; **`Game`** syncs the **current round** back into context for UI such as the header “coins” indicator.

### Dictionary API

Words are validated via **`POST`** to the external **SJP Boggle validation** endpoint. The client uses **`VITE_SJP_API_KEY`** (see [Environment variables](#environment-variables)). *Any `VITE_*` variable is inlined into the browser bundle* — treat the key as **publicly visible** and scope it accordingly on the API side (rate limits, quotas).

The Vite dev server also defines a **`/api/validate-words` proxy** that can forward to the same upstream with a **server-side** `SJP_API_KEY` for local development; the hook must be pointed at that path if you want to use the proxy instead of calling the remote URL directly.

### Deployment (Vercel)

- **Build**: `tsc -b` then `vite build` → output under `dist/`.
- **`vercel.json`**: SPA fallback rewrites requests to `index.html`, excluding paths under **`/api/`** so future serverless routes are not swallowed by the SPA rule.
- **Static hosting** of the Vite app alongside optional **`api/`** routes if you add a serverless proxy later.

---

## Project structure

```
src/
  App.tsx                 # Router tree, analytics, settings provider wrapper
  Layout.tsx              # Shell, background shader, outlet
  main.tsx                # Entry + i18n bootstrap
  i18n.ts                 # i18next configuration
  contexts/               # React context for game settings
  components/
    Game/                 # Route view + sidebar, playfield, results modal
    Setup, Start, …       # Flow screens
    Modal, Button, Dice, …
  hooks/
    useGameLogic.tsx      # Reducer + effects + dice/timer/dictionary wiring
    useDice.tsx           # Roll animation + mount-safe timeouts
    useTimer.tsx          # Countdown with stable callback ref
    useDictionaryCheck.tsx
    useBackgroundShader.tsx
  utils/
    helpers.ts            # Board shuffle, adjacency, letter selection helpers
    constants.ts          # Dice faces, game mode keys
    types.ts              # Letter, Word, TurnHistoryEntry, …
public/
  locales/{en,pl}/      # JSON translation catalogs
```

Tests live next to components (`*.spec.tsx`) or as `useGameLogic.spec.tsx` beside the hook.

---

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| **`VITE_SJP_API_KEY`** | Client (bundled) | Bearer token for the dictionary validation API |
| **`SJP_API_KEY`** | Node (optional) | Used only if you configure Vite’s dev `server.proxy` to attach `Authorization` without exposing the key to the client |

Create a local **`.env`** (git-ignored) — do not commit secrets. Example:

```bash
VITE_SJP_API_KEY=your_token_here
```

For proxy-based local dev (see `vite.config.ts`), you may also set `SJP_API_KEY` **without** the `VITE_` prefix so it never ships to the browser.

---

## Scripts

```bash
npm install          # Dependencies
npm run dev          # Vite dev server (with optional API proxy)
npm run build        # Typecheck + production bundle
npm run preview      # Serve production build locally (static only)
npm run test         # Vitest (watch mode by default; use --run in CI)
npm run lint         # ESLint
```

---

## Routing

| Path | Screen |
|------|--------|
| `/` | Redirects to `/start` |
| `/start` | Mode selection |
| `/setup/:mode` | Game settings form |
| `/game/singlePlayer` | Single-player game |
| `/game/hotSeat` | Hot-seat multiplayer |
| `*` | Fallback redirect to `/start` |

`GameMode` constants in `src/utils/constants.ts` define path segments and reserved keys (e.g. future `online`).

---

## Testing

- **Vitest** with **jsdom** and shared setup in `src/utils/setupTests.ts`.
- Component tests use **Testing Library**; i18n may log warnings in tests unless a full i18n provider is added — queries can target stable **roles** and **accessible names** where needed.

CI-style run:

```bash
npm run test -- --run
```

---

## Security and operations notes

- **`VITE_*` secrets are not secret** from users who download your JavaScript. Prefer API keys that are restricted by origin, rate limit, or usage caps.
- Dictionary failures: `useGameLogic` falls back to **zero points** per word when the API returns nothing, so turns still close and history stays consistent.
- **`npm run preview`** serves the built SPA only; it does not run Vercel serverless handlers. Full-stack checks need **Vercel** (or **`vercel dev`**) if you introduce `/api` routes.

---

## License

This project is **private** (`"private": true` in `package.json`). Add a license file if you open-source the repository.
