import { useCallback, useContext, useState } from "react";

import { SettingsContext } from "../../contexts/SettingsContext.js";
import { useDice } from "../../hooks/useDice.js";
import { useDictionaryCheck } from "../../hooks/useDictionaryCheck.js";
import { useTimer } from "../../hooks/useTimer.js";

import {
  checkIfLetterValid,
  getLetterArrWithNewLetter,
} from "../../utils/helpers.js";
import type { Letter, Word } from "../../utils/types.js";

import Button from "../Button/Button.js";
import Diceboard from "../Diceboard/Diceboard.js";
import Modal from "../Modal/Modal.js";
import Wordbox from "../Wordbox/Wordbox.js";
import Wordslist from "../Wordslist/Wordslist.js";

function Game() {
  const { timeLimit, roundLimit, isWordBreakingAllowed, numberOfPlayers } =
    useContext(SettingsContext);

  const [currentPlayer, setCurrentPlayer] = useState<number | null>(
    numberOfPlayers > 1 ? 1 : null,
  );
  const [invalidLetterId, setInvalidLetterId] = useState<string>("");
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [round, setRound] = useState(1);
  const [showModal, setShowModal] = useState<boolean>(null);

  const { checkedWords, checkWords, resetCheckedWords, areResultsLoading } =
    useDictionaryCheck();

  const { seconds, startTimer } = useTimer(() => {
    setShowModal(true);
    setSelectedLetters([]);
    checkWords(words);
  });

  const nextPlayer = !currentPlayer
    ? null
    : currentPlayer === numberOfPlayers
      ? 1
      : currentPlayer + 1;

  const word = selectedLetters.map((letter: Letter) => letter.val).join("");

  const handleSelectedLettersUpdate = useCallback(
    (selectedLetter: Letter, isSelected?: boolean): void => {
      setInvalidLetterId("");

      if (!selectedLetter) {
        setSelectedLetters([]);
        return;
      }

      if (
        !checkIfLetterValid(
          selectedLetter,
          selectedLetters,
          isSelected,
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

  const { diceValues, rollDice } = useDice(() => {
    handleSelectedLettersUpdate(null);
    startTimer(timeLimit);
  });
  const onWordAccept = useCallback((): void => {
    setWords((words) => {
      const isWordDuplicate = words.some(
        (previousWord: Word) => previousWord.val === word,
      );
      if (isWordDuplicate) {
        alert("Word duplicated!");
      }
      return isWordDuplicate ? words : [...words, { val: word, points: null }];
    });
    handleSelectedLettersUpdate(null);
  }, [handleSelectedLettersUpdate, word]);
  // reducer?
  const setupNextRound = (): void => {
    setShowModal(false);
    setSelectedLetters([]);
    setWords([]);
    resetCheckedWords();

    if (numberOfPlayers > 1) {
      if (currentPlayer === numberOfPlayers) {
        setCurrentPlayer(1);
      } else {
        setCurrentPlayer((currentPlayer) => currentPlayer + 1);
        startTimer(timeLimit);
        return;
      }
    }
    const nextRound = round + 1;

    if (nextRound > 1 && nextRound >= roundLimit) {
      alert("limit");
    }

    setRound(nextRound);
  };

  return (
    <>
      <div className="grid grid-cols-4 justify-items-center">
        <div className="hidden md:block max-h-[50dvh] my-auto overflow-hidden">
          <Wordslist words={words} />
        </div>
        <div className="col-span-4 md:col-span-2 flex flex-col justify-center w-full max-w-120 gap-5 p-3 text-xl sm:text-2xl md:text-3xl text-ui-text">
          {/*  TODO check height, hotseat, multi, intro, users, lang, localstorage?, error boundry */}
          <section className="flex justify-between items-center opacity-95">
            <div>
              <p className="text-ui-secondary ">Round : {round}</p>
              {currentPlayer && (
                <p className="text-sm">PLAYER : {currentPlayer}</p>
              )}
            </div>

            <p
              className={`text-ui-secondary  transition-color duration-200 ${!seconds ? "invisible" : ""} ${seconds < 10 ? "text-ui-accent" : ""}`}
            >
              Seconds Remaining: {seconds}
            </p>
          </section>
          <Button
            className="bg-ui-tertiary"
            disabled={!!seconds}
            onClickFn={() => rollDice(15)}
          >
            roll the dice
          </Button>
          <Wordbox
            word={word}
            onOkClickFn={onWordAccept}
            disabled={selectedLetters.length < 3}
          />
          <Diceboard
            letters={diceValues}
            onLetterSelect={handleSelectedLettersUpdate}
            selectedLettersIds={selectedLetters.map((letter) => letter.id)}
            invalidLetterId={invalidLetterId}
            disabled={!seconds}
          />
        </div>
      </div>

      {showModal && (
        <Modal
          onCloseFn={setupNextRound}
          closeButtonAltText={`Start next turn for Player ${nextPlayer}`}
        >
          <Wordslist
            words={checkedWords}
            isLoading={areResultsLoading}
            blackoutWords
            bottomText={nextPlayer ? `Next Player: ${nextPlayer}` : ""}
            isFinalBoard
          />
        </Modal>
      )}
    </>
  );
}

export default Game;
