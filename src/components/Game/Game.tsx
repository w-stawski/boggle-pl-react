import { useCallback, useState } from "react";

import { useDictionaryCheck } from "../../hooks/useDictionaryCheck.js";
import { useTimer } from "../../hooks/useTimer.js";
import Button from "../Button/Button.js";
import Diceboard from "../Diceboard/Diceboard.js";
import Modal from "../Modal/Modal.js";
import Wordslist from "../Wordslist/Wordslist.js";

import {
  checkIfLetterArrValid,
  checkIfLetterValid,
  getDiceRandomValues,
  getLetterArrWithNewLetter,
} from "../../utils/helpers.js";
import type { Letter, Word } from "../../utils/types.js";
import Wordbox from "../Wordbox/Wordbox.js";

function Game() {
  const [diceValues, setDiceValues] = useState<Letter[]>(getDiceRandomValues());
  const [invalidLetterId, setInvalidLetterId] = useState<string>("");
  const [round, setRound] = useState(1);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<Word[]>([]);

  const [showModal, setShowModal] = useState<boolean | null>(null);

  const { seconds, startTimer } = useTimer(() => {
    setShowModal(true);
    setSelectedLetters([]);
    checkWords(words);
  });

  const { checkedWords, checkWords, resetCheckedWords, areResultsLoading } =
    useDictionaryCheck();

  const word = selectedLetters.map((letter: Letter) => letter.val).join("");
  const handleSelectedLettersUpdate = useCallback(
    (selectedLetter: Letter): void => {
      setInvalidLetterId("");

      if (!selectedLetter) {
        setSelectedLetters([]);
        return;
      }

      if (!checkIfLetterValid(selectedLetter, selectedLetters)) {
        setInvalidLetterId(selectedLetter.id);
        return;
      }

      setSelectedLetters((lettersArr) =>
        getLetterArrWithNewLetter(selectedLetter, lettersArr),
      );
    },
    [selectedLetters],
  );

  const onDiceRoll = useCallback(
    (repeat: number): void => {
      setDiceValues(getDiceRandomValues());

      if (repeat) {
        setTimeout(() => onDiceRoll(--repeat), 50);
        return;
      }

      handleSelectedLettersUpdate(null);
      startTimer(5);
    },
    [startTimer, handleSelectedLettersUpdate],
  );

  const onWordAccept = useCallback((): void => {
    const areLettersConnected = checkIfLetterArrValid(selectedLetters);
    if (!areLettersConnected) {
      alert("Letters were not connected!");
    }
    setWords((words) => {
      const isWordDuplicate = words.some(
        (previousWord: Word) => previousWord.val === word,
      );
      if (isWordDuplicate) {
        alert("Word duplicated!");
      }
      return isWordDuplicate || !areLettersConnected
        ? words
        : [...words, { val: word, points: null }];
    });
    handleSelectedLettersUpdate(null);
  }, [handleSelectedLettersUpdate, word, selectedLetters]);

  const setupNextRound = (): void => {
    setShowModal(false);
    setSelectedLetters([]);
    setWords([]);
    resetCheckedWords();
    setRound((count) => ++count);
  };

  return (
    <>
      <div className="grid grid-cols-4 justify-items-center">
        <div className="hidden md:block max-h-[50dvh] my-auto overflow-hidden">
          <Wordslist words={words} />
        </div>
        <div className="col-span-4 md:col-span-2 flex flex-col justify-center w-full max-w-120 gap-5 p-3 text-xl sm:text-2xl md:text-3xl text-ui-text">
          {/*  TODO user set round limit time limit, intro , footer , users, lang, localstorage, 2 players, rules */}
          <section className="flex justify-between text-ui-secondary opacity-95">
            <p>Round: {round}</p>
            <p
              className={`transition-color duration-200 ${!seconds ? "invisible" : ""} ${seconds < 10 ? "text-ui-accent" : ""}`}
            >
              Seconds Remaining: {seconds}
            </p>
          </section>
          <Button
            isDisabled={!!seconds}
            highlighted
            onClickFn={() => onDiceRoll(15)}
          >
            roll the dice
          </Button>
          <Wordbox
            word={word}
            onOkClickFn={onWordAccept}
            isDisabled={selectedLetters.length < 3}
          />
          <Diceboard
            letters={diceValues}
            onLetterSelect={handleSelectedLettersUpdate}
            selectedLettersIds={selectedLetters.map((letter) => letter.id)}
            invalidLetterId={invalidLetterId}
            isDisabled={!seconds}
          />
        </div>
      </div>

      {showModal && (
        <Modal onCloseFn={setupNextRound}>
          <Wordslist
            words={checkedWords}
            isLoading={areResultsLoading}
            isFinalBoard
          />
        </Modal>
      )}
    </>
  );
}

export default Game;
