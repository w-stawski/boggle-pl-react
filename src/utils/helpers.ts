import { diceLetters } from "./constants";
import type { Letter } from "./types";

/**
 * Generates initial random values for the dice board.
 * Randomizes both which dice is in which slot and which face of the dice is up.
 */
export const getDiceRandomValues = (): Letter[] => {
  /**
   * Fisher-Yates shuffle algorithm for uniform randomness.
   * Standard `sort(() => Math.random() - 0.5)` is biased and not recommended for games.
   */
  const shuffle = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const randomOrderDiceArr = shuffle(diceLetters);

  return randomOrderDiceArr.map((item: Letter[], index) => {
    // Pick one of the 6 faces of the current dice.
    const randomIndex = Math.floor(Math.random() * 6);
    // Assign a 2D position for adjacency validation logic.
    const position = { row: Math.floor(index / 4), column: index % 4 };

    return { ...item[randomIndex], position };
  });
};

/**
 * Manages the array of selected letters, toggling them if clicked twice.
 * @param selectedLetter - The letter being clicked.
 * @param lettersArr - Current selection array.
 */
export const getLetterArrWithNewLetter = (
  selectedLetter: Letter,
  lettersArr: Letter[],
): Letter[] => {
  let letterDuplicated = false;
  // If the letter is already selected, we want to remove it (toggle).
  const filteredLetterArr = lettersArr.filter((letter) => {
    if (letter.id === selectedLetter.id) {
      letterDuplicated = true;

      return false;
    }

    return true;
  });

  const updatedLettersArr = letterDuplicated
    ? filteredLetterArr
    : [...lettersArr, selectedLetter];

  return updatedLettersArr;
};

/**
 * Validates if a letter can be selected based on the game rules (adjacency).
 * @param letter - The candidate letter.
 * @param selectedLetters - Already selected letters.
 * @param isSelected - Whether the candidate is already in the selection.
 * @param isWordBreakingAllowed - Settings toggle for strict adjacency rules.
 */
export const checkIfLetterValid = (
  letter: Letter,
  selectedLetters: Letter[],
  isSelected: boolean,
  isWordBreakingAllowed: boolean,
): boolean => {
  // First letter is always valid.
  if (!selectedLetters.length) {
    return true;
  }

  // If already selected, we only allow unselecting the very last letter
  // unless word breaking (non-linear unselection) is allowed.
  if (isSelected) {
    return isWordBreakingAllowed
      ? true
      : selectedLetters[selectedLetters.length - 1].id === letter.id;
  }

  const pos = letter.position;
  const prevPos = selectedLetters[selectedLetters.length - 1]?.position;
  if (!pos || !prevPos) {
    return false;
  }

  // Rule: Candidate must be adjacent (including diagonals) to the last selected letter.
  const { row: currentlySelectedRow, column: currentlySelectedColumn } = pos;
  const { row: previouslySelectedRow, column: previouslySelectedColumn } =
    prevPos;

  const rowDistance = Math.abs(currentlySelectedRow - previouslySelectedRow);
  const columnDistance = Math.abs(
    currentlySelectedColumn - previouslySelectedColumn,
  );

  // Adjacent means max distance of 1 in any direction.
  return rowDistance <= 1 && columnDistance <= 1;
};
