import { useNavigate } from "react-router-dom";

import { useSettings } from "../../contexts/SettingsContext.js";
import { useGameSession } from "../../hooks/useGameSession.js";
import { usePlayTurn } from "../../hooks/usePlayTurn.js";

import GamePlayfield from "./GamePlayfield.js";
import GameResultsModal from "./GameResultsModal.js";
import GameSidebar from "./GameSidebar.js";

function Game() {
  const navigate = useNavigate();
  const {
    timeLimit,
    roundLimit,
    isWordBreakingAllowed,
    numberOfPlayers,
    setCurrentRound,
  } = useSettings();

  const playTurn = usePlayTurn({ isWordBreakingAllowed });

  const session = useGameSession({
    timeLimit,
    roundLimit,
    numberOfPlayers,
    setCurrentRound,
    navigate,
    wordsRef: playTurn.wordsRef,
    clearSelection: playTurn.clearSelection,
    resetPlayForNextRound: playTurn.resetPlayForNextRound,
  });

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-4">
        <GameSidebar words={playTurn.words} />
        <GamePlayfield
          currentPlayer={numberOfPlayers > 1 ? session.currentPlayer : null}
          round={session.round}
          seconds={session.seconds}
          word={playTurn.word}
          selectedLettersCount={playTurn.selectedLetters.length}
          diceValues={session.diceValues}
          selectedLettersIds={playTurn.selectedLettersIds}
          invalidLetterId={playTurn.invalidLetterId}
          duplicateError={playTurn.duplicateError}
          onRollDice={session.handleRollDice}
          onWordAccept={playTurn.onWordAccept}
          onLetterSelect={playTurn.handleSelectedLettersUpdate}
          onDismissDuplicateError={playTurn.dismissDuplicateError}
        />
      </div>

      {session.showModal && (
        <GameResultsModal
          modalView={session.modalView}
          isGameOver={session.isGameOver}
          round={session.round}
          roundLimit={roundLimit}
          numberOfPlayers={numberOfPlayers}
          currentPlayer={session.currentPlayer}
          nextPlayer={session.nextPlayer}
          checkedWords={session.checkedWords}
          areResultsLoading={session.areResultsLoading}
          turnHistory={session.turnHistory}
          onCloseFn={session.setupNextTurn}
        />
      )}
    </>
  );
}

export default Game;
