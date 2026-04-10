# Ploggle

**Ploggle** is a Boggle-inspired word game specifically designed for the **Polish language**. I built this project to fill a gap in the market—since no high-quality Boggle clones exist for Polish speakers—while showcasing proficiency in **React** and modern frontend tooling.

[**Play Live on Vercel**](https://boggle-pl-react.vercel.app/)

> **Status:** 🚧 Work in Progress

## The Ecosystem
Because there was no existing public API to validate words against the official Polish SJP dictionary (essential for games like Scrabble or Boggle), I built and maintain the backend for this project:
* **[sjp-check-api](https://github.com/w-stawski/sjp-check-api):** A dedicated API that checks Polish word validity and provides definitions.

## Key Features
* **Polish Alphabet Support:** Fully integrated with native characters (ą, ć, ę, etc.).
* **Custom API Integration:** Real-time word validation via the custom SJP-check-api.
* **Responsive UI:** Built for both desktop and mobile play.
* **Localization:** Multi-language support via `i18next`.

## Tech Stack
* **Frontend:** React + TypeScript + Vite
* **Styling:** Tailwind CSS
* **State/Routing:** React Router
* **Testing:** Vitest + Testing Library
* **Backend:** Node.js (via custom SJP API)

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Setup:**
    Create a `.env` file and add your dictionary API key:
    ```bash
    VITE_SJP_API_KEY=your_token_here
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Available Scripts
| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the production-ready bundle |
| `npm run build:profile` | Builds a profiling-enabled production bundle (for React DevTools Profiler) |
| `npm run test` | Runs the test suite via Vitest |
| `npm run lint` | Checks for code quality and style issues |

## Observability (Vercel)

- Vercel **Analytics** and **Speed Insights** are integrated in the app (`src/App.tsx`).
- Enable them in your Vercel project to see metrics in the dashboard.

## Roadmap
- [ ] **Next.js Rewrite:** Transition to App Router for improved SEO and performance.
- [ ] **Multiplayer:** Add real-time online rooms and "Hot-seat" mode improvements.
- [ ] **Social:** Global leaderboards and user profiles.
- [ ] **UX:** Enhanced keyboard navigation and ARIA accessibility.
