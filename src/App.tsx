import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Game from "./components/Game/Game";
import Setup from "./components/Setup/Setup";
import Start from "./components/Start/Start";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { SettingsContextProvider } from "./contexts/SettingsContextProvider";
import { GameMode } from "./utils/constants";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SettingsContextProvider>
        <Layout />
      </SettingsContextProvider>
    ),
    children: [
      {
        index: true,
        //change to start
        loader: () => redirect("start"),
      },
      {
        path: "start",
        element: <Start />,
      },
      {
        path: "/setup/:mode",
        element: <Setup />,
      },
      {
        path: "game",
        children: [
          {
            index: true,
            loader: () => redirect("/start"),
          },
          {
            path: GameMode.single,
            element: <Game />,
          },
          {
            path: GameMode.hotseat,
            element: <Game />,
          },
        ],
      },
      { path: "*", loader: () => redirect("/start") },
    ],
  },
]);

// 2. Pass the router to the Provider
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
