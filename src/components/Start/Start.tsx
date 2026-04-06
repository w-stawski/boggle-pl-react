import { HelpCircle, Sword, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { GameMode } from "../../utils/constants";
import Button from "../Button/Button";

export default function Start() {
  const { t, i18n, ready } = useTranslation();

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#FFDE00] p-4 font-mono sm:p-6">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-size-[20px_20px] opacity-10" />

      {/* Main Container */}
      <div className="z-10 flex w-full max-w-md flex-col items-center justify-center">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 flex gap-2 sm:top-6 sm:right-6">
          {["en", "pl"].map((lang) => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              type="button"
              aria-pressed={i18n.language === lang}
              aria-label={`Change language to ${lang}`}
              className={`flex h-10 w-10 items-center justify-center border-2 border-black font-black uppercase shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                i18n.language === lang ? "bg-[#00FF66]" : "bg-white"
              } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFDE00]`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-block -rotate-2 border-4 border-black bg-black px-6 py-3 shadow-[8px_8px_0_0_#fff]">
            <h1 className="text-4xl font-black tracking-tighter text-white italic sm:text-5xl">
              PL<span className="text-[#FFDE00]">OGGLE</span>
            </h1>
          </div>
          <p className="mt-4 h-5 text-xs font-bold tracking-[0.2em] text-black uppercase sm:text-sm">
            {ready ? t("start.selectMode") : "..."}
          </p>
        </div>
        <nav className="flex w-full flex-col gap-4 sm:gap-6">
          <Link
            className="group w-full transform transition-transform active:translate-y-1"
            to={`/setup/${GameMode.single}`}
          >
            <Button className="flex h-16 w-full items-center justify-between border-4 border-black bg-[#00FF66] px-6 text-lg font-black text-black uppercase shadow-[6px_6px_0_0_#000] hover:translate-1 hover:shadow-none sm:h-20 sm:text-xl sm:shadow-[8px_8px_0_0_#000]">
              <span className="flex items-center gap-3">
                <Zap fill="black" size={20} />{" "}
                {ready ? t("singlePlayer") : "..."}
              </span>
              <span className="text-2xl">→</span>
            </Button>
          </Link>

          <Link
            className="group w-full transform transition-transform active:translate-y-1"
            to={`/setup/${GameMode.hotseat}`}
          >
            <Button className="flex h-16 w-full items-center justify-between border-4 border-black bg-[#FF00FF] px-6 text-lg font-black text-black uppercase shadow-[6px_6px_0_0_#000] hover:translate-1 hover:shadow-none sm:h-20 sm:text-xl sm:shadow-[8px_8px_0_0_#000]">
              <span className="flex items-center gap-3">
                <Users fill="black" size={20} /> {ready ? t("hotSeat") : "..."}
              </span>
              <span className="text-2xl">→</span>
            </Button>
          </Link>

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
          <a
            className="mt-2 flex w-full items-center justify-center gap-2 border-4 border-black bg-white py-3 font-black uppercase shadow-[4px_4px_0_0_#000] transition-all hover:bg-black hover:text-white active:translate-y-1 active:shadow-none sm:mt-4"
            href="https://www.youtube.com/watch?v=BJAdXnGAb7k"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="How to play (opens in a new tab)"
          >
            <HelpCircle size={18} />
            {ready ? t("start.howToPlay") : "..."}
          </a>
        </nav>
      </div>
    </div>
  );
}
