import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ats_list from "./data/ats_achievement.json";
import ets2_list from "./data/ets2_achievement.json";
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
