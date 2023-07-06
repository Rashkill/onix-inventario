import { useRoutes } from "react-router-dom";
import Home from "./pages/home";

import "./app.scss";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
      index: true,
    },
  ]);

  return <>{routes}</>;
}

export default App;
