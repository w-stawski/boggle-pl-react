import { useState } from "react";

import {
  checkIfLetterValid,
  getDicePlaceholders,
  getDiceRandomValues,
} from "./utils/letters.js";
import type { Letter } from "./utils/types.js";
import Dicebox from "./components/Dicebox/Dicebox.js";
import "./App.css";
import { useTimer } from "./hooks/useTimer.js";

const lettersPlaceHolder = getDicePlaceholders();

function App() {
  const [round, setRound] = useState(0);
  const [diceValues, setDiceValues] = useState<Letter[]>(lettersPlaceHolder);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<string[]>([]);

  const [showModal, setShowModal] = useState<boolean | null>(null);

  const { seconds, startTimer } = useTimer(10, () => {
    setSelectedLetters([]);
    setShowModal(true);
  });

  const word = selectedLetters.map((letter: Letter) => letter.val).join(" ");

  const handleSelectedLettersUpdate = (selectedLetter: Letter | null): void => {
    if (!selectedLetter) {
      setSelectedLetters([]);
      return;
    }

    if (!checkIfLetterValid(selectedLetter, selectedLetters)) {
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
    setDiceValues(getDiceRandomValues());

    if (repeat) {
      setTimeout(() => onDiceRoll(--repeat), 50);
      return;
    }

    handleSelectedLettersUpdate(null);
    startTimer();
  };

  const setupNextRound = () => {
    setShowModal(false);
    setSelectedLetters([]);
    setWords([]);
    setRound((count) => ++count);
  };

  const onWordAccept = () => {
    setWords((words) => [...words, word]);
    handleSelectedLettersUpdate(null);
  };

  return (
    <div className="main-container">
      {/*  TODO: use portal, change to modal, user set round limit time limit, make modal reusable */}
      {showModal && (
        <div
          onClick={() => setupNextRound()}
          className="absolute w-screen h-screen bg-gray-600 p-10"
        >
          <h1>TIME IS UP!</h1>
          <ul className="mt-5">
            {words.map((word) => (
              <li key={word}>{word}</li>
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
      {!!seconds && (
        <div className="selected-letter-container px-4 py-2 my-4 rounded-sm min-w-37.5">
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
        letters={diceValues}
        onLetterSelect={handleSelectedLettersUpdate}
        selectedLettersIds={selectedLetters.map((letter) => letter.id)}
      />
      <ul className="mt-5">
        {words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
