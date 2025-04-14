import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from './authroutes.module.css';

export default function SignupPage() {
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(session !== null) {
            navigate("/");
        }
    }, [session, navigate]);

    return (
        <main className={styles.centerForm}>
            <h1>Create account</h1>
            <section>
                <SignupForm />
            </section>
            <section>
                <button type="button" onClick={() => navigate('/login')}>Login with an existing account</button>
            </section>
        </main>
    );
}