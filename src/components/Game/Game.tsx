import { useSettings } from "../../contexts/SettingsContext.js";
import { useGameLogic } from "../../hooks/useGameLogic.js";

import GamePlayfield from "./GamePlayfield.js";
import GameResultsModal from "./GameResultsModal.js";
import GameSidebar from "./GameSidebar.js";

function Game() {
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

  return (
    <>
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
