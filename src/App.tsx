import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Game from "./components/Game/Game";
import Setup from "./components/Setup/Setup";
import Start from "./components/Start/Start";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
            path: "single",
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
  return <RouterProvider router={router} />;
}

export default App;
