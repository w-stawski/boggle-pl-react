import { useEffect, useState } from "react";

import "./App.css";
import Dicebox from "./components/Dicebox/Dicebox";
import { diceLetters } from "./assets/letters.js";
import type { Letter } from "./assets/types.js";

function App() {
  const [count, setCount] = useState(0);
  const [letters, setLetters] = useState<Letter[]>(
    Array(16).fill({ val: "X", id: null }),
  );
  const [seconds, setSeconds] = useState<number>(0);

  const onDiceRoll = () => {
    setLetters(getDiceLetters());
    setCount((count) => ++count);
  };

  const getDiceLetters = () => {
    const randomOrderDicesArr = diceLetters.sort(() => Math.random() - 0.5);
    const randomDicesValues = randomOrderDicesArr.map((item) => {
      const randomIndex = Math.floor(Math.random() * 6);
      return item[randomIndex];
    });

    return randomDicesValues;
  };

  return (
    <div className="main-container">
      <p>Round: {count}</p>
      <button onClick={onDiceRoll}>roll the dice</button>

      <Dicebox letters={letters} />
    </div>
  );
}

export default App;
