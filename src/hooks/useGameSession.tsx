import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import type { NavigateFunction } from "react-router-dom";

import { useDice } from "./useDice.js";
import { useDictionaryCheck } from "./useDictionaryCheck.js";
import { useTimer } from "./useTimer.js";
import type { Word, TurnHistoryEntry } from "../utils/types.js";

type ModalView = "turn" | "roundComparison" | "gameSummary";

type UseGameSessionParams = {
  timeLimit: number;
  roundLimit: number;
  numberOfPlayers: number;
  setCurrentRound: Dispatch<SetStateAction<number>>;
  navigate: NavigateFunction;
  /** Latest accepted words when the timer fires (must stay in sync with `words` state). */
  wordsRef: MutableRefObject<Word[]>;
  clearSelection: () => void;
  resetPlayForNextRound: () => void;
};

/**
 * Match progression: round, players, modals, history, timer, dice, dictionary check at turn end.
 */
export function useGameSession({
  timeLimit,
  roundLimit,
  numberOfPlayers,
  setCurrentRound,
  navigate,
  wordsRef,
  clearSelection,
  resetPlayForNextRound,
}: UseGameSessionParams) {
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [round, setRound] = useState(1);
  const [turnHistory, setTurnHistory] = useState<TurnHistoryEntry[]>([]);

  useEffect(() => {
    setCurrentRound(round);
  }, [round, setCurrentRound]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalView, setModalView] = useState<ModalView>("turn");
  const [isGameOver, setIsGameOver] = useState(false);

  const { checkedWords, checkWords, resetCheckedWords, areResultsLoading } =
    useDictionaryCheck();

  const handleTimerUp = useCallback(async () => {
    setShowModal(true);
    clearSelection();
    const snapshot = wordsRef.current;
    const results = await checkWords(snapshot);
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
  }, [wordsRef, checkWords, clearSelection, currentPlayer, round]);

  const { seconds, startTimer } = useTimer(handleTimerUp);

  const nextPlayer = useMemo(
    () => (currentPlayer === numberOfPlayers ? 1 : currentPlayer + 1),
    [currentPlayer, numberOfPlayers],
  );

  const handleDiceRollEnd = useCallback(() => {
    clearSelection();
    startTimer(timeLimit);
  }, [clearSelection, startTimer, timeLimit]);

  const { diceValues, rollDice } = useDice(handleDiceRollEnd);

  const handleRollDice = useCallback(() => rollDice(15), [rollDice]);

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

    resetPlayForNextRound();
    setShowModal(false);
    setModalView("turn");
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
    resetPlayForNextRound,
    resetCheckedWords,
    startTimer,
    navigate,
  ]);

  return {
    currentPlayer,
    round,
    turnHistory,
    showModal,
    modalView,
    isGameOver,
    nextPlayer,
    seconds,
    diceValues,
    handleRollDice,
    checkedWords,
    areResultsLoading,
    setupNextTurn,
  };
}
