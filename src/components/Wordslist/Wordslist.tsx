import type { Word } from "../../utils/types";

export default function Wordslist({ words }: { words: Word[] }) {
  return (
    <div className="flex">
      <ul>
        {words.map((word) => (
          <li key={word.val}>{word.val}</li>
        ))}
      </ul>
    </div>
  );
}
