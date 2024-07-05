import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Root from "./routes/root.tsx";
import "./index.css";
import ETS2LocalPage from './routes/ets2.tsx';
import ATSLocalPage from './routes/ats.tsx';
import NavbarLayout from './components/layout/NavbarLayout.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route index element={<Root />} />
          <Route path='/ats' element={<ATSLocalPage/>} />
          <Route path='/ets2' element={<ETS2LocalPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
