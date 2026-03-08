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
import SelectedLetters from "../SelectedLetters/SelectedLetters.js";
import Wordslist from "../Wordslist/Wordslist.js";
import GameInfo from "../GameInfo/GameInfo.js";

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
  const setupNextTurn = (): void => {
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
      <main className="grid grid-cols-4 justify-items-center">
        <aside className="my-auto hidden max-h-[50dvh] overflow-hidden md:block">
          <Wordslist words={words} />
        </aside>
        <article className="text-ui-text col-span-4 flex w-full max-w-120 flex-col justify-center gap-5 p-3 text-xl sm:text-2xl md:col-span-2 md:text-3xl">
          {/*  TODO check height, hotseat, multi, intro, users, lang, localstorage?, error boundry */}
          <GameInfo
            currentPlayer={currentPlayer}
            round={round}
            seconds={seconds}
          />
          <Button
            className="bg-ui-tertiary"
            disabled={!!seconds}
            onClickFn={() => rollDice(15)}
          >
            roll the dice
          </Button>
          <SelectedLetters
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
        </article>
      </main>

      {showModal && (
        <Modal
          onCloseFn={setupNextTurn}
          closeButtonAltText={
            nextPlayer ? `Start next turn for Player ${nextPlayer}` : ""
          }
        >
          <Wordslist
            words={checkedWords}
            isLoading={areResultsLoading}
            blackoutWords={!!nextPlayer}
            bottomText={nextPlayer ? `Next Player: ${nextPlayer}` : ""}
            isFinalBoard
          />
        </Modal>
      )}
    </>
  );
}

export default Game;
