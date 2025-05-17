import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import "./index.css";
import NavbarLayout from './components/layout/NavbarLayout.tsx';
import Root from './routes/root.tsx';
import AuthProvider from '@/hooks/Auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/query.ts';

const ETS2LocalPage = lazy(() => import('./routes/localets2.tsx'));
const ATSLocalPage = lazy(() => import('./routes/localats.tsx'));
const SignupPage = lazy(() => import('./routes/auth/signup.tsx'));
const LoginPage = lazy(() => import('./routes/auth/login.tsx'));
const SignoutPage = lazy(() => import('./routes/auth/signout.tsx'));
const SendPwResetPage = lazy(() => import('./routes/auth/sendpwreset.tsx'));
const ResetPasswordPage = lazy(() => import('./routes/auth/resetpw.tsx'));
const ETS2RemotePage = lazy(() => import('./routes/remoteets2.tsx'));
const ATSRemotePage = lazy(() => import('./routes/remoteats.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<NavbarLayout />}>
              <Route index element={<Root />} />
              <Route path='/:uid/ets2' element={<ETS2RemotePage />}></Route>
              <Route path='/:uid/ats' element={<ATSRemotePage />}></Route>
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
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
