import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SettingsContext } from "../../contexts/SettingsContext";
import { GameMode } from "../../utils/constants";
import Button from "../Button/Button";
import { Settings2, Timer, Repeat, Hash } from "lucide-react";

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
    <div className="relative flex flex-1 w-full flex-col items-center justify-center overflow-y-auto bg-[#FFDE00] p-4 font-mono sm:p-6">
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-size-[20px_20px]" />

      <div className="z-10 flex w-full max-w-lg flex-col items-center">
        {/* Header Label */}
        <div className="mb-6 inline-block rotate-1 border-4 border-black bg-white px-4 py-1.5 shadow-[4px_4px_0_0_#000] sm:mb-8 sm:px-6 sm:py-2 sm:shadow-[6px_6px_0_0_#000]">
          <h1 className="flex items-center gap-2 text-xl font-black uppercase text-black sm:text-2xl">
            <Settings2 size={24} /> {mode} settings
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000] sm:gap-6 sm:p-8 sm:shadow-[12px_12px_0_0_#000]"
        >
          {isLocal && (
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Time Limit */}
                <div className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-black"
                    htmlFor="time-limit"
                  >
                    <Timer size={14} /> Time (sec)
                  </label>
                  <input
                    className="h-12 border-4 border-black bg-zinc-100 px-3 text-xl font-black outline-none focus:bg-[#00FF66]"
                    name="time-limit"
                    id="time-limit"
                    type="number"
                    min={5}
                    defaultValue={90}
                  />
                </div>

                {/* Round Limit */}
                <div className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-black"
                    htmlFor="round-limit"
                  >
                    <Repeat size={14} /> Rounds
                  </label>
                  <input
                    className="h-12 border-4 border-black bg-zinc-100 px-3 text-xl font-black outline-none focus:bg-[#FF00FF] focus:text-white"
                    name="round-limit"
                    id="round-limit"
                    type="number"
                    min={1}
                    defaultValue={5}
                  />
                </div>
              </div>

              {/* Player Count (Only for Hotseat) */}
              {mode === GameMode.hotseat && (
                <div className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-black"
                    htmlFor="player-count"
                  >
                    <Hash size={14} /> Players
                  </label>
                  <input
                    className="h-12 border-4 border-black bg-zinc-100 px-3 text-xl font-black outline-none focus:bg-[#FFDE00]"
                    name="player-count"
                    id="player-count"
                    type="number"
                    min={2}
                    defaultValue={2}
                  />
                </div>
              )}

              {/* Word Breaking Toggle */}
              <div className="flex items-center justify-between border-4 border-black bg-zinc-50 px-3 py-1">
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-black">
                    Word Breaking
                  </span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="allow-word-breaking"
                    className="peer sr-only"
                  />
                  <div className="h-8 w-14 border-4 border-black bg-white transition-colors peer-checked:bg-[#00FF66]" />
                  <div className="absolute left-1.5 top-1.5 h-5 w-3 border-2 border-black bg-black transition-transform peer-checked:translate-x-6" />
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-3 border-4 border-black bg-[#FFDE00] text-xl font-black uppercase shadow-[6px_6px_0_0_#000] transition-all hover:translate-1 hover:shadow-none active:bg-white sm:h-16 sm:text-2xl"
          >
            Start Game
          </Button>
        </form>
      </div>
    </div>
  );
}
