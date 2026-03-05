import { memo, useEffect, useRef } from "react";
import type { Word } from "../../utils/types";

type WordslistProps = {
  words: Word[];
  isFinalBoard?: boolean;
  isLoading?: boolean;
  bottomText?: string;
  blackoutWords?: boolean;
};

export default memo(function Wordslist({
  words,
  isFinalBoard,
  isLoading,
  bottomText,
  blackoutWords,
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
        <li
          className={blackoutWords ? "bg-ui-error" : "line-through"}
          key={word.val}
        >
          {val}
        </li>
      ) : (
        <li className="flex mb-1" key={word.val}>
          <p className={`mr-2 ${blackoutWords ? "bg-black" : ""}`}> {val}</p>{" "}
          <p> {points}</p>
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
