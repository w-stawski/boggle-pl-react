import { useState, useEffect } from "react";

export const useTimer = (countdownTime: number, onTimeUp: () => void) => {
  const [seconds, setSeconds] = useState(countdownTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const setupTimer = () => {
    setSeconds(countdownTime);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((secondsLeft) => {
          if (!secondsLeft) {
            setIsTimerRunning(false);
            onTimeUp();
            return 0;
          }
          return secondsLeft - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, onTimeUp]);

  return { seconds, startTimer: setupTimer };
};
