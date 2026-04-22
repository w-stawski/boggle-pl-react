import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDiceRandomValues } from "../utils/helpers";
import type { Letter } from "../utils/types";

type useDiceType = { diceValues: Letter[]; rollDice: (repeat: number) => void };

/**
 * Custom hook to manage the dice rolling animation and logic.
 * Handles recursive timeouts and ensures no state updates occur after unmount.
 */

export const useDice = (
  onDiceRollEndFn: () => void,
  language: string,
): useDiceType => {
  const [diceValues, setDiceValues] = useState<Letter[]>(
    getDiceRandomValues(language),
  );
  // Tracks if the component is still mounted to prevent memory leaks and React warnings.
  const isMounted = useRef(false);
  const onDiceRollEndFnRef = useRef(onDiceRollEndFn);

  // Keep the ref in sync with the latest callback
  useEffect(() => {
    onDiceRollEndFnRef.current = onDiceRollEndFn;
  }, [onDiceRollEndFn]);

  useEffect(() => {
    setDiceValues(getDiceRandomValues(language));
  }, [language]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Triggers a recursive dice roll animation.
   * @param repeat - Number of times to "shuffle" before settling on values.
   */
  const rollDice = useCallback(
    function roll(repeat: number): void {
      // Prevent state updates if the user navigated away.
      if (!isMounted.current) return;

      setDiceValues(getDiceRandomValues(language));

      // Recursive timeout for the "rolling" effect.
      if (repeat > 0) {
        setTimeout(() => roll(repeat - 1), 50);
        return;
      }

      // Callback when the animation finishes.
      onDiceRollEndFnRef.current();
    },
    [language],
  );

  const result = useMemo(
    () => ({
      diceValues,
      rollDice,
    }),
    [diceValues, rollDice],
  );

  return result;
};
