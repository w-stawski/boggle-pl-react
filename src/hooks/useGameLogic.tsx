import { useCallback, useMemo, useReducer, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Letter, Word, TurnHistoryEntry } from "../utils/types";
import { useDice } from "./useDice";
import { useTimer } from "./useTimer";
import { useDictionaryCheck } from "./useDictionaryCheck";
import {
  checkIfLetterValid,
  getLetterArrWithNewLetter,
} from "../utils/helpers";

export type GamePhase =
  | "IDLE"
  | "ROLLING"
  | "PLAYING"
  | "CHECKING"
  | "TURN_REVIEW"
  | "ROUND_COMPARISON"
  | "GAME_SUMMARY";

export type GameState = {
  phase: GamePhase;
  currentPlayer: number;
  round: number;
  turnHistory: TurnHistoryEntry[];
  selectedLetters: Letter[];
  words: Word[];
  invalidLetterId: string;
  duplicateError: string;
  checkedWords: Word[];
};

export type GameAction =
  | { type: "START_ROLLING" }
  | { type: "DICE_ROLL_END" }
  | { type: "TIMER_UP" }
  | { type: "CHECK_DONE"; results: Word[]; score: number }
  | { type: "NEXT_STEP"; numberOfPlayers: number; roundLimit: number }
  | {
      type: "SELECT_LETTER";
      letter: Letter;
      isSelected: boolean;
      isWordBreakingAllowed: boolean;
    }
  | { type: "ACCEPT_WORD"; duplicateErrorMsg: string }
  | { type: "DISMISS_ERROR" }
  | { type: "CLEAR_SELECTION" };

export const initialState: GameState = {
  phase: "IDLE",
  currentPlayer: 1,
  round: 1,
  turnHistory: [],
  selectedLetters: [],
  words: [],
  invalidLetterId: "",
  duplicateError: "",
  checkedWords: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_ROLLING":
      return {
        ...state,
        phase: "ROLLING",
        selectedLetters: [],
        invalidLetterId: "",
        duplicateError: "",
        words: [],
        checkedWords: [],
      };
    case "DICE_ROLL_END":
      return {
        ...state,
        phase: "PLAYING",
      };
    case "TIMER_UP":
      return {
        ...state,
        phase: "CHECKING",
        selectedLetters: [],
      };
    case "CHECK_DONE":
      return {
        ...state,
        phase: "TURN_REVIEW",
        checkedWords: action.results,
        turnHistory: [
          ...state.turnHistory,
          {
            player: state.currentPlayer,
            round: state.round,
            score: action.score,
            words: action.results,
          },
        ],
      };
    case "NEXT_STEP": {
      const isLastPlayerOfRound =
        state.currentPlayer === action.numberOfPlayers;
      const isLastRound = state.round === action.roundLimit;

      if (state.phase === "TURN_REVIEW") {
        if (action.numberOfPlayers > 1 && isLastPlayerOfRound) {
          return { ...state, phase: "ROUND_COMPARISON" };
        }
        if (
          isLastRound &&
          (action.numberOfPlayers === 1 || isLastPlayerOfRound)
        ) {
          return { ...state, phase: "GAME_SUMMARY" };
        }
      } else if (state.phase === "ROUND_COMPARISON") {
        if (isLastRound) {
          return { ...state, phase: "GAME_SUMMARY" };
        }
      }

      const nextPlayer = isLastPlayerOfRound ? 1 : state.currentPlayer + 1;
      const nextRound = isLastPlayerOfRound ? state.round + 1 : state.round;

      return {
        ...state,
        phase: "IDLE",
        currentPlayer: nextPlayer,
        round: nextRound,
        words: [],
        selectedLetters: [],
        invalidLetterId: "",
        duplicateError: "",
        checkedWords: [],
      };
    }
    case "SELECT_LETTER": {
      if (state.phase !== "PLAYING") return state;
      const { letter, isSelected, isWordBreakingAllowed } = action;
      if (
        !checkIfLetterValid(
          letter,
          state.selectedLetters,
          isSelected,
          isWordBreakingAllowed,
        )
      ) {
        return { ...state, invalidLetterId: letter.id };
      }
      return {
        ...state,
        invalidLetterId: "",
        selectedLetters: getLetterArrWithNewLetter(
          letter,
          state.selectedLetters,
        ),
      };
    }
    case "ACCEPT_WORD": {
      if (state.phase !== "PLAYING") return state;
      const wordVal = state.selectedLetters.map((l) => l.val).join("");
      if (wordVal.length < 3) return state;
      const isDuplicate = state.words.some((w) => w.val === wordVal);
      if (isDuplicate) {
        return { ...state, duplicateError: action.duplicateErrorMsg };
      }
      return {
        ...state,
        words: [...state.words, { val: wordVal, points: null }],
        selectedLetters: [],
        invalidLetterId: "",
      };
    }
    case "DISMISS_ERROR":
      return { ...state, duplicateError: "" };
    case "CLEAR_SELECTION":
      return { ...state, selectedLetters: [], invalidLetterId: "" };
    default:
      return state;
  }
}

