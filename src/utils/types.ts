export interface Letter {
  val: string;
  id: string;
  position: { row: number; column: number };
}
export interface Word {
  val: string;
  isHighlighted: boolean;
}
