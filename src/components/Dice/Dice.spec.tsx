import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Dice from "./Dice";

test("Component renders passed value", async () => {
  const mockValue = "X";
  render(
    <Dice
      onLetterSelect={null}
      value={mockValue}
      isSelected={false}
      wasInvalid={false}
    />,
  );
  const value = screen.getByText("X");

  expect(value).toBeInTheDocument();
});

test("invalid Dice should animate when invalid", async () => {
  render(
    <Dice
      onLetterSelect={vi.fn()}
      value=""
      isSelected={false}
      wasInvalid={true}
    />,
  );
  const button = screen.getByRole("button");
  expect(button).toHaveClass("animate-shake");
});

test("Selected should change color from primary to accent", async () => {
  const { rerender } = render(
    <Dice
      onLetterSelect={vi.fn()}
      value=""
      isSelected={false}
      wasInvalid={false}
    />,
  );
  const button = screen.getByRole("button");
  expect(button).not.toHaveClass("bg-ui-accent");

  rerender(
    <Dice
      onLetterSelect={vi.fn()}
      value=""
      isSelected={true}
      wasInvalid={false}
    />,
  );

  expect(button).toHaveClass("bg-ui-accent");
});

test("Method passed with onLetterSelect props should be called on button click", async () => {
  const spyMethod = vi.fn();
  const user = userEvent.setup();
  render(
    <Dice
      onLetterSelect={spyMethod}
      value=""
      isSelected={false}
      wasInvalid={false}
    />,
  );
  const button = screen.getByRole("button") as HTMLButtonElement;

  await user.click(button);

  expect(spyMethod).toBeCalled();
});
