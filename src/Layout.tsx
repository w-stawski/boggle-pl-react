import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <div className="flex items-center h-12 pl-10 bg-ui-secondary-background text-2xl">
          <p className="font-ornate text-3xl">PLoggle</p>
        </div>
      </header>
      <main className="grow">
        <Outlet />
      </main>

      <footer className="bg-ui-secondary-background px-5 py-1 opacity-80 text-sm">
        <div className="flex justify-between">
          <p>PLoggle 2026</p>
          <a href="https://github.com/w-stawski" target="_blank">
            wstawski
          </a>
        </div>
      </footer>
    </div>
  );
}
