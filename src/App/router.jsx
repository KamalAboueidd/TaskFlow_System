import { Navigate, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/Ui/Loader";

// Lazy load the components
const NotFound = lazy(() => import("../pages/NotFound"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Home = lazy(() => import("../pages/Home"));
const History = lazy(() => import("../pages/History"));
const Analytics = lazy(() => import("../pages/Analytics"));
const CalendarView = lazy(() => import("../pages/CalendarView"));
const Settings = lazy(() => import("../pages/Settings"));
const ProductivityLevel = lazy(() => import("../pages/ProductivityLevel"));
const Pomodoro = lazy(() => import("../pages/Pomodoro"));
const GamesPage = lazy(() => import("../pages/GamesPage"));
const Layout = lazy(() => import("../components/layout/Layout"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/home",
    element: <Navigate to="/" />
  },
  {
    path: "/app",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "games",
        element: <GamesPage />
      },
      {
        path: "productivity",
        element: <ProductivityLevel />
      },
      {
        path: "pomodoro",
        element: <Pomodoro />
      },
      {
        path: "history",
        element: <History />
      },
      {
        path: "analytics",
        element: <Analytics />
      },
      {
        path: "calendar",
        element: <CalendarView />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;