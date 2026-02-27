import Dice from "../Dice/Dice";

import type { Letter } from "../../utils/types";
import { memo } from "react";

interface DiceboardProps {
  letters: Letter[];
  invalidLetterId: string;
  selectedLettersIds: string[];
  disabled?: boolean;
  onLetterSelect: (letter: Letter, isSelected: boolean) => void;
}

export default memo(function Diceboard({
  invalidLetterId,
  disabled,
  letters,
  onLetterSelect,
  selectedLettersIds,
}: DiceboardProps) {
  const checkIfSelected = (id: string): boolean =>
    selectedLettersIds?.some((letterId: string) => letterId === id);

  const template = letters.map((letter, index) => {
    const isSelected = checkIfSelected(letter.id);
    return (
      <Dice
        isSelected={isSelected}
        wasInvalid={letter.id === invalidLetterId}
        key={letter.id ?? index}
        onLetterSelect={() => onLetterSelect(letter, isSelected)}
        value={letter.val}
      />
    );
  });

  return (
    <div
      className={`grid grid-cols-4 gap-2 aspect-square transition-opacity duration-300 ${disabled ? "opacity-50  pointer-events-none" : ""}`}
    >
      {template}
    </div>
  );
});
