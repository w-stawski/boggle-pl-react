export default function GameInfo({
  currentPlayer,
  round,
  seconds,
}: {
  currentPlayer: number;
  round: number;
  seconds: number;
}) {
  return (
    <header className="flex items-center justify-between opacity-95">
      <div>
        <p className="text-ui-secondary">Round : {round}</p>
        {currentPlayer && <p className="text-sm">PLAYER : {currentPlayer}</p>}
      </div>
      <p
        className={`text-ui-secondary transition-color duration-200 ${!seconds ? "invisible" : ""} ${seconds < 10 ? "text-ui-accent" : ""}`}
      >
        Seconds Remaining: {seconds}
      </p>
    </header>
  );
}
