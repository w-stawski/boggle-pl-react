import { createContext } from "react";
import type { GameContextType } from "../utils/types";

export const SettingsContext = createContext<GameContextType | null>(null);
