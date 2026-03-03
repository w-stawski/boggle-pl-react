import { useState } from "react";
import { getDiceRandomValues } from "../utils/helpers";
import type { Letter } from "../utils/types";

type useDiceType = { diceValues: Letter[]; rollDice: (repeat: number) => void };

export const useDice = (onDiceRollEndFn: () => void): useDiceType => {
  const [diceValues, setDiceValues] = useState<Letter[]>(getDiceRandomValues());

  const rollDice = (repeat: number): void => {
    setDiceValues(getDiceRandomValues());

    if (repeat) {
      setTimeout(() => rollDice(--repeat), 50);
      return;
    }

    onDiceRollEndFn();
  };

  return { diceValues, rollDice };
};
