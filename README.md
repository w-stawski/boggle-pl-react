# Ploggle

**Ploggle** is a Boggle-inspired word game specifically designed for the **Polish language**. I built this project to fill a gap in the market—since no Boggle clones exist for Polish speakers—while showcasing proficiency in **React** and modern frontend tooling.

[**Play Live on Vercel**](https://boggle-pl-react.vercel.app/)

> **Status:** 🚧 Work in Progress

## Key Features
* **Polish Language Support:** Fully integrated with Polish characters and a dedicated SJP dictionary API.
* **Responsive UI:** Built for both desktop and mobile play.
* **Localization:** Multi-language support via `i18next`.

## Tech Stack
* **Core:** React + TypeScript + Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router
* **Testing:** Vitest + Testing Library
* **Localization:** i18next / react-i18next

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Setup:**
    Create a `.env` file in the root and add your dictionary API key:
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
| `npm run test` | Runs the test suite via Vitest |
| `npm run lint` | Checks for code quality and style issues |

## Roadmap
- [ ] **Next.js Rewrite:** Transition to App Router for improved SEO and performance.
- [ ] **Multiplayer:** Add real-time online rooms and "Hot-seat" mode improvements.
- [ ] **Social:** Global leaderboards and user profiles.
- [ ] **UX:** Enhanced keyboard navigation and ARIA accessibility.
- [ ] **Polish:** Refined animations and edge-case handling for word verification.
