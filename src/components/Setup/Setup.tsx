import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SettingsContext } from "../../contexts/SettingsContext";
import { GameMode } from "../../utils/constants";
import Button from "../Button/Button";

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
    <div className="flex items-center justify-center">
      <form
        action={onSubmit}
        className="text-paper-white flex w-xl flex-col gap-5 px-5 pt-20 text-3xl"
      >
        {isLocal && (
          <>
            <label className="text-center underline" htmlFor="time-limit">
              Time limit (sec):
            </label>
            <input
              className="text-center"
              name="time-limit"
              id="time-limit"
              type="number"
              defaultValue={90}
            />
            <label className="text-center underline" htmlFor="round-limit">
              Round limit:
            </label>
            <input
              className="text-center"
              name="round-limit"
              id="round-limit"
              type="number"
              defaultValue={5}
            />
            <label className="text-center underline" htmlFor="round-limit">
              Allow word breaking ?
            </label>
            <input
              name="allow-word-breaking"
              id="allow-word-breaking"
              type="checkbox"
            />
            {mode === GameMode.hotseat && (
              <>
                <label className="text-center underline" htmlFor="player-count">
                  Number of Players:
                </label>
                <input
                  className="text-center"
                  name="player-count"
                  id="player-count"
                  type="number"
                  min={2}
                  defaultValue={2}
                />
              </>
            )}
            <Button className="bg-ui-tertiary mt-2 text-black">START</Button>
          </>
        )}
      </form>
    </div>
  );
}
