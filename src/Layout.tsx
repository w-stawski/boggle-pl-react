import { Link, Outlet } from "react-router-dom";
import { SettingsContextProvider } from "./contexts/SettingsContextProvider";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <div className="flex items-center h-12 pl-10 bg-ui-secondary-background text-2xl">
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

      <footer className="bg-ui-secondary-background px-5 py-1 opacity-80 text-sm">
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
