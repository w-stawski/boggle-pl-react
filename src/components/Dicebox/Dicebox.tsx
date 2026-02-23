import Dice from "../Dice/Dice";
import "./Dicebox.css";
import type { Letter } from "../../utils/types";

export default function Dicebox({
  letters,
  onLetterSelect,
  selectedLettersIds,
}: {
  letters: Letter[];
  onLetterSelect: (letter: Letter) => void;
  selectedLettersIds: string[];
}) {
  const checkIfSelected = (id: string): boolean =>
    !!selectedLettersIds?.find((letterId: string) => letterId === id);

  return (
    <div className="dicebox-container">
      {letters.map((letter, index) => (
        <Dice
          isSelected={checkIfSelected(letter.id)}
          key={index}
          onLetterSelect={() => onLetterSelect(letter)}
          value={letter.val}
        />
      ))}
    </div>
  );
}
