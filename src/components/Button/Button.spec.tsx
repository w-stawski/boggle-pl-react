import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Button from "./Button";

test("disabled props changes disable state of button button", async () => {
  const { rerender } = render(<Button />);
  const button = screen.getByRole("button") as HTMLButtonElement;
  expect(button.disabled).toBeFalsy();

  rerender(<Button disabled />);

  expect(button.disabled).toBeTruthy();
});

test("className props changes class", async () => {
  render(<Button className="mockClass" />);

  const button = screen.getByRole("button") as HTMLButtonElement;

  expect(button).toHaveClass("mockClass");
});

test("Method passed with onClick props should be called on button click", async () => {
  const spyMethod = vi.fn();
  const user = userEvent.setup();
  render(<Button onClickFn={spyMethod} />);
  const button = screen.getByRole("button") as HTMLButtonElement;

  await user.click(button);

  expect(spyMethod).toBeCalled();
});
