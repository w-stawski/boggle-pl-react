import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SettingsContext } from "../../contexts/SettingsContext";
import { GameMode } from "../../utils/constants";
import Button from "../Button/Button";
import { Settings2, Timer, Repeat, Hash, Check } from "lucide-react";

export default function Setup() {
  const { mode } = useParams<{ mode: GameMode }>();
  const {
    setRoundLimit,
    setTimeLimit,
    setIsWordBreakingAllowed,
    setNumberOfPlayers,
  } = useContext(SettingsContext);

  const navigate = useNavigate();
  const isLocal = mode === GameMode.single || mode === GameMode.hotseat;

  // Updated handler to prevent default browser behavior
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const timeLimit = formData.get("time-limit");
    const roundLimit = formData.get("round-limit");
    const allowWordBreaking = formData.get("allow-word-breaking");
    const numberOfPlayers = formData.get("player-count");

    setTimeLimit(Number(timeLimit));
    setRoundLimit(Number(roundLimit));
    setIsWordBreakingAllowed(!!allowWordBreaking);
    setNumberOfPlayers(Number(numberOfPlayers));

    navigate(`/game/${mode}`);
  };

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-y-auto bg-[#FFDE00] p-4 font-mono sm:p-6">
      <div className="absolute inset-0 z-0 [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

      <main className="z-10 flex w-full max-w-lg flex-col items-center">
        {/* Header Label */}
        <div className="mb-6 inline-block rotate-[1deg] border-4 border-black bg-white px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:mb-8 sm:px-6 sm:py-2 sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="flex items-center gap-2 text-xl font-black text-black uppercase sm:text-2xl">
            <Settings2 size={24} /> {mode} Setup
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 border-4 border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:gap-6 sm:p-8 sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        >
          {isLocal && (
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Time Limit */}
                <div className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2 text-[10px] font-black text-black uppercase"
                    htmlFor="time-limit"
                  >
                    <Timer size={14} /> Time (sec)
                  </label>
                  <input
                    className="h-12 border-4 border-black bg-zinc-100 px-3 text-xl font-black outline-none focus:bg-[#00FF66]"
                    name="time-limit"
                    id="time-limit"
                    type="number"
                    defaultValue={90}
                  />
                </div>

                {/* Round Limit */}
                <div className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2 text-[10px] font-black text-black uppercase"
                    htmlFor="round-limit"
                  >
                    <Repeat size={14} /> Rounds
                  </label>
                  <input
                    className="h-12 border-4 border-black bg-zinc-100 px-3 text-xl font-black outline-none focus:bg-[#FF00FF] focus:text-white"
                    name="round-limit"
                    id="round-limit"
                    type="number"
                    defaultValue={5}
                  />
                </div>
              </div>

              {/* Player Count (Only for Hotseat) */}
              {mode === GameMode.hotseat && (
                <div className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2 text-[10px] font-black text-black uppercase"
                    htmlFor="player-count"
                  >
                    <Hash size={14} /> Players
                  </label>
                  <input
                    className="h-12 border-4 border-black bg-zinc-100 px-3 text-xl font-black outline-none focus:bg-cyan-400"
                    name="player-count"
                    id="player-count"
                    type="number"
                    min={2}
                    defaultValue={2}
                  />
                </div>
              )}

              {/* Checkbox: Allow Word Breaking */}
              <div className="flex items-center gap-3 border-4 border-black bg-black p-3 transition-all hover:bg-zinc-900">
                <div className="relative flex items-center">
                  <input
                    className="peer h-6 w-6 cursor-pointer appearance-none border-2 border-white bg-white checked:bg-[#00FF66]"
                    name="allow-word-breaking"
                    id="allow-word-breaking"
                    type="checkbox"
                  />
                  <Check className="pointer-events-none absolute top-0 left-0 hidden h-6 w-6 text-black peer-checked:block" />
                </div>
                <label
                  className="cursor-pointer text-sm font-black text-white uppercase sm:text-base"
                  htmlFor="allow-word-breaking"
                >
                  Allow word breaking?
                </label>
              </div>

              {/* Start Button - Ensure type="submit" */}
              <Button
                type="submit"
                className="mt-2 flex h-16 w-full items-center justify-center border-4 border-black bg-[#00FF66] text-2xl font-black text-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-white sm:h-20 sm:text-3xl"
              >
                Ready? Start!
              </Button>
            </div>
          )}
        </form>

        <p className="mt-4 text-center text-[10px] font-black tracking-widest text-black uppercase sm:mt-6 sm:text-xs">
          Confirm settings to initialize game sequence
        </p>
      </main>
    </div>
  );
}
