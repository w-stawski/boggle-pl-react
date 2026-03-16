import { useState, useRef, useEffect, useCallback } from "react";
import type { Word } from "../utils/types";

/**
 * Custom hook for validating words against an external API.
 * Features race condition protection and unmount safety.
 */
export const useDictionaryCheck = (): {
  checkedWords: Word[];
  areResultsLoading: boolean;
  checkWords: (words: Word[]) => Promise<Word[] | undefined>;
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
  const checkWords = useCallback(async (words: Word[]) => {
    const currentRequest = ++requestCount.current;

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

      if (!resp.ok) throw new Error("Network response was not ok");
      const parsedResp: Word[] = await resp.json();

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
