import { useEffect, useState } from "react";

import "./App.css";
import Dicebox from "./components/Dicebox/Dicebox";
import { diceLetters, initDiceLetters } from "./assets/letters.js";

function App() {
  const [count, setCount] = useState(0);
  const [letters, setLetters] = useState<string[]>(initDiceLetters);
  const [seconds, setSeconds] = useState<number>(0);

  const onDiceRoll = () => {
    setLetters(getDiceLetters());
    setCount((count) => ++count);
  };

  const getDiceLetters = () => {
    return diceLetters.map((item) => {
      const randomIndex = Math.floor(Math.random() * 6);
      return item[randomIndex];
    });
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
