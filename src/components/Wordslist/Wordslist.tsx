import type { Word } from "../../utils/types";

export default function Wordslist({ words }: { words: Word[] }) {
  return (
    <div className="flex items-center justify-center h-full text-3xl">
      <ul>
        {words.reverse().map((word: Word) => {
          const { val, points } = word;
          return points === 0 ? (
            <li className="line-through" key={crypto.randomUUID()}>
              {word.val}
            </li>
          ) : (
            <li key={crypto.randomUUID()}>
              {word.val} {points}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
