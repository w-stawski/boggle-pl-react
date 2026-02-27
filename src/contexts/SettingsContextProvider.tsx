import { useState, type ReactNode } from "react";
import { SettingsContext } from "./SettingsContext";

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [timeLimit, setTimeLimit] = useState(90);
  const [roundLimit, setRoundLimit] = useState(5);

  return (
    <SettingsContext.Provider
      value={{ timeLimit, roundLimit, setRoundLimit, setTimeLimit }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
