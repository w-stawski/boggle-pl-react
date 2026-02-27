import type { Dispatch, SetStateAction } from "react";

export interface Letter {
  val: string;
  id: string;
  position: { row: number; column: number };
}
export interface Word {
  val: string;
  points: number;
}

export interface GameContextType {
  timeLimit: number;
  roundLimit: number;
  setTimeLimit: Dispatch<SetStateAction<number>>;
  setRoundLimit: Dispatch<SetStateAction<number>>;
}
