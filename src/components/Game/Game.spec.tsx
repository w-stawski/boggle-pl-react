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

test("renders game board with roll button", () => {
  render(
    <MemoryRouter>
      <SettingsContext.Provider value={mockSettings}>
        <Game />
      </SettingsContext.Provider>
    </MemoryRouter>,
  );

  expect(screen.getByText(/roll the dice/i)).toBeInTheDocument();
});
