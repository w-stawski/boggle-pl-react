import { Link } from "react-router";
import Button from "../Button/Button";
import { GameMode } from "../../utils/constants";
import { Sword, Users, Zap, HelpCircle } from "lucide-react";

export default function Start() {
  return (
    /* Changed min-h-screen to a fixed calc height to fit exactly between header and footer */
    <div className="relative flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden bg-[#FFDE00] p-4 font-mono sm:p-6">
      {/* Retro Grid Background Overlay - absolute so it doesn't affect flow */}
      <div className="absolute inset-0 z-0 [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

      {/* Main Container with flex-shrink to prevent pushing off-screen */}
      <div className="z-10 flex w-full max-w-md flex-col items-center justify-center">
        {/* Playful Floating Title - Reduced margins for better fit */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-block rotate-[-2deg] border-4 border-black bg-black px-6 py-3 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h1 className="text-4xl font-black tracking-tighter text-white italic sm:text-5xl">
              PL<span className="text-[#FFDE00]">OGGLE</span>
            </h1>
          </div>
          <p className="mt-4 text-xs font-bold tracking-[0.2em] text-black uppercase sm:text-sm">
            Press Start to Play
          </p>
        </div>

        {/* Navigation - Uses gap that scales with screen size */}
        <nav className="flex w-full flex-col gap-4 sm:gap-6">
          {/* Single Player - High Contrast Green */}
          <Link
            className="w-full transform transition-transform active:translate-y-1"
            to={`/setup/${GameMode.single}`}
          >
            <Button className="flex h-16 w-full items-center justify-between border-4 border-black bg-[#00FF66] px-6 text-lg font-black text-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:h-20 sm:text-xl sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <span className="flex items-center gap-3">
                <Zap fill="black" size={20} /> Single Player
              </span>
              <span className="text-2xl">→</span>
            </Button>
          </Link>

          {/* Multiplayer - High Contrast Pink */}
          <Link
            className="w-full transform transition-transform active:translate-y-1"
            to={`/setup/${GameMode.hotseat}`}
          >
            <Button className="flex h-16 w-full items-center justify-between border-4 border-black bg-[#FF00FF] px-6 text-lg font-black text-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:h-20 sm:text-xl sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <span className="flex items-center gap-3">
                <Users fill="black" size={20} /> Hotseat Mode
              </span>
              <span className="text-2xl">→</span>
            </Button>
          </Link>

          {/* Online - Disabled / Grayed out */}
          <div className="w-full opacity-40">
            <Button
              disabled
              className="flex h-16 w-full items-center justify-between border-4 border-black bg-white px-6 text-lg font-black text-zinc-400 uppercase sm:h-20 sm:text-xl"
            >
              <span className="flex items-center gap-3 italic underline">
                Online Battle
              </span>
              <Sword size={20} />
            </Button>
          </div>

          {/* Help Link - Lowered height for mobile */}
          <a
            className="mt-2 flex w-full items-center justify-center gap-2 border-4 border-black bg-white py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-black hover:text-white active:translate-y-1 active:shadow-none sm:mt-4"
            href="https://www.youtube.com/watch?v=BJAdXnGAb7k"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HelpCircle size={18} />
            How to Play?
          </a>
        </nav>
      </div>
    </div>
  );
}
