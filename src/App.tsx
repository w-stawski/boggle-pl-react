import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Start from "./components/Start/Start";
import Game from "./components/Game/Game";

// 1. Define your routes in a constant
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        //change to start
        loader: () => redirect("game"),
      },
      {
        path: "start",
        element: <Start />,
      },
      {
        path: "game",
        element: <Game />,
      },
    ],
  },
]);

// 2. Pass the router to the Provider
function App() {
  return <RouterProvider router={router} />;
}

export default App;
