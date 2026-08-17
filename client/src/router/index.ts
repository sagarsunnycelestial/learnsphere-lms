import { createBrowserRouter } from 'react-router';
import Root from '../pages/Root';
import Home from '../pages/HomePage';
import Login from '../pages/LoginPage';
import ProtectedLayout from '../components/layouts/ProtectedLayout';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            Component: Login,
          },
        ],
      },
    ],
  },
  {
    path: 'dashboard',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'profile', Component: Profile },
      {
        path: 'course/:id',
        lazy: async () => {
          const { default: Component } =
            await import('../pages/SingleCoursePage');
          return { Component };
        },
      },
    ],
  },
]);
export default router;
