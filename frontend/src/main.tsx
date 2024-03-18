import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ats_list from "trucksim-tracker-common/data/ats_achievements.json";
import ets2_list from "trucksim-tracker-common/data/ets2_achievements.json";
import Root from "./routes/root.tsx";
import AchievementList from './components/AchievementList';
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/ats",
    element: <AchievementList aList={ats_list} />,
  },
  {
    path: "/ets2",
    element: <AchievementList aList={ets2_list} />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
