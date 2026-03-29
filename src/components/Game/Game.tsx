import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useSettings } from "../../contexts/SettingsContext.js";
import { useDice } from "../../hooks/useDice.js";
import { useDictionaryCheck } from "../../hooks/useDictionaryCheck.js";
import { useTimer } from "../../hooks/useTimer.js";

import {
  checkIfLetterValid,
  getLetterArrWithNewLetter,
} from "../../utils/helpers.js";
import type { Letter, Word, TurnHistoryEntry } from "../../utils/types.js";

import GamePlayfield from "./GamePlayfield.js";
import GameResultsModal from "./GameResultsModal.js";
import GameSidebar from "./GameSidebar.js";

function Game() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    timeLimit,
    roundLimit,
    isWordBreakingAllowed,
    numberOfPlayers,
    setCurrentRound,
  } = useSettings();

  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [invalidLetterId, setInvalidLetterId] = useState<string>("");
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [round, setRound] = useState(1);
  const [turnHistory, setTurnHistory] = useState<TurnHistoryEntry[]>([]);

  useEffect(() => {
    setCurrentRound(round);
  }, [round, setCurrentRound]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalView, setModalView] = useState<
    "turn" | "roundComparison" | "gameSummary"
  >("turn");
  const [duplicateError, setDuplicateError] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState(false);

  const { checkedWords, checkWords, resetCheckedWords, areResultsLoading } =
    useDictionaryCheck();

  const handleTimerUp = useCallback(async () => {
    setShowModal(true);
    setSelectedLetters([]);
    const results = await checkWords(words);
    if (results) {
      const turnScore = results.reduce(
        (acc: number, w: Word) => acc + (w.points ?? 0),
        0,
      );
      setTurnHistory((prev) => [
        ...prev,
        {
          player: currentPlayer,
          round,
          score: turnScore,
          words: results,
        },
      ]);
    }
  }, [words, checkWords, currentPlayer, round]);

  const { seconds, startTimer } = useTimer(handleTimerUp);

  const nextPlayer = currentPlayer === numberOfPlayers ? 1 : currentPlayer + 1;

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

  const handleDiceRollEnd = useCallback(() => {
    handleSelectedLettersUpdate(null);
    startTimer(timeLimit);
  }, [handleSelectedLettersUpdate, startTimer, timeLimit]);

  const { diceValues, rollDice } = useDice(handleDiceRollEnd);

  const handleRollDice = useCallback(() => rollDice(15), [rollDice]);

  const selectedLettersIds = useMemo(
    () => selectedLetters.map((letter) => letter.id),
    [selectedLetters],
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

  const setupNextTurn = useCallback((): void => {
    if (showModal) {
      if (modalView === "turn") {
        if (numberOfPlayers > 1) {
          if (currentPlayer === numberOfPlayers) {
            setModalView("roundComparison");
            return;
          }
        } else if (round === roundLimit) {
          setModalView("gameSummary");
          setIsGameOver(true);
          return;
        }
      } else if (modalView === "roundComparison") {
        if (round === roundLimit) {
          setModalView("gameSummary");
          setIsGameOver(true);
          return;
        }
      } else if (modalView === "gameSummary") {
        navigate("/start");
        return;
      }
    }

    setDuplicateError("");
    setShowModal(false);
    setModalView("turn");
    setSelectedLetters([]);
    setWords([]);
    resetCheckedWords();

    if (numberOfPlayers > 1) {
      if (currentPlayer === numberOfPlayers) {
        setCurrentPlayer(1);
      } else {
        setCurrentPlayer((prev) => prev + 1);
        startTimer(timeLimit);
        return;
      }
    }

    const nextRound = round + 1;
    setRound(nextRound);
  }, [
    showModal,
    modalView,
    currentPlayer,
    numberOfPlayers,
    round,
    roundLimit,
    timeLimit,
    resetCheckedWords,
    startTimer,
    navigate,
  ]);

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-4">
        <GameSidebar words={words} />
        <GamePlayfield
          currentPlayer={numberOfPlayers > 1 ? currentPlayer : null}
          round={round}
          seconds={seconds}
          word={word}
          selectedLettersCount={selectedLetters.length}
          diceValues={diceValues}
          selectedLettersIds={selectedLettersIds}
          invalidLetterId={invalidLetterId}
          duplicateError={duplicateError}
          onRollDice={handleRollDice}
          onWordAccept={onWordAccept}
          onLetterSelect={handleSelectedLettersUpdate}
          onDismissDuplicateError={() => setDuplicateError("")}
        />
      </div>

      {showModal && (
        <GameResultsModal
          modalView={modalView}
          isGameOver={isGameOver}
          round={round}
          roundLimit={roundLimit}
          numberOfPlayers={numberOfPlayers}
          currentPlayer={currentPlayer}
          nextPlayer={nextPlayer}
          checkedWords={checkedWords}
          areResultsLoading={areResultsLoading}
          turnHistory={turnHistory}
          onCloseFn={setupNextTurn}
        />
      )}
    </>
  );
}

export default Game;
