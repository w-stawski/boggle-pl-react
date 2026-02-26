import type { Word } from "../../utils/types";

interface WordslistProps {
  words: Word[];
  isFinalBoard?: boolean;
}

export default function Wordslist({ words, isFinalBoard }: WordslistProps) {
  let total = 0;
  const template = words.reverse().map((word: Word) => {
    const { val, points } = word;
    total = total + points;
    return points === 0 ? (
      <li className="line-through" key={crypto.randomUUID()}>
        {val}
      </li>
    ) : (
      <li key={crypto.randomUUID()}>
        {val}: {points}
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
}
