import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Game from "./Game";
import { SettingsContext } from "../../contexts/SettingsContext";
import { MemoryRouter } from "react-router-dom";

const mockSettings = {
  timeLimit: 90,
  roundLimit: 5,
  currentRound: 1,
  isWordBreakingAllowed: false,
  numberOfPlayers: 1,
  setTimeLimit: vi.fn(),
  setRoundLimit: vi.fn(),
  setIsWordBreakingAllowed: vi.fn(),
  setNumberOfPlayers: vi.fn(),
  setCurrentRound: vi.fn(),
};

test("should show the game board with the roll dice button initially", () => {
  render(
    <MemoryRouter>
      <SettingsContext.Provider value={mockSettings}>
        <Game />
      </SettingsContext.Provider>
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("button", { name: "game.rollDice" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/words \(0\)/i)).toBeInTheDocument();
});

test("should display the current round and player info", () => {
  render(
    <MemoryRouter>
      <SettingsContext.Provider value={mockSettings}>
        <Game />
      </SettingsContext.Provider>
    </MemoryRouter>,
  );

  expect(screen.getByText(/RND:\s*1/)).toBeInTheDocument();
});
