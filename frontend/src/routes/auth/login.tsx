import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import styles from './authroutes.module.css';

export default function LoginPage() {
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(session !== null) {
            navigate("/");
        }
    }, [session, navigate]);

    return (
        <main className={styles.centerForm}>
            <h1>Login</h1>
            <section>
                <LoginForm />
                <button type="button" onClick={() => navigate('/sendpwreset')}>Forgot Password?</button>
            </section>
        </main>
    );
}