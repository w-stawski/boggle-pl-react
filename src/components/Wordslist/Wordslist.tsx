import { memo } from "react";
import type { Word } from "../../utils/types";

interface WordslistProps {
  words: Word[];
  isFinalBoard?: boolean;
}

export default memo(function Wordslist({
  words,
  isFinalBoard,
}: WordslistProps) {
  const total = isFinalBoard
    ? words.reduce((acc, word) => acc + word.points, 0)
    : null;

  const template = words.map((word: Word) => {
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
  });
  return (
    <div className="flex flex-col items-center justify-center h-full text-3xl">
      {isFinalBoard && <h1 className="underline">Results</h1>}
      <ul className="text-center my-3">{template}</ul>

      {isFinalBoard && (
        <p className="underline text-ui-accent">Total: {total}</p>
      )}
    </div>
  );
});
