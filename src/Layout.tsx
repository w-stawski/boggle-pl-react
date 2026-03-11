"use client";

import { Link, Outlet, useLocation } from "react-router-dom";
import { SettingsContext } from "./contexts/SettingsContext";
import { useContext } from "react";
import { Layers } from "lucide-react";
import { useBackgroundShader } from "./hooks/useBackgroundShader";

export default function Layout() {
  // Extract background animation logic into a custom hook for cleaner component code.
  const canvasRef = useBackgroundShader();
  const settings = useContext(SettingsContext);
  const location = useLocation();

  // If the user is on a game page, show the actual rounds count from settings, otherwise show 99.
  const isGamePage = location.pathname.startsWith("/game");
  const coinsNum = isGamePage && settings ? settings.roundLimit - settings.currentRound : 99;

  return (
    <div className="flex min-h-screen flex-col font-mono selection:bg-black selection:text-white">
      {/* BACKGROUND LAYER: Decorative WebGL canvas and retro grid */}
      <div className="fixed inset-0 z-0 bg-[#FFDE00]">
        <canvas
          ref={canvasRef}
          className="h-full w-full opacity-25"
          aria-hidden="true" // Hide from screen readers as it's purely decorative.
        />
        <div className="absolute inset-0 [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      {/* HEADER: Sticky navigation bar with branding and status */}
      <header className="sticky top-0 z-50 w-full border-b-3 border-black bg-white px-6 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between">
          <Link
            to="/start"
            className="group transition-transform active:scale-95"
            aria-label="Back to home" // Explicit label for screen readers.
          >
            <div className="relative rotate-[-1deg] border-2 border-black bg-black px-4 py-1.5 shadow-[5px_5px_0_0_#FFDE00]">
              <p className="text-l font-black tracking-tighter uppercase italic">
                <span className="text-white">PL</span>
                <span className="text-[#FFDE00]">OGGLE</span>
              </p>
            </div>
          </Link>

          {/* Rounds Display */}
          <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-1 text-xs font-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
            <Layers size={14} />
            <span>
              COINS: {coinsNum}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA: Central outlet for routed components */}
      <main className="relative z-10 grow">
        <Outlet />
      </main>
    </div>
  );
}
