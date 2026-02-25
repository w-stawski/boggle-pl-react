import { useEffect, useState } from "react";
import type { Word } from "../utils/types";

export const useDictionaryCheck = () => {
  const [checkedWords, setCheckedWords] = useState<Word[]>([]);

  const checkWords = async (words: Word[]) => {
    // todo: check duplicates
    try {
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
    } catch (error) {
      console.log(error, "word check failed");
    }
  };

  return { checkedWords, checkWords: checkWords };
};
