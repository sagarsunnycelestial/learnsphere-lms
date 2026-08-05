import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/HomePage";
import Login from "../pages/LoginPage";
import ProtectedLayout from '../components/layouts/ProtectedLayout'
import Dashboard from "../pages/Dashboard";
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
  {
    path: "dashboard",
    Component:ProtectedLayout,
    children:[
      {index: true, Component:Dashboard}
    ]
  }
]);
export default router;