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

  const onSubmit = (formData: FormData) => {
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FFDE00] p-6 font-mono">
      {/* Retro Grid Overlay */}
      <div className="absolute inset-0 z-0 [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

      <main className="z-10 w-full max-w-xl">
        {/* Header Label */}
        <div className="mb-10 inline-block rotate-[1deg] border-4 border-black bg-white px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="flex items-center gap-3 text-3xl font-black text-black uppercase">
            <Settings2 size={32} /> {mode} Setup
          </h1>
        </div>

        <form
          action={onSubmit}
          className="flex flex-col gap-6 rounded-none border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        >
          {isLocal && (
            <div className="flex flex-col gap-8">
              {/* Time Limit */}
              <div className="flex flex-col gap-2">
                <label
                  className="flex items-center gap-2 text-sm font-black tracking-tight text-black uppercase"
                  htmlFor="time-limit"
                >
                  <Timer size={18} /> Time limit (seconds):
                </label>
                <input
                  className="h-14 border-4 border-black bg-zinc-100 px-4 text-2xl font-black transition-colors outline-none focus:bg-[#00FF66]"
                  name="time-limit"
                  id="time-limit"
                  type="number"
                  defaultValue={90}
                />
              </div>

              {/* Round Limit */}
              <div className="flex flex-col gap-2">
                <label
                  className="flex items-center gap-2 text-sm font-black tracking-tight text-black uppercase"
                  htmlFor="round-limit"
                >
                  <Repeat size={18} /> Round limit:
                </label>
                <input
                  className="h-14 border-4 border-black bg-zinc-100 px-4 text-2xl font-black transition-colors outline-none focus:bg-[#FF00FF] focus:text-white"
                  name="round-limit"
                  id="round-limit"
                  type="number"
                  defaultValue={5}
                />
              </div>

              {/* Player Count (Only for Hotseat) */}
              {mode === GameMode.hotseat && (
                <div className="flex flex-col gap-2">
                  <label
                    className="flex items-center gap-2 text-sm font-black tracking-tight text-black uppercase"
                    htmlFor="player-count"
                  >
                    <Hash size={18} /> Number of Players:
                  </label>
                  <input
                    className="h-14 border-4 border-black bg-zinc-100 px-4 text-2xl font-black transition-colors outline-none focus:bg-cyan-400"
                    name="player-count"
                    id="player-count"
                    type="number"
                    min={2}
                    defaultValue={2}
                  />
                </div>
              )}

              {/* Checkbox: Allow Word Breaking */}
              <div className="flex items-center gap-4 border-4 border-black bg-black p-4 transition-all hover:bg-zinc-800">
                <input
                  className="h-8 w-8 cursor-pointer border-4 border-white bg-white accent-[#00FF66]"
                  name="allow-word-breaking"
                  id="allow-word-breaking"
                  type="checkbox"
                />
                <label
                  className="cursor-pointer text-lg font-black text-white uppercase"
                  htmlFor="allow-word-breaking"
                >
                  Allow word breaking?
                </label>
              </div>

              {/* Start Button */}
              <Button className="mt-4 flex h-20 w-full items-center justify-center border-4 border-black bg-[#00FF66] text-3xl font-black text-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-white">
                Ready? Start!
              </Button>
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-xs font-black tracking-widest text-black uppercase">
          Confirm settings to initialize game sequence
        </p>
      </main>
    </div>
  );
}
