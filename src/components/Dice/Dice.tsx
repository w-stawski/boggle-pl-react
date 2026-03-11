type DiceProps = {
  value: string;
  isSelected: boolean;
  wasInvalid: boolean;
  onLetterSelect: () => void;
};

export default function Dice({
  value,
  isSelected,
  wasInvalid,
  onLetterSelect,
}: DiceProps) {
  return (
    <button
      onClick={onLetterSelect}
      // ARIA state to communicate selection status to assistive technologies.
      aria-pressed={isSelected}
      // Detailed label for better context in screen readers.
      aria-label={`Letter ${value}${isSelected ? ", selected" : ""}`}
      className={`relative flex aspect-square items-center justify-center border-4 border-black text-4xl font-black uppercase transition-all sm:text-5xl ${wasInvalid ? "animate-shake bg-ui-error" : ""} ${
        isSelected
          ? "translate-x-1 translate-y-1 bg-[#00FF66] shadow-none"
          : "bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
      } `}
    >
      {/* Visual letter value, scaled up slightly when selected for better feedback */}
      <span className={isSelected ? "scale-110" : ""}>{value}</span>
    </button>
  );
}
