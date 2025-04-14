import { PropsWithChildren, useEffect, useState } from "react";
import { auth } from '@/supabase';
import { AuthContext, AuthContextValue, SupabaseSessionState } from "./AuthContext";

const AuthProvider = ({children}: PropsWithChildren) => {
    const [session, setSession] = useState<SupabaseSessionState>(null);
    const [loading, setLoading] = useState(false);

    async function signUp(email: string, password: string, displayName: string) {
        setLoading(true);
        const { error } = await auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    displayName: displayName
                }
            }
        });
        setLoading(false);
        if(error) {
            throw new Error(error.message);
        }
    }

    async function login(email: string, password: string) {
        setLoading(true);
        const { error } = await auth.signInWithPassword({
            email: email,
            password: password
        });
        setLoading(false);
        if(error) {
            throw new Error(error.message);
        }
    }

    async function signOut() {
        setLoading(true);
        const { error } = await auth.signOut({ scope: 'local' });
        setLoading(false);
        if(error) {
            throw new Error(error.message);
        }
    }
    
    async function sendPasswordReset(email: string) {
        const url = import.meta.env.VITE_SITE_URL + 'resetpw';
        await auth.resetPasswordForEmail(email, {
            redirectTo: url
        });
    }

    async function setNewPassword(newPassword: string) {
        setLoading(true);
        const { error } = await auth.updateUser({ password: newPassword });
        setLoading(false);
        if(error) {
            throw new Error(error.message);
        }
    }

    useEffect(() => {
        auth.getSession().then(({data: { session }}) => {
            setSession(session);
            setLoading(false);
        });
        const { data: { subscription }} = auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value: AuthContextValue = {session, loading, signUp, login, sendPasswordReset, setNewPassword, signOut};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;