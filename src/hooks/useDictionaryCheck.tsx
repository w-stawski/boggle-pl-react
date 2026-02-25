import { useEffect, useRef, useState, type RefObject } from "react";
import type { Word } from "../utils/types";

export const useDictionaryCheck = () => {
  const dictionaryRef: RefObject<string[]> = useRef([]);
  const [checkedWords, setCheckedWords] = useState<Word[]>([]);

  const checkWords = (words: Word[]) => {
    const wordsAfterCheck = words.map((word: Word) => {
      const { val } = word;
      return {
        ...word,
        points: dictionaryRef.current.find(
          (dictEntry: string) => dictEntry === val.toLowerCase(),
        )
          ? val.length - 2
          : 0,
      };
    });

    setCheckedWords(wordsAfterCheck);
  };
  useEffect(() => {
    fetch("/dictionary.txt")
      .then((res) => res.text())
      .then((text) => {
        const words = text.split(/\r?\n/);

        dictionaryRef.current = words;
      });
  }, []);

  return { checkedWords, checkWords: checkWords };
};
