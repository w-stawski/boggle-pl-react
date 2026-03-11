import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Custom hook to manage a countdown timer.
 * Optimized to avoid interval re-creation on every tick and handle callback stability.
 */
export const useTimer = (onTimeUp: () => void) => {
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Use a ref for the callback to prevent the effect from re-running if the callback changes.
  // This ensures the timer remains accurate and doesn't reset or glitch.
  const onTimeUpRef = useRef(onTimeUp);

  // Update the ref whenever onTimeUp changes without triggering side effects.
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  /**
   * Initializes and starts the timer.
   */
  const setupTimer = useCallback((countdownTime: number) => {
    setSeconds(countdownTime);
    setIsTimerRunning(true);
  }, []);

  useEffect(() => {
    // Only start the interval if the timer is explicitly running and has time remaining.
    if (!isTimerRunning || seconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        // Check if time has run out.
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          // Execute the callback stored in the ref.
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up the interval on unmount or when dependencies change.
    return () => clearInterval(interval);
  }, [isTimerRunning]); // Depend only on running state to keep the interval stable.

  return { seconds, startTimer: setupTimer };
};
