import { useNavigate, useParams } from "react-router-dom";
import { GameMode } from "../../utils/constants";
import Button from "../Button/Button";
import { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

export default function Setup() {
  const { mode } = useParams<{ mode: GameMode }>();
  const { setRoundLimit, setTimeLimit, setIsWordBreakingAllowed } =
    useContext(SettingsContext);
  const navigate = useNavigate();
  const onSubmit = (formData: FormData) => {
    const timeLimit = formData.get("time-limit");
    const roundLimit = formData.get("round-limit");
    const allowWordBreaking = formData.get("allow-word-breaking");

    setTimeLimit(Number(timeLimit));
    setRoundLimit(Number(roundLimit));
    setIsWordBreakingAllowed(!!allowWordBreaking);

    navigate(`/game/${mode}`);
  };
  return (
    <div className="flex justify-center items-center">
      <form
        action={onSubmit}
        className="flex flex-col pt-20 px-5 w-xl gap-5 text-3xl"
      >
        {mode === GameMode.single && (
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

            <Button className="bg-ui-tertiary mt-2">START</Button>
          </>
        )}
      </form>
    </div>
  );
}
