import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Error404 from "./components/Error404";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import ScavengerHunt from "./components/ScavengerHunt";
import Achievements from "./components/Achievements";
import Leaderboard from "./components/Leaderboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile"
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const Router = () => {
  const router = createBrowserRouter([
    {
      errorElement: <Error404 />,
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/quiz",
          element: <Quiz />,
        },
        {
          path: "/scavenger-hunt",
          element: <ScavengerHunt />,
        },
        {
          path: "/achievements",
          element: <Achievements />,
        },
        {
          path: "/leaderboard",
          element: <Leaderboard />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/reset",
          element: <ForgotPassword/>
        },
        {
          path: '/reset/:token',
          element: <ResetPassword/>
        },
        {
          path: "/signup",
          element: <Signup />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
