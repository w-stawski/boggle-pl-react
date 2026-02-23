import { useEffect, useState } from "react";

import { diceLetters, getDicesPlaceholders } from "./utils/letters.js";
import type { Letter } from "./utils/types.js";
import Dicebox from "./components/Dicebox/Dicebox.js";
import "./App.css";

const lettersPlaceHolder = getDicesPlaceholders();

function App() {
  const [round, setRound] = useState(0);
  const [dicesValues, setDicesValues] = useState<Letter[]>(lettersPlaceHolder);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((secondsLeft) => {
          if (!secondsLeft) {
            setSelectedLetters([]);
            setIsTimerRunning(false);

            return 0;
          }

          return secondsLeft - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const word = selectedLetters.map((letter: Letter) => letter.val).join(" ");

  const handleSelectedLettersUpdate = (selectedLetter: Letter | null): void => {
    if (!selectedLetter) {
      setSelectedLetters([]);
      return;
    }

    let letterDuplicated = false;

    setSelectedLetters((letterArr) => {
      const filteredLetterArr = letterArr.filter((letter) => {
        if (letter.id === selectedLetter.id) {
          letterDuplicated = true;

          return false;
        }

        return true;
      });

      return letterDuplicated
        ? filteredLetterArr
        : [...letterArr, selectedLetter];
    });
  };

  const onDiceRoll = (repeat: number) => {
    setDicesValues(getDiceLetters());
    handleSelectedLettersUpdate(null);

    if (repeat) {
      setTimeout(() => onDiceRoll(--repeat), 50);
      return;
    }

    setSeconds(150);
    setIsTimerRunning(true);
  };

  const getDiceLetters = () => {
    const randomOrderDicesArr = diceLetters.sort(() => Math.random() - 0.5);
    const randomDicesValues = randomOrderDicesArr.map((item) => {
      const randomIndex = Math.floor(Math.random() * 6);

      return item[randomIndex];
    });

    return randomDicesValues;
  };

  const setupNextRound = () => {
    setIsTimerRunning(null);
    setSelectedLetters([]);
    setWords([]);
    setDicesValues(lettersPlaceHolder);
    setRound((count) => ++count);
  };

  const onWordAccept = () => {
    setWords((words) => [...words, word]);
    handleSelectedLettersUpdate(null);
  };

  return (
    <div className="main-container">
      {isTimerRunning === false && (
        <div
          onClick={() => setupNextRound()}
          className="absolute w-screen h-screen bg-gray-600 p-10"
        >
          <h1>TIME IS UP!</h1>
          <ul className="mt-5">
            {words.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex m-3">
        <p className="mr-3">Round: {round}</p>
        {!!seconds && (
          <p className={seconds < 10 ? "alert" : ""}>
            Seconds Remaining: {seconds}
          </p>
        )}
      </div>

      <button className="rounded-sm p-4 mb-3" onClick={() => onDiceRoll(15)}>
        roll the dice
      </button>
      {isTimerRunning && (
        <div className="selected-letter-container px-4 py-2 my-4 rounded-sm min-w-[150px]">
          {selectedLetters.length ? (
            <div className="flex justify-between">
              <h1>{word}</h1>
              <button
                onClick={onWordAccept}
                className="rounded-sm px-2 ml-4"
                disabled={selectedLetters.length < 3}
              >
                OK
              </button>
            </div>
          ) : (
            <p>select letters</p>
          )}
        </div>
      )}
      <Dicebox
        letters={dicesValues}
        onLetterSelect={handleSelectedLettersUpdate}
        selectedLettersIds={selectedLetters.map((letter) => letter.id)}
      />
      <ul className="mt-5">
        {words.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
