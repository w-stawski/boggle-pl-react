import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Diceboard from "./Diceboard";

const mockLetters = [
  { id: "1", val: "A", position: { row: 0, column: 0 } },
  { id: "2", val: "B", position: { row: 0, column: 0 } },
  { id: "3", val: "C", position: { row: 0, column: 0 } },
];

test("renders the correct number of dice with correct values", () => {
  render(
    <Diceboard
      letters={mockLetters}
      selectedLettersIds={[]}
      invalidLetterId=""
      onLetterSelect={vi.fn()}
    />,
  );

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(3);
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument();
});

test("correctly identifies selected and invalid dice", () => {
  render(
    <Diceboard
      letters={mockLetters}
      selectedLettersIds={["1"]}
      invalidLetterId="2"
      onLetterSelect={vi.fn()}
    />,
  );

  const diceA = screen.getByRole("button", { name: "A" });
  const diceB = screen.getByRole("button", { name: "B" });

  expect(diceA).toHaveClass("bg-ui-accent");
  expect(diceB).toHaveClass("animate-shake");
});

test("calls onLetterSelect with correct data when a dice is clicked", () => {
  const onSelectSpy = vi.fn();
  render(
    <Diceboard
      letters={mockLetters}
      selectedLettersIds={[]}
      invalidLetterId=""
      onLetterSelect={onSelectSpy}
    />,
  );

  const diceC = screen.getByRole("button", { name: "C" });
  fireEvent.click(diceC);

  expect(onSelectSpy).toHaveBeenCalledWith(mockLetters[2], false);
});

test("applies disabled styles and pointer-events-none", () => {
  const { container } = render(
    <Diceboard
      letters={mockLetters}
      selectedLettersIds={[]}
      invalidLetterId=""
      onLetterSelect={vi.fn()}
      disabled={true}
    />,
  );

  const grid = container.firstChild;
  expect(grid).toHaveClass("opacity-50", "pointer-events-none");
});
