import { Timer, Hash, User } from "lucide-react";

export default function GameInfo({
  currentPlayer,
  round,
  seconds,
}: {
  currentPlayer: number | null;
  round: number;
  seconds: number;
}) {
  const isUrgent = seconds > 0 && seconds < 10;

  return (
    <header className="flex w-full items-center justify-between gap-2 leading-none font-black uppercase italic">
      {/* Left Side: Round and Player */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 border-2 border-black bg-white px-3 py-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
          <Hash size={14} strokeWidth={3} className="shrink-0" />
          <span className="text-xs sm:text-sm">RND: {round}</span>
        </div>

        {currentPlayer && (
          <div className="flex items-center gap-1.5 border-2 border-black bg-[#00FF66] px-3 py-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
            <User size={14} strokeWidth={3} className="shrink-0" />
            <span className="text-xs sm:text-sm">P{currentPlayer}</span>
          </div>
        )}
      </div>

      {/* Right Side: Timer */}
      <div
        className={`flex items-center justify-center gap-2 border-2 border-black px-3 py-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all duration-200 ${!seconds ? "bg-zinc-200 text-zinc-500 opacity-50" : "text-black"} ${isUrgent ? "animate-pulse-bg ring-4 ring-red-500/20 ring-inset" : "bg-white"} `}
      >
        <Timer size={14} strokeWidth={3} className="mb-1 shrink-0" />
        <span className="text-xs tabular-nums sm:text-sm">
          {seconds > 0 ? `${seconds} s` : "00 s"}
        </span>
      </div>
    </header>
  );
}
