export type Letter = {
  val: string;
  id: string;
  /** Set on the live board; `null` on dice face templates in `constants`. */
  position: { row: number; column: number } | null;
};
export type Word = {
  val: string;
  /** `null` until validated; `0` if invalid; positive if scored. */
  points: number | null;
};
