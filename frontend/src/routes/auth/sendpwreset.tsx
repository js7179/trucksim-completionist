import { useAuth } from "@/hooks/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SendPasswordResetForm from "@/components/auth/SendPasswordResetForm";
import styles from './authroutes.module.css';

export default function SendPwResetPage() {
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(session !== null) {
            navigate("/");
        }
    }, [session]);

    return (
        <main className={styles.centerForm}>
            <h1>Reset Password</h1>
            <section>
                <SendPasswordResetForm />
            </section>
            <section>
                <button type="button" onClick={() => navigate('/login')}>Back to Login</button><br/>
                <button type="button" onClick={() => navigate('/signup')}>Sign Up</button>
            </section>
        </main>
    );
}