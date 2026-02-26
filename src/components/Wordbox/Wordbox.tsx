import Button from "../Button/Button";

interface WordboxProps {
  word: string;
  onOkClickFn: () => void;
  isDisabled: boolean;
}

export default function Wordbox({
  word,
  onOkClickFn,
  isDisabled,
}: WordboxProps) {
  return (
    <div className="bg-ui-secondary px-4 py-2 rounded-sm shadow-dice">
      <div className="flex justify-between">
        <span className=" flex items-center text-2xl  sm:text-3xl md:text-4xl">
          {word ? word : "..."}
        </span>
        <Button onClickFn={onOkClickFn} isDisabled={isDisabled}>
          OK
        </Button>
      </div>
    </div>
  );
}
