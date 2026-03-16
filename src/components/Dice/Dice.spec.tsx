import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Dice from "./Dice";

test("dice should show the correct letter value", () => {
  render(
    <Dice
      value="G"
      isSelected={false}
      wasInvalid={false}
      onLetterSelect={vi.fn()}
    />
  );
  
  expect(screen.getByText("G")).toBeInTheDocument();
});

test("dice should call the selection handler when clicked", async () => {
  const onSelect = vi.fn();
  const user = userEvent.setup();
  
  render(
    <Dice
      value="A"
      isSelected={false}
      wasInvalid={false}
      onLetterSelect={onSelect}
    />
  );
  
  await user.click(screen.getByRole("button"));
  expect(onSelect).toHaveBeenCalledTimes(1);
});

test("dice should highlight and scale when selected", () => {
  render(
    <Dice
      value="B"
      isSelected={true}
      wasInvalid={false}
      onLetterSelect={vi.fn()}
    />
  );
  
  const button = screen.getByRole("button");
  expect(button).toHaveClass("bg-[#00FF66]");
  expect(screen.getByText("B")).toHaveClass("scale-110");
});

test("dice should shake and turn red when invalid move is made", () => {
  render(
    <Dice
      value="C"
      isSelected={false}
      wasInvalid={true}
      onLetterSelect={vi.fn()}
    />
  );
  
  const button = screen.getByRole("button");
  expect(button).toHaveClass("animate-shake");
  expect(button).toHaveClass("bg-red-500");
});
