import { createContext, type Dispatch, type SetStateAction } from "react";

export type GameContextType = {
  timeLimit: number;
  roundLimit: number;
  currentRound: number;
  isWordBreakingAllowed: boolean;
  numberOfPlayers: number;
  setIsWordBreakingAllowed: Dispatch<SetStateAction<boolean>>;
  setTimeLimit: Dispatch<SetStateAction<number>>;
  setRoundLimit: Dispatch<SetStateAction<number>>;
  setNumberOfPlayers: Dispatch<SetStateAction<number>>;
  setCurrentRound: Dispatch<SetStateAction<number>>;
};

export const SettingsContext = createContext<GameContextType>(null);
