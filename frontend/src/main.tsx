import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Root from "./routes/root.tsx";
import "./index.css";
import ETS2LocalPage from './routes/localets2.tsx';
import ATSLocalPage from './routes/localats.tsx';
import NavbarLayout from './components/layout/NavbarLayout.tsx';
import SignupPage from './routes/auth/signup.tsx';
import { AuthProvider } from './hooks/Auth.tsx';
import LoginPage from './routes/auth/login.tsx';
import SignoutPage from './routes/auth/signout.tsx';
import SendPwResetPage from './routes/auth/sendpwreset.tsx';
import ResetPasswordPage from './routes/auth/resetpw.tsx';
import ETS2RemotePage from './routes/remoteets2.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<NavbarLayout />}>
            <Route index element={<Root />} />
            <Route path='/:uid/:game' element={<ETS2RemotePage />}></Route>
            <Route path='/ats' element={<ATSLocalPage/>} />
            <Route path='/ets2' element={<ETS2LocalPage/>} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signout' element={<SignoutPage />} />
            <Route path='/sendpwreset' element={<SendPwResetPage />} />
            <Route path='/resetpw' element={<ResetPasswordPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
