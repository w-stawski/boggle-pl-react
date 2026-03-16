import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Button from "./Button";

test("button should be clickable and fire the click event", async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();

  render(<Button onClick={handleClick}>Click Me</Button>);

  const button = screen.getByRole("button", { name: /click me/i });
  await user.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("button should be disabled when the disabled prop is true", () => {
  render(<Button disabled>Can't Click Me</Button>);

  const button = screen.getByRole("button", { name: /can't click me/i });
  expect(button).toBeDisabled();
});

test("button should accept and apply custom tailwind classes", () => {
  render(<Button className="bg-red-500">Red Button</Button>);

  const button = screen.getByRole("button", { name: /red button/i });
  expect(button).toHaveClass("bg-red-500");
});
