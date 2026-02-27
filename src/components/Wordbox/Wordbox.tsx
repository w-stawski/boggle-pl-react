import { memo } from "react";
import Button from "../Button/Button";

interface WordboxProps {
  word: string;
  onOkClickFn: () => void;
  disabled: boolean;
}

export default memo(function Wordbox({
  word,
  onOkClickFn,
  disabled,
}: WordboxProps) {
  return (
    <div className="bg-ui-secondary px-4 py-2 rounded-sm shadow-dice">
      <div className="flex justify-between">
        <span className=" flex items-center text-2xl  sm:text-3xl md:text-4xl">
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
    </div>
  );
});
