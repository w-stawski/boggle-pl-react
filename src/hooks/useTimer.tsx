import { useEffect, useState } from "react";

export const useTimer = (onTimeUp: () => void) => {
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const setupTimer = (countdownTime: number) => {
    setSeconds(countdownTime);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (!isTimerRunning || !seconds) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((secondsLeft) => {
        if (seconds === 1) {
          onTimeUp();
        }
        return secondsLeft - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, seconds, onTimeUp]);

  return { seconds, startTimer: setupTimer };
};
