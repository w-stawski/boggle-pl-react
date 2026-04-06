type DiceProps = {
  value: string;
  isSelected: boolean;
  wasInvalid: boolean;
  onLetterSelect: () => void;
  /** For grid keyboard navigation in Diceboard. */
  index?: number;
};

export default function Dice({
  value,
  isSelected,
  wasInvalid,
  onLetterSelect,
  index,
}: DiceProps) {
  return (
    <button
      onClick={onLetterSelect}
      aria-pressed={isSelected}
      aria-label={`Letter ${value}${isSelected ? ", selected" : ""}`}
      data-dice="true"
      data-index={index}
      type="button"
      className={`relative flex aspect-square items-center justify-center border-4 border-black text-4xl font-black uppercase cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-5xl ${
        wasInvalid ? "animate-shake bg-red-500" : ""
      } ${
        isSelected
          ? "translate-1 bg-[#00FF66] shadow-none"
          : "bg-white shadow-[6px_6px_0_0_#000] hover:-translate-0.5 hover:shadow-[8px_8px_0_0_#000] active:translate-1 active:shadow-none"
      } `}
    >
      {/* Visual letter value, scaled up slightly when selected for better feedback */}
      <span className={isSelected ? "scale-110" : ""}>{value}</span>
    </button>
  );
}
