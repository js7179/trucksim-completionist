import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './AuthForms.module.css';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useAuth } from '@/hooks/Auth';

const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email must be a valid email address")
});

type ResetPwInputs = yup.InferType<typeof schema>;

export default function SendPasswordResetForm() {
    const { sendPasswordReset } = useAuth();
    const {register, formState: {errors}, handleSubmit} = useForm({
        resolver: yupResolver<ResetPwInputs>(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });
    const [emailSubmission, setEmailSubmission] = useState('');

    const onSubmit: SubmitHandler<ResetPwInputs> = async (data: ResetPwInputs) => {
        sendPasswordReset(data.email);
        setEmailSubmission(data.email);
    };

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className={styles.formContent}>
                {errors.email && !emailSubmission && 
                    (<div className={styles.formError}>
                        <ul>
                            <li>{errors.email.message}</li>    
                        </ul>
                    </div>)}
                {emailSubmission && 
                    (<div className={styles.formSuccess}>
                        <p>A password reset email has been sent to <strong className={styles.email}>{emailSubmission}</strong> if an account exists with that email. Check your spam folder if you do not receive the email shortly.</p>
                    </div>)}
                <div className={styles.formRow}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input type="email" autoComplete="email" id="email" required {...register("email")} />
                </div>
                <button type="submit" className={styles.submit}>Send Password Reset Email</button>
            </fieldset>
        </form>
        </>
    );
}