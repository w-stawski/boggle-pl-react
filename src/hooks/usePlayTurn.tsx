import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  checkIfLetterValid,
  getLetterArrWithNewLetter,
} from "../utils/helpers.js";
import type { Letter, Word } from "../utils/types.js";

type UsePlayTurnParams = {
  isWordBreakingAllowed: boolean;
};

/**
 * Letter selection, accepted words for the current turn, and duplicate feedback.
 */
export function usePlayTurn({ isWordBreakingAllowed }: UsePlayTurnParams) {
  const { t } = useTranslation();
  const [invalidLetterId, setInvalidLetterId] = useState<string>("");
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [duplicateError, setDuplicateError] = useState<string>("");

  const wordsRef = useRef(words);
  wordsRef.current = words;

  const word = useMemo(
    () => selectedLetters.map((letter: Letter) => letter.val).join(""),
    [selectedLetters],
  );

  const selectedLettersIds = useMemo(
    () => selectedLetters.map((letter) => letter.id),
    [selectedLetters],
  );

  const clearSelection = useCallback((): void => {
    setInvalidLetterId("");
    setSelectedLetters([]);
  }, []);

  const resetPlayForNextRound = useCallback((): void => {
    setDuplicateError("");
    setInvalidLetterId("");
    setSelectedLetters([]);
    setWords([]);
  }, []);

  const dismissDuplicateError = useCallback((): void => {
    setDuplicateError("");
  }, []);

  const handleSelectedLettersUpdate = useCallback(
    (selectedLetter: Letter | null, isSelected?: boolean): void => {
      setInvalidLetterId("");

      if (!selectedLetter) {
        setSelectedLetters([]);
        return;
      }

      if (
        !checkIfLetterValid(
          selectedLetter,
          selectedLetters,
          isSelected ?? false,
          isWordBreakingAllowed,
        )
      ) {
        setInvalidLetterId(selectedLetter.id);
        return;
      }

      setSelectedLetters((lettersArr) =>
        getLetterArrWithNewLetter(selectedLetter, lettersArr),
      );
    },
    [selectedLetters, isWordBreakingAllowed],
  );

  const onWordAccept = useCallback((): void => {
    setWords((prevWords) => {
      const isWordDuplicate = prevWords.some(
        (previousWord: Word) => previousWord.val === word,
      );
      if (isWordDuplicate) {
        setDuplicateError(`"${word}" ${t("game.duplicateError")}!`);
        return prevWords;
      }
      return [...prevWords, { val: word, points: null }];
    });
    handleSelectedLettersUpdate(null);
  }, [handleSelectedLettersUpdate, word, t]);

  return {
    words,
    wordsRef,
    selectedLetters,
    invalidLetterId,
    duplicateError,
    word,
    selectedLettersIds,
    handleSelectedLettersUpdate,
    onWordAccept,
    dismissDuplicateError,
    clearSelection,
    resetPlayForNextRound,
  };
}
