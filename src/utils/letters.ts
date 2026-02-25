import { diceLetters, diceWordIndexPattern } from "./constants";
import type { Letter } from "./types";

export const getDiceRandomValues = (): Letter[] => {
  const randomOrderDiceArr = diceLetters.sort(() => Math.random() - 0.5);

  const randomDiceValues = randomOrderDiceArr.map((item: Letter[], index) => {
    const randomIndex = Math.floor(Math.random() * 6);
    const position = { row: Math.floor(index / 4), column: index % 4 };

    return { ...item[randomIndex], position };
  });

  return randomDiceValues;
};

export const getDiceValuesWithSetWord = (word: string): Letter[] => {
  const randomValues = getDiceRandomValues();
  if (!word || word.length > 7) {
    return randomValues;
  }

  const wordLetters = [...word];
  const updatedDiceValues = [...randomValues];

  wordLetters.forEach((letter: string, index) => {
    const updateDiceIndex = diceWordIndexPattern[index];

    updatedDiceValues[updateDiceIndex].val = letter;
  });

  return updatedDiceValues;
};

export const checkIfLetterValid = (
  letter: Letter,
  selectedLetters: Letter[],
): boolean => {
  if (!selectedLetters.length) {
    return true;
  }
  const { row: currentlySelectedRow, column: currentlySelectedColumn } =
    letter.position;
  const { row: previouslySelectedRow, column: previouslySelectedColumn } =
    selectedLetters[selectedLetters.length - 1].position;

  const rowDistance = Math.abs(currentlySelectedRow - previouslySelectedRow);
  const columnDistance = Math.abs(
    currentlySelectedColumn - previouslySelectedColumn,
  );

  return rowDistance <= 1 && columnDistance <= 1;
};

export const getDicePlaceholders = (): Letter[] =>
  Array(16).fill({ val: "X", id: null });
