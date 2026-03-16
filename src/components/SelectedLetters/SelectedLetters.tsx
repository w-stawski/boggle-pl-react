import { memo } from "react";
import Button from "../Button/Button";

export default memo(function SelectedLetters({
  word,
  onOkClickFn,
  disabled,
}: {
  word: string;
  onOkClickFn: () => void;
  disabled: boolean;
}) {
  return (
    <section className="w-full border-4 border-black bg-white px-3 py-1 shadow-[6px_6px_0_0_#000]">
      <div className="flex items-center justify-between gap-4">
        <span className="truncate pr-5 text-3xl font-black uppercase italic tracking-tighter text-black">
          {word || "..."}
        </span>
        <Button
          className={`h-12 min-w-25 border-2 bg-[#00FF66] text-sm shadow-[4px_4px_0_0_#000] ${disabled ? "opacity-20" : "hover:translate-0.5 hover:shadow-none"}`}
          onClickFn={onOkClickFn}
          disabled={disabled}
        >
          OK
        </Button>
      </div>
    </section>
  );
});
