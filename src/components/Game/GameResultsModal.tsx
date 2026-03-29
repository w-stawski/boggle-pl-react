import { useTranslation } from "react-i18next";
import type { Word, TurnHistoryEntry } from "../../utils/types.js";
import Modal from "../Modal/Modal.js";

type ModalView = "turn" | "roundComparison" | "gameSummary";

type GameResultsModalProps = {
  modalView: ModalView;
  isGameOver: boolean;
  round: number;
  roundLimit: number;
  numberOfPlayers: number;
  currentPlayer: number;
  nextPlayer: number;
  checkedWords: Word[];
  areResultsLoading: boolean;
  turnHistory: TurnHistoryEntry[];
  onCloseFn: () => void;
};

export default function GameResultsModal({
  modalView,
  isGameOver,
  round,
  roundLimit,
  numberOfPlayers,
  currentPlayer,
  nextPlayer,
  checkedWords,
  areResultsLoading,
  turnHistory,
  onCloseFn,
}: GameResultsModalProps) {
  const { t } = useTranslation();

  const title =
    modalView === "turn"
      ? isGameOver
        ? t("results.finalResults")
        : t("results.turnResults")
      : modalView === "roundComparison"
        ? `${t("results.roundComparison")} ${round}`
        : t("results.finalResults");

  const closeButtonAltText =
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
        : t("results.backToMenu");

  return (
    <Modal
      onCloseFn={onCloseFn}
      title={title}
      closeButtonAltText={closeButtonAltText}
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
                {checkedWords.reduce((acc, w) => acc + (w.points ?? 0), 0)}
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
                        className={`font-black ${(w.points ?? 0) > 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        {(w.points ?? 0) > 0 ? `+${w.points}` : "0"}
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
                      {t("results.player").charAt(0)}
                      {h.player}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase">
                        {t("results.player")} {h.player}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase">
                        {h.words.filter((w) => (w.points ?? 0) > 0).length}
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
                      {result.total} {t("results.pts")}
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
                    <th className="py-1">{t("results.round")}</th>
                    {Array.from(
                      { length: numberOfPlayers },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <th
                        key={p}
                        className="py-1 text-center font-black uppercase"
                      >
                        {t("results.player").charAt(0)}
                        {p}
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
                          <td key={p} className="py-1 text-center">
                            {turnHistory.find(
                              (h) => h.player === p && h.round === r,
                            )?.score ?? "-"}
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
  );
}
