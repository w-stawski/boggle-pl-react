import Dice from "../Dice/Dice";

import type { Letter } from "../../utils/types";
import { memo } from "react";

interface DiceboardProps {
  letters: Letter[];
  invalidLetterId: string;
  selectedLettersIds: string[];
  isDisabled?: boolean;
  onLetterSelect: (letter: Letter) => void;
}

export default memo(function Diceboard({
  invalidLetterId,
  isDisabled,
  letters,
  onLetterSelect,
  selectedLettersIds,
}: DiceboardProps) {
  const checkIfSelected = (id: string): boolean =>
    selectedLettersIds?.some((letterId: string) => letterId === id);

  return (
    <div
      className={`grid grid-cols-4 gap-2 aspect-square transition-opacity duration-300 ${isDisabled ? "opacity-50  pointer-events-none" : ""}`}
    >
      {letters.map((letter, index) => (
        <Dice
          isSelected={checkIfSelected(letter.id)}
          wasInvalid={letter.id === invalidLetterId}
          key={letter.id ?? index}
          onLetterSelect={() => onLetterSelect(letter)}
          value={letter.val} // todo: change back to value
        />
      ))}
    </div>
  );
});
