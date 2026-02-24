import "./Dice.css";

export default function Dice({
  value,
  onLetterSelect,
  wasInvalid,
  isSelected,
}: {
  value: string;
  isSelected: boolean;
  wasInvalid: boolean;
  onLetterSelect: () => void;
}) {
  const isSelectedClass = isSelected ? "selected" : "";
  const isInvalidClass = wasInvalid ? "invalid" : "";
  return (
    // change to button ?
    <div
      onClick={onLetterSelect}
      className={`dice-container text-7xl ${isSelectedClass} ${isInvalidClass}`}
    >
      {value}
    </div>
  );
}
