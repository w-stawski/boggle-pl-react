import { memo } from "react";
import Button from "../Button/Button";

type SelectedLettersProps = {
  word: string;
  onOkClickFn: () => void;
  disabled: boolean;
};

export default memo(function SelectedLetters({
  word,
  onOkClickFn,
  disabled,
}: SelectedLettersProps) {
  return (
    <section className="bg-ui-secondary shadow-dice rounded-sm px-4 py-2">
      <div className="flex justify-between">
        <span className="flex items-center text-2xl sm:text-3xl md:text-4xl">
          {word ? word : "..."}
        </span>
        <Button
          className="bg-ui-primary"
          onClickFn={onOkClickFn}
          disabled={disabled}
        >
          OK
        </Button>
      </div>
    </section>
  );
});
