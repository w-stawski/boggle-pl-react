import { memo } from "react";
import Button from "../Button/Button";
import { CheckCircle } from "lucide-react";

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
    <section className="w-full border-4 border-black bg-white px-3 py-1 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between gap-4">
        <span className="truncate pr-5 text-3xl font-black tracking-tighter text-black uppercase italic">
          {word || "..."}
        </span>
        <Button
          className={`text-l h-12 min-w-[100px] border-2 bg-[#00FF66] shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${disabled ? "opacity-20" : "hover:bg-[#00e65c]"}`}
          onClickFn={onOkClickFn}
          disabled={disabled}
        >
          OK
        </Button>
      </div>
    </section>
  );
});
