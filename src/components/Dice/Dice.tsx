interface DiceProps {
  value: string;
  isSelected: boolean;
  wasInvalid: boolean;
  onLetterSelect: () => void;
}

export default function Dice({
  isSelected,
  onLetterSelect,
  value,
  wasInvalid,
}: DiceProps) {
  const isSelectedClass = isSelected
    ? "scale-105 bg-ui-accent"
    : "bg-ui-primary";
  const isInvalidClass = wasInvalid ? "animate-shake" : "";
  return (
    // change to button ?
    <button
      onClick={onLetterSelect}
      className={`flex justify-center items-center rounded-xl
        shadow-dice aspect-square text-6xl duration-200 ${isSelectedClass} ${isInvalidClass}`}
    >
      {value}
    </button>
  );
}
