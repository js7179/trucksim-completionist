import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from "./routes/root.tsx";
import "./index.css";
import ETS2LocalPage from './routes/ets2.tsx';
import ATSLocalPage from './routes/ats.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/ats",
    element: <ATSLocalPage />,
  },
  {
    path: "/ets2",
    element: <ETS2LocalPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
