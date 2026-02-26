import { useState } from "react";
import type { Word } from "../utils/types";

export const useDictionaryCheck = (): {
  checkedWords: Word[];
  areResultsLoading: boolean;
  checkWords: (words: Word[]) => Promise<void>;
  resetCheckedWords: () => void;
} => {
  const [checkedWords, setCheckedWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkWords = async (words: Word[]) => {
    try {
      setIsLoading(true);
      const resp = await fetch(
        "https://sjp-check-api.vercel.app/validate-words-boggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words }),
        },
      );
      const parsedResp = await resp.json();

      setCheckedWords(parsedResp);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error, "word check failed");
    }
  };

  const resetCheckedWords = () => {
    setCheckedWords([]);
  };

  return {
    areResultsLoading: isLoading,
    checkedWords,
    checkWords,
    resetCheckedWords,
  };
};
