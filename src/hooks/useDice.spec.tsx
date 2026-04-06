import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { useDice } from "./useDice";

function DiceHarness({
  onReady,
  onEnd,
}: {
  onReady: (rollDice: (repeat: number) => void) => void;
  onEnd: () => void;
}) {
  const { rollDice } = useDice(onEnd);

  useEffect(() => {
    onReady(rollDice);
  }, [onReady, rollDice]);

  return <div data-testid="dice-harness" />;
}

describe("useDice", () => {
  it("calls onDiceRollEnd after the recursive timeouts", () => {
    vi.useFakeTimers();

    const onEnd = vi.fn();
    let rollDiceFn: ((repeat: number) => void) | null = null;

    render(
      <DiceHarness
        onReady={(fn) => {
          rollDiceFn = fn;
        }}
        onEnd={onEnd}
      />,
    );

    expect(screen.getByTestId("dice-harness")).toBeInTheDocument();
    expect(rollDiceFn).not.toBeNull();

    act(() => {
      rollDiceFn?.(3);
    });

    // rollDice schedules 3 recursive timeouts at 50ms each.
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onEnd).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("does not call onDiceRollEnd after unmount (mount guard)", () => {
    vi.useFakeTimers();

    const onEnd = vi.fn();
    let rollDiceFn: ((repeat: number) => void) | null = null;

    const { unmount } = render(
      <DiceHarness
        onReady={(fn) => {
          rollDiceFn = fn;
        }}
        onEnd={onEnd}
      />,
    );

    expect(rollDiceFn).not.toBeNull();

    unmount();

    act(() => {
      rollDiceFn?.(3);
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onEnd).toHaveBeenCalledTimes(0);

    vi.useRealTimers();
  });
});

