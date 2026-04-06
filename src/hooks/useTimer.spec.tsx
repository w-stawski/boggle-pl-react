import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTimer } from "./useTimer";

function TimerHarness({ onTimeUp }: { onTimeUp: () => void }) {
  const { seconds, startTimer } = useTimer(onTimeUp);

  return (
    <div>
      <button type="button" onClick={() => startTimer(2)}>
        start
      </button>
      <span data-testid="seconds">{seconds}</span>
    </div>
  );
}

describe("useTimer", () => {
  it("counts down and calls onTimeUp exactly once", () => {
    vi.useFakeTimers();

    const onTimeUp = vi.fn();
    render(<TimerHarness onTimeUp={onTimeUp} />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "start" }));
    });

    expect(screen.getByTestId("seconds").textContent).toBe("2");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("seconds").textContent).toBe("1");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("seconds").textContent).toBe("0");
    expect(onTimeUp).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

