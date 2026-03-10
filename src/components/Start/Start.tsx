import { Link } from "react-router";
import Button from "../Button/Button";
import { GameMode } from "../../utils/constants";
import { Sword, Users, Zap, HelpCircle } from "lucide-react";

export default function Start() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FFDE00] p-6 font-mono">
      {/* Retro Grid Background Overlay */}
      <div className="absolute inset-0 z-0 [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

      <main className="z-10 w-full max-w-md">
        {/* Playful Floating Title */}
        <div className="mb-12 text-center">
          <div className="inline-block rotate-[-2deg] bg-black px-4 py-2 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h1 className="text-5xl font-black tracking-tighter text-white italic">
              PL<span className="text-[#FFDE00]">OGGLE</span>
            </h1>
          </div>
          <p className="mt-4 text-sm font-bold tracking-widest text-black uppercase">
            Press Start to Play
          </p>
        </div>

        <nav className="flex flex-col gap-6">
          {/* Single Player - High Contrast Green */}
          <Link
            className="w-full transform transition-transform active:translate-y-1"
            to={`/setup/${GameMode.single}`}
          >
            <Button className="flex h-20 w-full items-center justify-between border-4 border-black bg-[#00FF66] px-6 text-xl font-black text-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <span className="flex items-center gap-3">
                <Zap fill="black" /> Single Player
              </span>
              <span className="text-2xl">→</span>
            </Button>
          </Link>

          {/* Multiplayer - High Contrast Pink */}
          <Link
            className="w-full transform transition-transform active:translate-y-1"
            to={`/setup/${GameMode.hotseat}`}
          >
            <Button className="flex h-20 w-full items-center justify-between border-4 border-black bg-[#FF00FF] px-6 text-xl font-black text-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <span className="flex items-center gap-3">
                <Users fill="black" /> Hotseat Mode
              </span>
              <span className="text-2xl">→</span>
            </Button>
          </Link>

          {/* Online - Disabled / Grayed out */}
          <div className="w-full opacity-40">
            <Button
              disabled
              className="flex h-20 w-full items-center justify-between border-4 border-black bg-white px-6 text-xl font-black text-zinc-400 uppercase"
            >
              <span className="flex items-center gap-3 italic underline">
                Online Battle
              </span>
              <Sword size={24} />
            </Button>
          </div>

          {/* Help Link styled as a retro button */}
          <a
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-white py-2 font-bold transition-all hover:bg-black hover:text-white"
            href="https://www.youtube.com/watch?v=BJAdXnGAb7k"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HelpCircle size={18} />
            How to Play?
          </a>
        </nav>
      </main>
    </div>
  );
}
