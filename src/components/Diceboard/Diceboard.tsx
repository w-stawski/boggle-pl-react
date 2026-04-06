import Dice from "../Dice/Dice";

import type { Letter } from "../../utils/types";
import { memo, useCallback } from "react";

type DiceboardProps = {
  letters: Letter[];
  invalidLetterId: string;
  selectedLettersIds: string[];
  disabled?: boolean;
  onLetterSelect: (letter: Letter, isSelected: boolean) => void;
};

export default memo(function Diceboard({
  invalidLetterId,
  disabled,
  letters,
  onLetterSelect,
  selectedLettersIds,
}: DiceboardProps) {
  const onGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const key = e.key;
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const indexAttr = target.getAttribute("data-index");
      if (!indexAttr) return;

      const currentIndex = Number(indexAttr);
      if (!Number.isFinite(currentIndex)) return;

      const cols = 4;
      const rows = 4;

      let nextIndex = currentIndex;
      if (key === "ArrowLeft") nextIndex = currentIndex - 1;
      if (key === "ArrowRight") nextIndex = currentIndex + 1;
      if (key === "ArrowUp") nextIndex = currentIndex - cols;
      if (key === "ArrowDown") nextIndex = currentIndex + cols;

      if (nextIndex < 0 || nextIndex >= cols * rows) return;

      e.preventDefault();

      const container = e.currentTarget as HTMLElement;
      const next = container.querySelector(
        `button[data-dice="true"][data-index="${nextIndex}"]`,
      ) as HTMLButtonElement | null;

      next?.focus();
    },
    [],
  );

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
        index={index}
      />
    );
  });

  return (
    <section aria-label="Letter grid">
      <p id="diceboard-instructions" className="sr-only">
        Use Tab to move through letters. Use arrow keys to move within the 4 by
        4 grid. Press Enter or Space to select a letter.
      </p>
      <div
        role="grid"
        aria-rowcount={4}
        aria-colcount={4}
        aria-disabled={disabled ? true : undefined}
        aria-describedby="diceboard-instructions"
        onKeyDown={onGridKeyDown}
        className={`grid aspect-square grid-cols-4 gap-2 transition-opacity duration-300 ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        {template}
      </div>
    </section>
  );
});
