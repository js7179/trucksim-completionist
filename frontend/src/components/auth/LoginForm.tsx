import { useAuth } from '@/hooks/useAuth';
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import styles from './AuthForms.module.css';

const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email must be a valid email address"),
    password: yup.string().required("Password is required"),
});

type LoginInputs = yup.InferType<typeof schema>;

export default function LoginForm() {
    const { login } = useAuth();
    const { register, formState: {errors}, handleSubmit} = useForm({
        resolver: yupResolver<LoginInputs>(schema), 
        mode: 'onBlur', 
        reValidateMode: 'onChange',
        shouldFocusError: false});
    const [ status, setStatus ] = useState("");

    const onSubmit: SubmitHandler<LoginInputs> = async (data: LoginInputs) => {
        try {
            await login(data.email, data.password);
            setStatus("Logged in! Redirecting shortly...");
        } catch (error) {
            const err = error as Error;
            setStatus(err.message);
        }
    };

    const formErrors = [];
    for(const [fieldKey, fieldErr] of Object.entries(errors)) {
        formErrors.push(<li key={fieldKey}>{fieldErr.message}</li>)
    }
    if(status) formErrors.push(status);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className={styles.formContent}>
                {formErrors.length !== 0 && (
                    <div className={styles.formError}>
                        <ul>
                            {...formErrors}
                        </ul>
                    </div>
                )}
                <div className={styles.formRow}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input type="email" autoComplete="email" id="email" required {...register("email")} />
                </div>
                <div className={styles.formRow}>
                    <label htmlFor="password" className={styles.formLabel}>Password</label>
                    <input type="password" autoComplete="current-password" id="password" required {...register("password")} />
                </div>
                <button type="submit" className={styles.submit}>Login</button>
            </fieldset>
        </form>
    );
}