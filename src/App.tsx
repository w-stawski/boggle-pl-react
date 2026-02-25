import { useState } from "react";

import "./App.css";
import Button from "./components/Button/Button.js";
import Dicebox from "./components/Dicebox/Dicebox.js";
import { useDictionaryCheck } from "./hooks/useDictionaryCheck.js";
import { useTimer } from "./hooks/useTimer.js";
import { checkIfLetterValid, getDiceRandomValues } from "./utils/letters.js";
import type { Letter, Word } from "./utils/types.js";
import Wordslist from "./components/Wordslist/Wordslist.js";
function App() {
  const [diceValues, setDiceValues] = useState<Letter[]>(getDiceRandomValues());
  const [invalidLetterId, setiInvalidLetterId] = useState<string>("");
  const [round, setRound] = useState(1);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<Word[]>([]);

  const [showModal, setShowModal] = useState<boolean | null>(null);

  const { seconds, startTimer } = useTimer(() => {
    setSelectedLetters([]);
    setShowModal(true);
    checkWords(words);
  });

  const { checkedWords, checkWords } = useDictionaryCheck();

  const word = selectedLetters.map((letter: Letter) => letter.val).join("");

  const handleSelectedLettersUpdate = (selectedLetter: Letter): void => {
    setiInvalidLetterId("");

    if (!selectedLetter) {
      setSelectedLetters([]);
      return;
    }

    if (!checkIfLetterValid(selectedLetter, selectedLetters)) {
      setiInvalidLetterId(selectedLetter.id);
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

    // setDiceValues(getDiceValuesWithSetWord("kurwoj"));
    handleSelectedLettersUpdate(null);
    startTimer(90);
  };

  const setupNextRound = () => {
    setShowModal(false);
    setSelectedLetters([]);
    setWords([]);
    setRound((count) => ++count);
  };

  const onWordAccept = () => {
    setWords((words) => [...words, { val: word, isIncorrect: null }]);
    handleSelectedLettersUpdate(null);
  };

  return (
    <>
      <div className="grid grid-cols-4 justify-items-center">
        <div className="hidden lg:block w-full">
          <Wordslist words={words} />
        </div>
        <div className="col-span-4 lg:col-span-2 flex flex-col justify-center w-full gap-5 p-3 text-xl sm:text-2xl md:text-3xl text-ui-text">
          {/*  TODO: use portal, change to modal, user set round limit time limit, make modal reusable, intro, header, footer ,favicon, points */}
          {showModal && (
            <div
              onClick={() => setupNextRound()}
              className="absolute w-screen h-screen bg-gray-600 p-10"
            >
              <h1>TIME IS UP!</h1>
              <ul className="mt-5">
                {checkedWords.map((word) => (
                  <li
                    className={word.isIncorrect ? "highlighted" : ""}
                    key={word.val}
                  >
                    {word.val}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <section className="text-center">
            <p>Round: {round}</p>

            <p
              className={`${!seconds ? "invisible" : ""} ${seconds < 10 ? "text-ui-accent bg-black" : ""}`}
            >
              Seconds Remaining: {seconds}
            </p>
          </section>
          <Button isDisabled={!!seconds} onClickFn={() => onDiceRoll(15)}>
            roll the dice
          </Button>
          {
            <div className="bg-white px-4 py-2 rounded-sm shadow-dice">
              <div className="flex justify-between">
                <span className="flex items-center text-2xl  sm:text-3xl md:text-4xl">
                  {word ? word : "..."}
                </span>
                <Button
                  onClickFn={onWordAccept}
                  isDisabled={selectedLetters.length < 3}
                >
                  OK
                </Button>
              </div>
            </div>
          }
          <Dicebox
            letters={diceValues}
            onLetterSelect={handleSelectedLettersUpdate}
            selectedLettersIds={selectedLetters.map((letter) => letter.id)}
            invalidLetterId={invalidLetterId}
            isDisabled={!seconds}
          />
          <ul className="mt-5">
            {words.map((word) => (
              <li key={word.val}>{word.val}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
