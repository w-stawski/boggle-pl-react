import { useState } from "react";
import Dice from "../Dice/Dice";
import "./Dicebox.css";

export default function Dicebox({ letters }: { letters: string[] }) {
  const [selectedLetters, selectLetter] = useState<string[]>([]);

  const handleLetterSelect = (selectedLetter: string): void => {
    selectLetter((letterArr) => [...letterArr, selectedLetter]);
  };

  return (
    <>
      <div className="dicebox-container">
        {letters.map((letter, index) => (
          <Dice
            key={index}
            onLetterSelect={() => handleLetterSelect(letter)}
            isSelected={selectedLetters.includes(letter)}
            value={letter}
          />
        ))}
      </div>
    </>
  );
}
