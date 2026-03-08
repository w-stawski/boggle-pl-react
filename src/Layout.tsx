import { Link, Outlet } from "react-router-dom";
import { SettingsContextProvider } from "./contexts/SettingsContextProvider";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="bg-ui-secondary-background flex h-12 items-center pl-10 text-2xl">
          <Link to="/start">
            <p className="font-ornate text-3xl">PLoggle</p>
          </Link>
        </div>
      </header>
      <main className="grow">
        <SettingsContextProvider>
          <Outlet />
        </SettingsContextProvider>
      </main>

      <footer className="bg-ui-secondary-background px-5 py-1 text-sm opacity-80">
        <div className="flex justify-between">
          <p>PLoggle 2026</p>
          <a href="https://github.com/w-stawski" target="_blank">
            by wstawski
          </a>
        </div>
      </footer>
    </div>
  );
}
