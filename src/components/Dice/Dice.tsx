type DiceProps = {
  value: string;
  isSelected: boolean;
  wasInvalid: boolean;
  onLetterSelect: () => void;
};

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
    <button
      onClick={onLetterSelect}
      className={`shadow-dice flex aspect-square items-center justify-center rounded-xl text-6xl duration-200 ${isSelectedClass} ${isInvalidClass}`}
    >
      {value}
    </button>
  );
}
