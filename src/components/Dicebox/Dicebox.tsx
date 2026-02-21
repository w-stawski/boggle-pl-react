import { useState } from "react";
import Dice from "../Dice/Dice";
import "./Dicebox.css";
import type { Letter } from "../../assets/types";

export default function Dicebox({ letters }: { letters: Letter[] }) {
  const [selectedLettersIds, setSelectedLettersId] = useState<string[]>([]);

  const handleLetterSelect = (selectedLetter: string): void => {
    setSelectedLettersId((letterArr) => [...letterArr, selectedLetter]);
  };

  return (
    <>
      <div className="dicebox-container">
        {letters.map((letter, index) => (
          <Dice
            key={index}
            onLetterSelect={() => handleLetterSelect(letter.id)}
            isSelected={selectedLettersIds.includes(letter.id)}
            value={letter.val}
          />
        ))}
      </div>
    </>
  );
}
