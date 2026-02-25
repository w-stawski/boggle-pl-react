import { useEffect, useState } from "react";

export const useTimer = (onTimeUp: () => void) => {
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const setupTimer = (countdownTime: number) => {
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
