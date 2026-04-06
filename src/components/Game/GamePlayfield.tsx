import { Ban, Dices } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Letter } from "../../utils/types.js";
import Button from "../Button/Button.js";
import Diceboard from "../Diceboard/Diceboard.js";
import GameInfo from "../GameInfo/GameInfo.js";
import SelectedLetters from "../SelectedLetters/SelectedLetters.js";

type GamePlayfieldProps = {
  currentPlayer: number | null;
  round: number;
  seconds: number;
  word: string;
  selectedLettersCount: number;
  diceValues: Letter[];
  selectedLettersIds: string[];
  invalidLetterId: string;
  duplicateError: string;
  onRollDice: () => void;
  onWordAccept: () => void;
  onLetterSelect: (letter: Letter | null, isSelected?: boolean) => void;
  onDismissDuplicateError: () => void;
};

export default function GamePlayfield({
  currentPlayer,
  round,
  seconds,
  word,
  selectedLettersCount,
  diceValues,
  selectedLettersIds,
  invalidLetterId,
  duplicateError,
  onRollDice,
  onWordAccept,
  onLetterSelect,
  onDismissDuplicateError,
}: GamePlayfieldProps) {
  const { t } = useTranslation();

  return (
    <div className="col-span-1 flex w-full flex-col items-center justify-center gap-4 md:col-span-2">
      <div className="flex w-full max-w-lg flex-col gap-3">
        <GameInfo
          currentPlayer={currentPlayer}
          round={round}
          seconds={seconds}
        />
        <Button
          className="group flex h-14 w-full items-center justify-center gap-4 border-4 border-black bg-[#FF00FF] text-2xl font-black text-black uppercase shadow-[6px_6px_0_0_#000] transition-all hover:translate-1 hover:shadow-none disabled:opacity-50 disabled:grayscale"
          disabled={!!seconds}
          onClickFn={onRollDice}
          aria-label={t("game.rollDice")}
        >
          <Dices
            size={28}
            className="transition-transform group-hover:rotate-12"
          />
          {t("game.rollDice")}
        </Button>
        <SelectedLetters
          word={word}
          onOkClickFn={onWordAccept}
          disabled={selectedLettersCount < 3}
        />
        <Diceboard
          letters={diceValues}
          onLetterSelect={onLetterSelect}
          selectedLettersIds={selectedLettersIds}
          invalidLetterId={invalidLetterId}
          disabled={!seconds}
        />
      </div>

      {duplicateError && (
        <button
          type="button"
          onClick={onDismissDuplicateError}
          role="alert"
          aria-live="assertive"
          className="animate-shake absolute flex max-w-full items-center gap-3 border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#ef4444] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <Ban className="text-red-500" />
          <p className="text-l font-black text-red-500 uppercase">
            {duplicateError}
          </p>
        </button>
      )}
    </div>
  );
}
