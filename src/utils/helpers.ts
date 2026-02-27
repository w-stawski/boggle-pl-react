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

export const getLetterArrWithNewLetter = (
  selectedLetter: Letter,
  lettersArr: Letter[],
): Letter[] => {
  let letterDuplicated = false;
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

export const checkIfLetterValid = (
  letter: Letter,
  selectedLetters: Letter[],
  isSelected: boolean,
  isWordBreakingAllowed: boolean,
): boolean => {
  if (!selectedLetters.length) {
    return true;
  }

  if (isSelected) {
    return isWordBreakingAllowed
      ? true
      : selectedLetters[selectedLetters.length - 1].id === letter.id;
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
