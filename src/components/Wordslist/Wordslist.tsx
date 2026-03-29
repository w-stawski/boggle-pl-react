import { memo, useEffect, useRef } from "react";
import type { Word } from "../../utils/types";
import { Star, Skull, Loader2 } from "lucide-react";

interface WordslistProps {
  words: Word[];
  isFinalBoard?: boolean;
  isLoading?: boolean;
  bottomText?: string;
  blackoutWords?: boolean;
}

export default memo(function Wordslist({
  words,
  isFinalBoard,
  isLoading,
  bottomText,
  blackoutWords,
}: WordslistProps) {
  const total = isFinalBoard
    ? words.reduce((acc, word) => acc + (word.points ?? 0), 0)
    : null;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [words]);

  return (
    <div className="flex h-full flex-col overflow-hidden font-mono">
      {isFinalBoard && (
        <h1 className="mb-2 border-b-2 border-black bg-black p-1 text-center text-sm font-black text-white uppercase">
          Results
        </h1>
      )}

      <ul className="flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 p-4">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-xs font-black uppercase italic">Checking...</p>
          </div>
        ) : (
          words.map((word: Word) => (
            <li
              key={word.val}
              className={`flex items-center justify-between border-2 border-black p-2 text-sm font-black uppercase ${word.points === 0 ? "bg-zinc-100 text-zinc-400" : "bg-white"}`}
            >
              <div className="flex items-center gap-2 truncate">
                {isFinalBoard && (
                  <div>
                    {word.points === 0 ? (
                      <Skull size={12} />
                    ) : (
                      <Star size={12} className="text-[#FFDE00]" />
                    )}
                  </div>
                )}

                <span
                  className={
                    word.points === 0 && !blackoutWords
                      ? "truncate line-through"
                      : "truncate"
                  }
                >
                  {blackoutWords ? "********" : word.val}
                </span>
              </div>
              {word.points !== null && (
                <span className="bg-black px-2 py-0.5 text-[10px] text-white">
                  +{word.points}
                </span>
              )}
            </li>
          ))
        )}
        <div ref={bottomRef} />
      </ul>

      {(isFinalBoard || bottomText) && (
        <div className="mt-2 shrink-0 border-t-2 border-black pt-2">
          {isFinalBoard && (
            <p className="text-right text-2xl font-black text-[#FF00FF] uppercase italic">
              Total: {total}
            </p>
          )}
          {bottomText && (
            <h1 className="animate-pulse bg-black p-1 text-center text-[10px] font-black text-white uppercase">
              {bottomText}
            </h1>
          )}
        </div>
      )}
    </div>
  );
});
