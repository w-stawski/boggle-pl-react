import { useState, type ReactNode } from "react";
import { SettingsContext } from "./SettingsContext";

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [timeLimit, setTimeLimit] = useState<number>(90);
  const [roundLimit, setRoundLimit] = useState<number>(5);
  const [isWordBreakingAllowed, setIsWordBreakingAllowed] =
    useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{
        timeLimit,
        roundLimit,
        isWordBreakingAllowed,
        numberOfPlayers,
        setRoundLimit,
        setTimeLimit,
        setIsWordBreakingAllowed,
        setNumberOfPlayers,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
