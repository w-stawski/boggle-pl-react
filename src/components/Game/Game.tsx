import { useCallback, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
import { Dices, AlertCircle } from "lucide-react";

function Game() {
  const navigate = useNavigate();
  const {
    timeLimit,
    roundLimit,
    isWordBreakingAllowed,
    numberOfPlayers,
    setCurrentRound,
  } = useContext(SettingsContext);

  const [currentPlayer, setCurrentPlayer] = useState<number | null>(
    numberOfPlayers > 1 ? 1 : null,
  );
  const [invalidLetterId, setInvalidLetterId] = useState<string>("");
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [round, setRound] = useState(1);

  // Sync internal round state with context for Layout display
  useEffect(() => {
    setCurrentRound(round);
  }, [round, setCurrentRound]);

  const [showModal, setShowModal] = useState<boolean | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Clear duplicate error after a short delay
  useEffect(() => {
    if (duplicateError) {
      const timer = setTimeout(() => setDuplicateError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [duplicateError]);

  const { checkedWords, checkWords, resetCheckedWords, areResultsLoading } =
    useDictionaryCheck();

  /**
   * Callback for when the timer reaches zero.
   * Wrapped in useCallback to ensure stability and avoid unnecessary hook re-runs.
   */
  const handleTimerUp = useCallback(() => {
    setShowModal(true);
    setSelectedLetters([]);
    checkWords(words);
  }, [words, checkWords]);

  const { seconds, startTimer } = useTimer(handleTimerUp);

  const nextPlayer = !currentPlayer
    ? null
    : currentPlayer === numberOfPlayers
      ? 1
      : currentPlayer + 1;

  // Derive the current word string from the array of selected letters.
  const word = selectedLetters.map((letter: Letter) => letter.val).join("");

  /**
   * Updates the list of currently selected letters in the board.
   * Handles validation (adjacency, duplicate selection) and state updates.
   */
  const handleSelectedLettersUpdate = useCallback(
    (selectedLetter: Letter | null, isSelected?: boolean): void => {
      setInvalidLetterId("");

      // Clear selection if no letter provided.
      if (!selectedLetter) {
        setSelectedLetters([]);
        return;
      }

      // Check if the selected letter is reachable from the previous one.
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

      // Append or remove letter from current selection.
      setSelectedLetters((lettersArr) =>
        getLetterArrWithNewLetter(selectedLetter, lettersArr),
      );
    },
    [selectedLetters, isWordBreakingAllowed],
  );

  /**
   * Starts the round timer after the dice rolling animation finishes.
   */
  const handleDiceRollEnd = useCallback(() => {
    handleSelectedLettersUpdate(null);
    startTimer(timeLimit);
  }, [handleSelectedLettersUpdate, startTimer, timeLimit]);

  const { diceValues, rollDice } = useDice(handleDiceRollEnd);

  /**
   * Finalizes the current word and adds it to the player's word list.
   * Includes duplicate check to prevent point exploitation.
   */
  const onWordAccept = useCallback((): void => {
    setWords((prevWords) => {
      const isWordDuplicate = prevWords.some(
        (previousWord: Word) => previousWord.val === word,
      );
      if (isWordDuplicate) {
        // UI feedback for duplicate word.
        setDuplicateError(`"${word}" is already in the list!`);
        return prevWords;
      }
      return [...prevWords, { val: word, points: null }];
    });
    // Clear selection after accepting word.
    handleSelectedLettersUpdate(null);
  }, [handleSelectedLettersUpdate, word]);

  /**
   * Prepares the state for the next turn or round.
   * Manages round increments and multiplayer turn switching.
   */
  const setupNextTurn = useCallback((): void => {
    if (isGameOver) {
      navigate("/start");
      return;
    }

    setShowModal(false);
    setSelectedLetters([]);
    setWords([]);
    resetCheckedWords();

    // Multiplayer turn logic.
    if (numberOfPlayers > 1) {
      if (currentPlayer === numberOfPlayers) {
        setCurrentPlayer(1);
      } else {
        setCurrentPlayer((prev) => (prev !== null ? prev + 1 : 1));
        startTimer(timeLimit);
        return;
      }
    }

    // Round progression logic.
    const nextRound = round + 1;

    if (nextRound > 1 && nextRound > roundLimit) {
      // End of game state trigger.
      setIsGameOver(true);
      setShowModal(true); // Keep modal open for final results
      return;
    }

    setRound(nextRound);
  }, [
    currentPlayer,
    numberOfPlayers,
    round,
    roundLimit,
    timeLimit,
    resetCheckedWords,
    startTimer,
    isGameOver,
    navigate,
  ]);

  return (
    <>
      <div className="mx-auto grid h-[calc(100vh-64px)] w-full max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-4">
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
        <div className="col-span-1 flex w-full flex-col items-center justify-center gap-4 md:col-span-2">
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
              aria-label="Roll the dice to start the game"
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

          {/* DUPLICATE WORD ERROR INDICATOR */}
          {duplicateError && (
            <div className="animate-shake flex w-full max-w-lg items-center gap-3 border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_rgba(239,68,68,1)]">
              <AlertCircle className="text-red-500" size={24} />
              <p className="font-black text-red-500 uppercase">
                {duplicateError}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Empty for balance or future stats */}
        <aside className="hidden md:block" />
      </div>

      {showModal && (
        <Modal
          onCloseFn={setupNextTurn}
          title={isGameOver ? "Game Results" : "Round Results"}
          closeButtonAltText={
            isGameOver
              ? "Back to Menu"
              : nextPlayer
                ? `Start next turn for Player ${nextPlayer}`
                : "Next Round"
          }
        >
          {isGameOver && (
            <div className="mb-4 border-4 border-black bg-black p-4 text-center">
              <h1 className="text-3xl font-black text-[#00FF66] uppercase italic">
                Game Over!
              </h1>
              <p className="font-bold text-white uppercase">
                Final stats recorded.
              </p>
            </div>
          )}
          <Wordslist
            words={checkedWords}
            isLoading={areResultsLoading}
            blackoutWords={!!nextPlayer && !isGameOver}
            bottomText={
              isGameOver
                ? "Final Score"
                : nextPlayer
                  ? `Next Player: ${nextPlayer}`
                  : ""
            }
            isFinalBoard
          />
        </Modal>
      )}
    </>
  );
}

export default Game;
