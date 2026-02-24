import Dice from "../Dice/Dice";
import "./Dicebox.css";
import type { Letter } from "../../utils/types";

export default function Dicebox({
  letters,
  onLetterSelect,
  selectedLettersIds,
  invalidLetterId,
}: {
  letters: Letter[];
  onLetterSelect: (letter: Letter) => void;
  selectedLettersIds: string[];
  invalidLetterId: string;
}) {
  const checkIfSelected = (id: string): boolean =>
    !!selectedLettersIds?.find((letterId: string) => letterId === id);

  return (
    <div className="dicebox-container">
      {letters.map((letter, index) => (
        <Dice
          isSelected={checkIfSelected(letter.id)}
          wasInvalid={letter.id === invalidLetterId}
          key={letter.id ?? index}
          onLetterSelect={() => onLetterSelect(letter)}
          // todo: change back to value
          value={letter.val}
        />
      ))}
    </div>
  );
}
