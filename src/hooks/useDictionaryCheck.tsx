import { useState, useRef, useEffect, useCallback } from "react";
import type { Word } from "../utils/types";

const getBogglePoints = (wordLength: number): number => {
  if (wordLength <= 2) return 0;
  if (wordLength <= 4) return 1;
  if (wordLength === 5) return 2;
  if (wordLength === 6) return 3;
  if (wordLength === 7) return 5;
  return 11;
};

const checkEnglishWords = async (words: Word[]): Promise<Word[]> => {
  const checkedWords = await Promise.all(
    words.map(async (word) => {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.val.toLowerCase())}`,
      );

      if (!response.ok) {
        return { ...word, points: 0 };
      }

      return { ...word, points: getBogglePoints(word.val.length) };
    }),
  );

  return checkedWords;
};

const checkPolishWords = async (words: Word[]): Promise<Word[]> => {
  const response = await fetch("https://sjp-check-api.vercel.app/validate-words-boggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SJP_API_KEY}`,
    },
    body: JSON.stringify({ words, lang: "pl" }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const parsedResponse: Word[] = await response.json();
  return parsedResponse;
};

/**
 * Custom hook for validating words against an external API.
 * Features race condition protection and unmount safety.
 */
export const useDictionaryCheck = (): {
  checkedWords: Word[];
  areResultsLoading: boolean;
  checkWords: (words: Word[], language: string) => Promise<Word[] | undefined>;
  resetCheckedWords: () => void;
} => {
  const [checkedWords, setCheckedWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref to track component mount status to prevent updates on unmounted component.
  const isMounted = useRef(false);

  // Ref to track the current request ID to handle race conditions where a newer request
  // might finish after an older one, leading to inconsistent UI state.
  const requestCount = useRef(0);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Sends a list of words to the validation API.
   * Ensures that only the most recent request's data is applied to the state.
   */
  const checkWords = useCallback(async (words: Word[], language: string) => {
    const currentRequest = ++requestCount.current;
    const normalizedLanguage = language === "en" ? "en" : "pl";

    try {
      setIsLoading(true);
      const parsedResp =
        normalizedLanguage === "en"
          ? await checkEnglishWords(words)
          : await checkPolishWords(words);

      // Only update state if the component is still mounted and this is the latest request.
      if (isMounted.current && currentRequest === requestCount.current) {
        setCheckedWords(parsedResp);
        return parsedResp;
      }
    } catch (error) {
      console.error("word check failed", error);
    } finally {
      // Clean up loading state if this is still the relevant request.
      if (isMounted.current && currentRequest === requestCount.current) {
        setIsLoading(false);
      }
    }
    return undefined;
  }, []);

  const resetCheckedWords = useCallback(() => {
    setCheckedWords([]);
  }, []);

  return {
    areResultsLoading: isLoading,
    checkedWords,
    checkWords,
    resetCheckedWords,
  };
};
