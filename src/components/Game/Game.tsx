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
import { Dices } from "lucide-react";

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
  const [showModal, setShowModal] = useState<boolean | null>(null);

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
    setWords((prevWords) => {
      const isWordDuplicate = prevWords.some(
        (previousWord: Word) => previousWord.val === word,
      );
      if (isWordDuplicate) {
        alert("Word duplicated!");
      }
      return isWordDuplicate
        ? prevWords
        : [...prevWords, { val: word, points: null }];
    });
    handleSelectedLettersUpdate(null);
  }, [handleSelectedLettersUpdate, word]);

  const setupNextTurn = (): void => {
    setShowModal(false);
    setSelectedLetters([]);
    setWords([]);
    resetCheckedWords();

    if (numberOfPlayers > 1) {
      if (currentPlayer === numberOfPlayers) {
        setCurrentPlayer(1);
      } else {
        setCurrentPlayer((prev) => (prev !== null ? prev + 1 : 1));
        startTimer(timeLimit);
        return;
      }
    }
    const nextRound = round + 1;

    if (nextRound > 1 && nextRound > roundLimit) {
      alert("Game Over!");
      return;
    }

    setRound(nextRound);
  };

  return (
    <>
      <main className="mx-auto grid h-[calc(100vh-64px)] w-full max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-4">
        {/* SIDEBAR: Wordslist - Now visible with fixed container */}
        <aside className="hidden h-full flex-col md:flex">
          <div className="flex flex-col gap-2 border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <h2 className="mb-2 border-b-2 border-black pb-1 text-xs font-black tracking-widest uppercase">
              Words ({words.length})
            </h2>
            <div className="max-h-[60vh] overflow-y-auto">
              <Wordslist words={words} />
            </div>
          </div>
        </aside>

        {/* CENTER: Primary Game Area */}
        <article className="col-span-1 flex w-full flex-col items-center justify-center gap-4 md:col-span-2">
          <div className="flex w-full max-w-lg flex-col gap-3">
            <GameInfo
              currentPlayer={currentPlayer}
              round={round}
              seconds={seconds}
            />

            <Button
              className="group flex h-14 w-full items-center justify-center gap-4 border-4 border-black bg-[#FF00FF] text-2xl font-black text-black uppercase shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:grayscale"
              disabled={!!seconds}
              onClickFn={() => rollDice(15)}
            >
              <Dices
                size={28}
                className="transition-transform group-hover:rotate-12"
              />
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
          </div>
        </article>

        {/* RIGHT SIDE: Empty for balance or future stats */}
        <aside className="hidden md:block" />
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
