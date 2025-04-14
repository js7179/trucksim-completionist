import * as yup from "yup";
import styles from './AuthForms.module.css';
import { useAuth } from '@/hooks/useAuth';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    newPassword: yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup.string()
                .oneOf([yup.ref("newPassword")], "Passwords do not match")
});

type ResetPasswordTypes = yup.InferType<typeof schema>;

export default function ResetPasswordForm() {
    const { setNewPassword } = useAuth();
    const { register, formState: {errors}, handleSubmit } = useForm({
        resolver: yupResolver<ResetPasswordTypes>(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });
    const navigate = useNavigate();
    const [supaError, setSupaError] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    const onSubmit: SubmitHandler<ResetPasswordTypes> = async (data: ResetPasswordTypes) => {
        try {
            await setNewPassword(data.newPassword);
            setResetSuccess(true);
            setSupaError("");
        } catch (error) {
            const err = error as Error;
            setSupaError(err.message);
        }
    };

    const formErrors = [];
    for(const [fieldKey, fieldErr] of Object.entries(errors)) {
        formErrors.push(<li key={fieldKey}>{fieldErr.message}</li>)
    }
    if(supaError) formErrors.push(supaError);

    useEffect(() => {
        if(resetSuccess) {
            const timeout = setTimeout(() => navigate('/'), 5000);
            return () => clearTimeout(timeout);
        }
    }, [resetSuccess, navigate]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className={styles.formContent}>
                {formErrors.length !== 0 && !resetSuccess && (
                    <div className={styles.formError}>
                        <ul>
                            {...formErrors}
                        </ul>
                    </div>
                )}
                {resetSuccess && (
                    <div className={styles.formSuccess}>
                    <p>Your password has been set! Redirecting you in 5 seconds...</p>
                </div>
                )}
                <div className={styles.formRow}>
                    <label htmlFor="newPassword" className={styles.formLabel}>New Password</label>
                    <input type="password" autoComplete="new-password" id="newPassword" required {...register("newPassword")} />
                </div>
                <div className={styles.formRow}>
                    <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm New Password</label>
                    <input type="password" autoComplete="new-password" id="confirmPassword" required {...register("confirmPassword")} />
                </div>
                <button type="submit" className={styles.submit}>Change Password</button>
            </fieldset>
        </form>
    );
}