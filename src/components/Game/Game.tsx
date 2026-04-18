import { useMemo } from "react";
import { useSettings } from "../../contexts/SettingsContext.js";
import { useGameLogic } from "../../hooks/useGameLogic.js";
import { useTranslation } from "react-i18next";

import GamePlayfield from "./GamePlayfield.js";
import GameResultsModal from "./GameResultsModal.js";
import GameSidebar from "./GameSidebar.js";

function Game() {
  const { t } = useTranslation();
  const {
    timeLimit,
    roundLimit,
    isWordBreakingAllowed,
    numberOfPlayers,
    setCurrentRound,
  } = useSettings();

  const game = useGameLogic({
    timeLimit,
    roundLimit,
    numberOfPlayers,
    isWordBreakingAllowed,
    setCurrentRound,
  });

  const srStatusMessage = useMemo(() => {
    if (game.duplicateError) {
      return game.duplicateError;
    }

    if (game.showModal) {
      if (game.modalView === "roundComparison") {
        return t("game.status.roundComparison");
      }
      if (game.modalView === "gameSummary") {
        return t("game.status.gameSummary");
      }
      return t("game.status.turnResults");
    }

    if (game.seconds === 10 || game.seconds === 5) {
      return t("game.timerWarning", { seconds: game.seconds });
    }

    if (game.seconds > 0) {
      return t("game.status.playing");
    }

    return t("game.status.readyToRoll");
  }, [
    game.duplicateError,
    game.showModal,
    game.modalView,
    game.seconds,
    t,
  ]);

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srStatusMessage}
      </div>
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-4">
        <GameSidebar words={game.words} />
        <GamePlayfield
          currentPlayer={numberOfPlayers > 1 ? game.currentPlayer : null}
          round={game.round}
          seconds={game.seconds}
          word={game.word}
          selectedLettersCount={game.selectedLetters.length}
          diceValues={game.diceValues}
          selectedLettersIds={game.selectedLettersIds}
          invalidLetterId={game.invalidLetterId}
          duplicateError={game.duplicateError}
          onRollDice={game.handleRollDice}
          onWordAccept={game.onWordAccept}
          onLetterSelect={game.handleSelectedLettersUpdate}
          onDismissDuplicateError={game.dismissDuplicateError}
        />
      </div>

      {game.showModal && (
        <GameResultsModal
          modalView={game.modalView}
          isGameOver={game.isGameOver}
          round={game.round}
          roundLimit={roundLimit}
          numberOfPlayers={numberOfPlayers}
          currentPlayer={game.currentPlayer}
          nextPlayer={game.nextPlayer}
          checkedWords={game.checkedWords}
          areResultsLoading={game.areResultsLoading}
          turnHistory={game.turnHistory}
          onCloseFn={game.setupNextTurn}
        />
      )}
    </>
  );
}

export default Game;
