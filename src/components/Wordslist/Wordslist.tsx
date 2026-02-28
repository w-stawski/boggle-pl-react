import { memo, useEffect, useRef } from "react";
import type { Word } from "../../utils/types";

interface WordslistProps {
  words: Word[];
  isFinalBoard?: boolean;
  isLoading?: boolean;
  bottomText?: string;
}

export default memo(function Wordslist({
  words,
  isFinalBoard,
  isLoading,
  bottomText,
}: WordslistProps) {
  const total = isFinalBoard
    ? words.reduce((acc, word) => acc + word.points, 0)
    : null;

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [words]);

  const template = isLoading ? (
    <p>checking...</p>
  ) : (
    words.map((word: Word) => {
      const { val, points } = word;
      return points === 0 ? (
        <li className="line-through" key={word.val}>
          {val}
        </li>
      ) : (
        <li key={word.val}>
          {val} {points}
        </li>
      );
    })
  );
  return (
    <div className="flex flex-col items-center justify-center h-full text-3xl select-none">
      {isFinalBoard && <h1 className="underline">Results</h1>}
      <ul className="text-center max-h-3/4 overflow-y-auto my-3">
        {template}
        <div ref={bottomRef}></div>
      </ul>

      {isFinalBoard && (
        <p className="underline text-ui-accent">Total: {total}</p>
      )}
      {bottomText && <h1 className="mt-5">{bottomText}</h1>}
    </div>
  );
});
