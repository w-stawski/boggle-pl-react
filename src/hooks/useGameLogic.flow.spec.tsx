import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useEffect } from "react";

import { useGameLogic } from "./useGameLogic";
import type { Letter } from "../utils/types";

type GameLogicReturn = ReturnType<typeof useGameLogic>;

let triggerTimeUp: (() => void) | null = null;

const checkWordsMock = vi.fn();

vi.mock("./useTimer", () => ({
  useTimer: (onTimeUp: () => void) => {
    triggerTimeUp = onTimeUp;
    return { seconds: 0, startTimer: vi.fn() };
  },
}));

vi.mock("./useDice", () => ({
  useDice: (onDiceRollEndFn: () => void) => ({
    diceValues: [],
    rollDice: vi.fn(() => onDiceRollEndFn()),
  }),
}));

vi.mock("./useDictionaryCheck", () => ({
  useDictionaryCheck: () => ({
    checkedWords: [],
    areResultsLoading: false,
    checkWords: checkWordsMock,
    resetCheckedWords: vi.fn(),
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function Harness({
  onExpose,
}: {
  onExpose: (game: GameLogicReturn) => void;
}) {
  const game = useGameLogic({
    timeLimit: 90,
    roundLimit: 5,
    numberOfPlayers: 1,
    isWordBreakingAllowed: false,
    setCurrentRound: vi.fn(),
  });

  useEffect(() => {
    onExpose(game);
  }, [game, onExpose]);

  return <div data-testid="phase">{game.phase}</div>;
}

describe("useGameLogic flow", () => {
  const letterA: Letter = { id: "1", val: "A", position: { row: 0, column: 0 } };
  const letterB: Letter = { id: "2", val: "B", position: { row: 0, column: 1 } };
  const letterC: Letter = { id: "3", val: "C", position: { row: 0, column: 2 } };

  beforeEach(() => {
    triggerTimeUp = null;
    checkWordsMock.mockReset();
  });

  it("checks dictionary on TIMER_UP and applies CHECK_DONE results", async () => {
    checkWordsMock.mockResolvedValue([{ val: "ABC", points: 5 }]);

    let exposed: GameLogicReturn | null = null;
    render(
      <MemoryRouter>
        <Harness onExpose={(game) => (exposed = game)} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(exposed).not.toBeNull());
    if (!exposed) throw new Error("GameLogicReturn not exposed");

    // Move into PLAYING by simulating a dice roll end.
    act(() => {
      exposed.handleRollDice();
    });
    await waitFor(() => expect(exposed.phase).toBe("PLAYING"));

    // Accept "ABC"
    act(() => {
      exposed.handleSelectedLettersUpdate(letterA);
      exposed.handleSelectedLettersUpdate(letterB);
      exposed.handleSelectedLettersUpdate(letterC);
      exposed.onWordAccept();
    });

    await waitFor(() => expect(exposed.words).toHaveLength(1));
    expect(exposed.words[0]).toEqual({ val: "ABC", points: null });

    // Simulate time expiry
    act(() => {
      triggerTimeUp?.();
    });

    await waitFor(() => expect(exposed.phase).toBe("TURN_REVIEW"));

    expect(checkWordsMock).toHaveBeenCalledTimes(1);
    expect(checkWordsMock).toHaveBeenCalledWith([{ val: "ABC", points: null }]);

    expect(exposed.checkedWords).toEqual([{ val: "ABC", points: 5 }]);
    expect(exposed.turnHistory).toHaveLength(1);
    expect(exposed.turnHistory[0]).toEqual({
      player: 1,
      round: 1,
      score: 5,
      words: [{ val: "ABC", points: 5 }],
    });
  });

  it("falls back to 0 points when dictionary check returns undefined", async () => {
    checkWordsMock.mockResolvedValue(undefined);

    let exposed: GameLogicReturn | null = null;
    render(
      <MemoryRouter>
        <Harness onExpose={(game) => (exposed = game)} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(exposed).not.toBeNull());
    if (!exposed) throw new Error("GameLogicReturn not exposed");

    act(() => {
      exposed.handleRollDice();
    });
    await waitFor(() => expect(exposed.phase).toBe("PLAYING"));

    act(() => {
      exposed.handleSelectedLettersUpdate(letterA);
      exposed.handleSelectedLettersUpdate(letterB);
      exposed.handleSelectedLettersUpdate(letterC);
      exposed.onWordAccept();
    });

    await waitFor(() => expect(exposed.words).toHaveLength(1));

    act(() => {
      triggerTimeUp?.();
    });

    await waitFor(() => expect(exposed.phase).toBe("TURN_REVIEW"));

    expect(checkWordsMock).toHaveBeenCalledWith([{ val: "ABC", points: null }]);

    // Fallback validated results map words -> points: 0
    expect(exposed.checkedWords).toEqual([{ val: "ABC", points: 0 }]);
    expect(exposed.turnHistory).toHaveLength(1);
    expect(exposed.turnHistory[0].score).toBe(0);
  });
});

