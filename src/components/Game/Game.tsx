import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SettingsContext } from "../../contexts/SettingsContext.js";
import { useDice } from "../../hooks/useDice.js";
import { useDictionaryCheck } from "../../hooks/useDictionaryCheck.js";
import { useTimer } from "../../hooks/useTimer.js";

import {
  checkIfLetterValid,
  getLetterArrWithNewLetter,
} from "../../utils/helpers.js";
import type { Letter, Word } from "../../utils/types.js";

import { Ban, Dices } from "lucide-react";
import Button from "../Button/Button.js";
import Diceboard from "../Diceboard/Diceboard.js";
import GameInfo from "../GameInfo/GameInfo.js";
import Modal from "../Modal/Modal.js";
import SelectedLetters from "../SelectedLetters/SelectedLetters.js";
import Wordslist from "../Wordslist/Wordslist.js";

function Game() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    timeLimit,
    roundLimit,
    isWordBreakingAllowed,
    numberOfPlayers,
    setCurrentRound,
  } = useContext(SettingsContext);

  const [currentPlayer, setCurrentPlayer] = useState<number | null>(
    numberOfPlayers > 1 ? 1 : null,
  );
  const [invalidLetterId, setInvalidLetterId] = useState<string>("");
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [round, setRound] = useState(1);
  const [turnHistory, setTurnHistory] = useState<
    { player: number | null; round: number; score: number; words: Word[] }[]
  >([]);

  useEffect(() => {
    setCurrentRound(round);
  }, [round, setCurrentRound]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalView, setModalView] = useState<
    "turn" | "roundComparison" | "gameSummary"
  >("turn");
  const [duplicateError, setDuplicateError] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState(false);

  const { checkedWords, checkWords, resetCheckedWords, areResultsLoading } =
    useDictionaryCheck();

  const handleTimerUp = useCallback(async () => {
    setShowModal(true);
    setSelectedLetters([]);
    const results = await checkWords(words);

    if (results) {
      const turnScore = results.reduce(
        (acc: number, w: Word) => acc + (w.points || 0),
        0,
      );
      setTurnHistory((prev) => [
        ...prev,
        {
          player: currentPlayer,
          round,
          score: turnScore,
          words: results,
        },
      ]);
    }
  }, [words, checkWords, currentPlayer, round]);

  const { seconds, startTimer } = useTimer(handleTimerUp);

  const nextPlayer = !currentPlayer
    ? null
    : currentPlayer === numberOfPlayers
      ? 1
      : currentPlayer + 1;

  const word = selectedLetters.map((letter: Letter) => letter.val).join("");

  const handleSelectedLettersUpdate = useCallback(
    (selectedLetter: Letter | null, isSelected?: boolean): void => {
      setInvalidLetterId("");

      if (!selectedLetter) {
        setSelectedLetters([]);
        return;
      }

      if (
        !checkIfLetterValid(
          selectedLetter,
          selectedLetters,
          isSelected,
          isWordBreakingAllowed,
        )
      ) {
        setInvalidLetterId(selectedLetter.id);
        return;
      }

      setSelectedLetters((lettersArr) =>
        getLetterArrWithNewLetter(selectedLetter, lettersArr),
      );
    },
    [selectedLetters, isWordBreakingAllowed],
  );

  const handleDiceRollEnd = useCallback(() => {
    handleSelectedLettersUpdate(null);
    startTimer(timeLimit);
  }, [handleSelectedLettersUpdate, startTimer, timeLimit]);

  const { diceValues, rollDice } = useDice(handleDiceRollEnd);

  const onWordAccept = useCallback((): void => {
    setWords((prevWords) => {
      const isWordDuplicate = prevWords.some(
        (previousWord: Word) => previousWord.val === word,
      );
      if (isWordDuplicate) {
        setDuplicateError(`"${word}" ${t("game.duplicateError")}!`);
        return prevWords;
      }
      return [...prevWords, { val: word, points: null }];
    });
    handleSelectedLettersUpdate(null);
  }, [handleSelectedLettersUpdate, word, t]);

  const setupNextTurn = useCallback((): void => {
    if (showModal) {
      if (modalView === "turn") {
        if (numberOfPlayers > 1) {
          if (currentPlayer === numberOfPlayers) {
            setModalView("roundComparison");
            return;
          }
        } else if (round === roundLimit) {
          setModalView("gameSummary");
          setIsGameOver(true);
          return;
        }
      } else if (modalView === "roundComparison") {
        if (round === roundLimit) {
          setModalView("gameSummary");
          setIsGameOver(true);
          return;
        }
      } else if (modalView === "gameSummary") {
        navigate("/start");
        return;
      }
    }

    setDuplicateError("");
    setShowModal(false);
    setModalView("turn");
    setSelectedLetters([]);
    setWords([]);
    resetCheckedWords();

    if (numberOfPlayers > 1) {
      if (currentPlayer === numberOfPlayers) {
        setCurrentPlayer(1);
      } else {
        setCurrentPlayer((prev) => (prev !== null ? prev + 1 : 1));
        startTimer(timeLimit);
        return;
      }
    }

    const nextRound = round + 1;
    setRound(nextRound);
  }, [
    showModal,
    modalView,
    currentPlayer,
    numberOfPlayers,
    round,
    roundLimit,
    timeLimit,
    resetCheckedWords,
    startTimer,
    navigate,
  ]);

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-4">
        <aside className="hidden h-full flex-col md:flex">
          <div className="flex flex-col gap-2 border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
            <h2 className="mb-2 border-b-2 border-black pb-1 text-xs font-black tracking-widest uppercase">
              {t("words")} ({words.length})
            </h2>
            <div className="max-h-[60vh] overflow-y-auto">
              <Wordslist words={words} />
            </div>
          </div>
        </aside>

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
              onClickFn={useCallback(() => rollDice(15), [rollDice])}
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
              disabled={selectedLetters.length < 3}
            />
            <Diceboard
              letters={diceValues}
              onLetterSelect={handleSelectedLettersUpdate}
              selectedLettersIds={useMemo(
                () => selectedLetters.map((letter) => letter.id),
                [selectedLetters],
              )}
              invalidLetterId={invalidLetterId}
              disabled={!seconds}
            />
          </div>

          {duplicateError && (
            <div
              onClick={() => setDuplicateError("")}
              className="animate-shake absolute flex max-w-full items-center gap-3 border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#ef4444]"
            >
              <Ban className="text-red-500" />
              <p className="text-l font-black text-red-500 uppercase">
                {t("game.duplicateError")}
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          onCloseFn={setupNextTurn}
          title={
            modalView === "turn"
              ? isGameOver
                ? t("results.finalResults")
                : t("results.turnResults")
              : modalView === "roundComparison"
                ? `${t("results.roundComparison")} ${round}`
                : t("results.finalResults")
          }
          closeButtonAltText={
            modalView === "turn"
              ? numberOfPlayers > 1
                ? currentPlayer === numberOfPlayers
                  ? t("results.resultsComparison")
                  : `${t("results.next")}: ${t("results.player")} ${nextPlayer}`
                : round === roundLimit
                  ? t("results.showSummary")
                  : t("results.nextRound")
              : modalView === "roundComparison"
                ? round === roundLimit
                  ? t("results.showSummary")
                  : t("results.nextRound")
                : t("results.backToMenu")
          }
        >
          {modalView === "turn" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-4 border-black bg-[#FFDE00] p-4 shadow-[4px_4px_0_0_#000]">
                  <p className="text-[10px] font-black uppercase opacity-60">
                    {t("results.round")}
                  </p>
                  <p className="text-3xl font-black">{round}</p>
                </div>
                <div className="border-4 border-black bg-[#00FF66] p-4 shadow-[4px_4px_0_0_#000]">
                  <p className="text-[10px] font-black uppercase opacity-60">
                    {t("results.points")}
                  </p>
                  <p className="text-3xl font-black">
                    {checkedWords.reduce((acc, w) => acc + (w.points || 0), 0)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-black tracking-widest uppercase underline decoration-4 underline-offset-4">
                  {t("results.checkedWords")}:
                </h3>
                <div className="max-h-48 overflow-y-auto rounded-sm border-2 border-black bg-zinc-50 p-3">
                  {areResultsLoading ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF00FF] border-t-transparent" />
                      <p className="text-xs font-black uppercase">
                        {t("results.checkingWords")}...
                      </p>
                    </div>
                  ) : checkedWords.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {checkedWords.map((w, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between border-b border-zinc-200 pb-1"
                        >
                          <span className="font-bold tracking-tight uppercase">
                            {w.val}
                          </span>
                          <span
                            className={`font-black ${w.points ? "text-green-600" : "text-red-500"}`}
                          >
                            {w.points ? `+${w.points}` : "0"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-4 text-center text-xs font-bold text-zinc-400 uppercase italic">
                      {t("results.noValidWords")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {modalView === "roundComparison" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                {turnHistory
                  .filter((h) => h.round === round)
                  .map((h) => (
                    <div
                      key={h.player}
                      className="flex items-center justify-between border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#FFDE00] font-black">
                          G{h.player}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase">
                            {t("results.player")} {h.player}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase">
                            {
                              h.words.filter((w) => w.points && w.points > 0)
                                .length
                            }{" "}
                            {t("words")}
                          </span>
                        </div>
                      </div>
                      <div className="text-3xl font-black">+{h.score}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {modalView === "gameSummary" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-black tracking-widest uppercase underline decoration-4 underline-offset-4">
                  {t("results.finalResults")}:
                </h3>
                <div className="flex flex-col gap-3">
                  {Array.from({ length: numberOfPlayers }, (_, i) => i + 1)
                    .map((p) => ({
                      player: p,
                      total: turnHistory
                        .filter((h) => h.player === p)
                        .reduce((acc, h) => acc + h.score, 0),
                    }))
                    .sort((a, b) => b.total - a.total)
                    .map((result, idx) => (
                      <div
                        key={result.player}
                        className={`flex items-center justify-between border-4 border-black p-4 shadow-[4px_4px_0_0_#000] ${idx === 0 ? "bg-[#00FF66]" : "bg-white"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black">
                            {idx === 0 ? "🏆" : `${idx + 1}.`}
                          </span>
                          <span className="font-black uppercase">
                            {t("results.player")} {result.player}
                          </span>
                        </div>
                        <span className="text-3xl font-black">
                          {result.total} pkt
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-black tracking-widest uppercase">
                  {t("results.history")}:
                </h3>
                <div className="max-h-48 overflow-y-auto border-2 border-black bg-zinc-50 p-2 font-mono text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="py-1">Rnd</th>
                        {Array.from(
                          { length: numberOfPlayers },
                          (_, i) => i + 1,
                        ).map((p) => (
                          <th key={p} className="py-1">
                            G{p}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: roundLimit }, (_, i) => i + 1).map(
                        (r) => (
                          <tr key={r} className="border-b border-zinc-200">
                            <td className="py-1 font-black">{r}</td>
                            {Array.from(
                              { length: numberOfPlayers },
                              (_, i) => i + 1,
                            ).map((p) => (
                              <td key={p} className="py-1">
                                {turnHistory.find(
                                  (h) => h.player === p && h.round === r,
                                )?.score || 0}
                              </td>
                            ))}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default Game;