type UseGameLogicParams = {
  timeLimit: number;
  roundLimit: number;
  numberOfPlayers: number;
  isWordBreakingAllowed: boolean;
  setCurrentRound: (round: number) => void;
};

export function useGameLogic({
  timeLimit,
  roundLimit,
  numberOfPlayers,
  isWordBreakingAllowed,
  setCurrentRound,
}: UseGameLogicParams) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Sync round with context
  useEffect(() => {
    setCurrentRound(state.round);
  }, [state.round, setCurrentRound]);

  const { checkWords, areResultsLoading } = useDictionaryCheck();

  const handleTimerUp = useCallback(() => {
    dispatch({ type: "TIMER_UP" });
  }, []);

  const { seconds, startTimer } = useTimer(handleTimerUp);

  const handleDiceRollEnd = useCallback(() => {
    dispatch({ type: "DICE_ROLL_END" });
    startTimer(timeLimit);
  }, [startTimer, timeLimit]);

  const { diceValues, rollDice } = useDice(handleDiceRollEnd);

  // Trigger check when phase changes to CHECKING
  const wordsRef = useRef(state.words);
  useEffect(() => {
    wordsRef.current = state.words;
  }, [state.words]);

  useEffect(() => {
    if (state.phase === "CHECKING") {
      const runCheck = async () => {
        const results = await checkWords(wordsRef.current);
        const validatedResults =
          results || wordsRef.current.map((w) => ({ ...w, points: 0 }));
        const turnScore = validatedResults.reduce(
          (acc, w) => acc + (w.points ?? 0),
          0,
        );
        dispatch({
          type: "CHECK_DONE",
          results: validatedResults,
          score: turnScore,
        });
      };
      runCheck();
    }
  }, [state.phase, checkWords]);

  const handleRollDice = useCallback(() => {
    dispatch({ type: "START_ROLLING" });
    rollDice(15);
  }, [rollDice]);

  const setupNextTurn = useCallback(() => {
    if (state.phase === "GAME_SUMMARY") {
      navigate("/start");
      return;
    }
    dispatch({ type: "NEXT_STEP", numberOfPlayers, roundLimit });
  }, [state.phase, numberOfPlayers, roundLimit, navigate]);

  const handleSelectedLettersUpdate = useCallback(
    (letter: Letter | null, isSelected?: boolean) => {
      if (!letter) {
        dispatch({ type: "CLEAR_SELECTION" });
        return;
      }
      dispatch({
        type: "SELECT_LETTER",
        letter,
        isSelected: isSelected ?? false,
        isWordBreakingAllowed,
      });
    },
    [isWordBreakingAllowed],
  );

  const onWordAccept = useCallback(() => {
    const wordVal = state.selectedLetters.map((l) => l.val).join("");
    dispatch({
      type: "ACCEPT_WORD",
      duplicateErrorMsg: `"${wordVal}" ${t("game.duplicateError")}!`,
    });
  }, [state.selectedLetters, t]);

  const nextPlayer = useMemo(
    () =>
      state.currentPlayer === numberOfPlayers ? 1 : state.currentPlayer + 1,
    [state.currentPlayer, numberOfPlayers],
  );

  const word = useMemo(
    () => state.selectedLetters.map((l) => l.val).join(""),
    [state.selectedLetters],
  );

  const selectedLettersIds = useMemo(
    () => state.selectedLetters.map((l) => l.id),
    [state.selectedLetters],
  );

  return {
    ...state,
    word,
    selectedLettersIds,
    nextPlayer,
    seconds,
    diceValues,
    areResultsLoading,
    showModal: [
      "TURN_REVIEW",
      "ROUND_COMPARISON",
      "GAME_SUMMARY",
      "CHECKING",
    ].includes(state.phase),
    modalView: (state.phase === "ROUND_COMPARISON"
      ? "roundComparison"
      : state.phase === "GAME_SUMMARY"
        ? "gameSummary"
        : "turn") as "turn" | "roundComparison" | "gameSummary",
    isGameOver: state.phase === "GAME_SUMMARY",
    handleRollDice,
    setupNextTurn,
    handleSelectedLettersUpdate,
    onWordAccept,
    dismissDuplicateError: () => dispatch({ type: "DISMISS_ERROR" }),
  };
}
