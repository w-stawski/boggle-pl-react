import "./Dice.css";

export default function Dice({
  value,
  onLetterSelect,
  isSelected,
}: {
  value: string;
  isSelected: boolean;
  onLetterSelect: () => void;
}) {
  return (
    <div
      onClick={onLetterSelect}
      className={`dice-container ${isSelected ? "selected" : ""}`}
    >
      {value}
    </div>
  );
}
