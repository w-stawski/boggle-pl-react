import { describe, expect, it } from "vitest";
import { gameReducer, initialState, type GameState } from "./useGameLogic";
import type { Letter, Word } from "../utils/types";

describe("gameReducer", () => {
  it("should handle START_ROLLING", () => {
    const state = gameReducer(initialState, { type: "START_ROLLING" });
    expect(state.phase).toBe("ROLLING");
    expect(state.selectedLetters).toEqual([]);
    expect(state.words).toEqual([]);
  });

  it("should handle DICE_ROLL_END", () => {
    const state = gameReducer(
      { ...initialState, phase: "ROLLING" },
      { type: "DICE_ROLL_END" },
    );
    expect(state.phase).toBe("PLAYING");
  });

  it("should handle TIMER_UP", () => {
    const state = gameReducer(
      { ...initialState, phase: "PLAYING" },
      { type: "TIMER_UP" },
    );
    expect(state.phase).toBe("CHECKING");
    expect(state.selectedLetters).toEqual([]);
  });

  it("should handle CHECK_DONE", () => {
    const results: Word[] = [{ val: "TEST", points: 5 }];
    const state = gameReducer(
      { ...initialState, phase: "CHECKING", currentPlayer: 1, round: 1 },
      { type: "CHECK_DONE", results, score: 5 },
    );
    expect(state.phase).toBe("TURN_REVIEW");
    expect(state.checkedWords).toEqual(results);
    expect(state.turnHistory).toHaveLength(1);
    expect(state.turnHistory[0]).toEqual({
      player: 1,
      round: 1,
      score: 5,
      words: results,
    });
  });

  describe("NEXT_STEP transitions", () => {
    it("should transition to ROUND_COMPARISON in hotseat after last player", () => {
      const state = gameReducer(
        { ...initialState, phase: "TURN_REVIEW", currentPlayer: 2, round: 1 },
        { type: "NEXT_STEP", numberOfPlayers: 2, roundLimit: 5 },
      );
      expect(state.phase).toBe("ROUND_COMPARISON");
    });

    it("should transition to GAME_SUMMARY in single player after last round", () => {
      const state = gameReducer(
        { ...initialState, phase: "TURN_REVIEW", currentPlayer: 1, round: 5 },
        { type: "NEXT_STEP", numberOfPlayers: 1, roundLimit: 5 },
      );
      expect(state.phase).toBe("GAME_SUMMARY");
    });

    it("should transition to IDLE for next player in same round", () => {
      const state = gameReducer(
        { ...initialState, phase: "TURN_REVIEW", currentPlayer: 1, round: 1 },
        { type: "NEXT_STEP", numberOfPlayers: 2, roundLimit: 5 },
      );
      expect(state.phase).toBe("IDLE");
      expect(state.currentPlayer).toBe(2);
      expect(state.round).toBe(1);
    });

    it("should transition to IDLE for next round after comparison", () => {
      const state = gameReducer(
        {
          ...initialState,
          phase: "ROUND_COMPARISON",
          currentPlayer: 2,
          round: 1,
        },
        { type: "NEXT_STEP", numberOfPlayers: 2, roundLimit: 5 },
      );
      expect(state.phase).toBe("IDLE");
      expect(state.currentPlayer).toBe(1);
      expect(state.round).toBe(2);
    });
  });

  it("should handle SELECT_LETTER", () => {
    const letter: Letter = {
      id: "1",
      val: "A",
      position: { row: 0, column: 0 },
    };
    const state = gameReducer(
      { ...initialState, phase: "PLAYING" },
      {
        type: "SELECT_LETTER",
        letter,
        isSelected: false,
        isWordBreakingAllowed: true,
      },
    );
    expect(state.selectedLetters).toHaveLength(1);
    expect(state.selectedLetters[0].val).toBe("A");
  });

  it("should handle ACCEPT_WORD", () => {
    const letter: Letter = {
      id: "1",
      val: "A",
      position: { row: 0, column: 0 },
    };
    const letter2: Letter = {
      id: "2",
      val: "B",
      position: { row: 0, column: 1 },
    };
    const letter3: Letter = {
      id: "3",
      val: "C",
      position: { row: 0, column: 2 },
    };
    const playingState: GameState = {
      ...initialState,
      phase: "PLAYING",
      selectedLetters: [letter, letter2, letter3],
    };
    const state = gameReducer(playingState, {
      type: "ACCEPT_WORD",
      duplicateErrorMsg: "Duplicate!",
    });
    expect(state.words).toHaveLength(1);
    expect(state.words[0].val).toBe("ABC");
    expect(state.selectedLetters).toEqual([]);
  });

  it("should set invalidLetterId when selecting a non-adjacent letter", () => {
    const letter00: Letter = {
      id: "00",
      val: "A",
      position: { row: 0, column: 0 },
    };
    const letter22: Letter = {
      id: "22",
      val: "Z",
      // Not adjacent to (0,0)
      position: { row: 2, column: 2 },
    };

    const playingState: GameState = {
      ...initialState,
      phase: "PLAYING",
      selectedLetters: [letter00],
    };

    const state = gameReducer(playingState, {
      type: "SELECT_LETTER",
      letter: letter22,
      isSelected: false,
      isWordBreakingAllowed: false,
    });

    expect(state.invalidLetterId).toBe("22");
    expect(state.selectedLetters).toHaveLength(1);
  });

  it("should dismiss duplicateError with DISMISS_ERROR", () => {
    const state = gameReducer(
      { ...initialState, duplicateError: "Duplicate!" },
      { type: "DISMISS_ERROR" },
    );
    expect(state.duplicateError).toBe("");
  });

  it("should clear selection with CLEAR_SELECTION", () => {
    const state = gameReducer(
      {
        ...initialState,
        phase: "PLAYING",
        selectedLetters: [{ id: "1", val: "A", position: { row: 0, column: 0 } }],
        invalidLetterId: "bad",
      },
      { type: "CLEAR_SELECTION" },
    );

    expect(state.selectedLetters).toEqual([]);
    expect(state.invalidLetterId).toBe("");
  });

  it("should not add duplicate word on ACCEPT_WORD; should set duplicateError", () => {
    const letterA: Letter = {
      id: "1",
      val: "A",
      position: { row: 0, column: 0 },
    };
    const letterB: Letter = {
      id: "2",
      val: "B",
      position: { row: 0, column: 1 },
    };
    const letterC: Letter = {
      id: "3",
      val: "C",
      position: { row: 0, column: 2 },
    };

    const playingState: GameState = {
      ...initialState,
      phase: "PLAYING",
      selectedLetters: [letterA, letterB, letterC],
      words: [{ val: "ABC", points: null }],
    };

    const state = gameReducer(playingState, {
      type: "ACCEPT_WORD",
      duplicateErrorMsg: "Duplicate!",
    });

    expect(state.words).toHaveLength(1);
    expect(state.words[0].val).toBe("ABC");
    expect(state.duplicateError).toBe("Duplicate!");
    // On duplicate, reducer does not clear selection (UI shows error while keeping selection)
    expect(state.selectedLetters).toHaveLength(3);
  });

  it("should reset checkedWords when starting to roll again (START_ROLLING)", () => {
    const playingState: GameState = {
      ...initialState,
      phase: "CHECKING",
      checkedWords: [{ val: "TEST", points: 1 }],
      selectedLetters: [{ id: "1", val: "A", position: { row: 0, column: 0 } }],
      words: [{ val: "AAA", points: null }],
    };

    const state = gameReducer(playingState, { type: "START_ROLLING" });
    expect(state.phase).toBe("ROLLING");
    expect(state.checkedWords).toEqual([]);
    expect(state.words).toEqual([]);
    expect(state.selectedLetters).toEqual([]);
  });
});
