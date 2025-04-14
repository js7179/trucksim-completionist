import styles from './authroutes.module.css';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useAuth } from '@/hooks/useAuth';


export default function ResetPasswordPage() {
    const { session } = useAuth();

    return (
        <main className={styles.centerForm}>
            <h1>Reset Password for {session?.user.email}</h1>
            <section>
                <ResetPasswordForm />
            </section>
        </main>
    );
}