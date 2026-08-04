import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/HomePage";
import Login from "../pages/LoginPage";
 const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: "auth",
        children: [
          {
            path: "login",
            Component: Login,
          },
          // {
          //   path: "register",
          //   Component: Register,
          // },
        ],
      },
    ],
  },
]);
export default router;