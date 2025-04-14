import { Session } from "@supabase/supabase-js";
import { createContext } from "react";

export type SupabaseSessionState = Session | null;

export interface AuthContextValue {
    session: SupabaseSessionState;
    loading: boolean;
    signUp: (email: string, password: string, displayName: string) => void;
    login: (email: string, password: string) => void;
    sendPasswordReset: (email: string) => void;
    setNewPassword: (newPassword: string) => void;
    signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
    session: null,
    loading: false,
    signUp: () => {},
    login: () => {},
    sendPasswordReset: () => {},
    setNewPassword: () => {},
    signOut: () => {}
});