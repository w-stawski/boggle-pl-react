import { Link } from "react-router";
import Button from "../Button/Button";
import { GameMode } from "../../utils/constants";

export default function Start() {
  return (
    <nav className="flex flex-col items-center gap-5 pt-20 px-5">
      <Link className="w-full" to={`/setup/${GameMode.single}`}>
        <Button className="bg-ui-tertiary w-full">Single Player</Button>
      </Link>
      <Link className="w-full" to={`/setup/${GameMode.hotseat}`}>
        <Button className="bg-ui-tertiary w-full">Multiplayer - Hotseat</Button>
      </Link>
      <Link
        className="pointer-events-none w-full"
        to={`/setup/${GameMode.online}`}
      >
        <Button disabled className="bg-ui-tertiary w-full">
          Multiplayer - Online
        </Button>
      </Link>
      <a
        className="opacity-80"
        href="https://www.youtube.com/watch?v=BJAdXnGAb7k"
      >
        <Button className="bg-ui-primary w-full">How to play ?</Button>
      </a>
    </nav>
  );
}
