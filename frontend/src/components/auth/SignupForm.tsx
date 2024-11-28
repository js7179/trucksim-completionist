import { useForm, SubmitHandler } from "react-hook-form";
import styles from './AuthForms.module.css';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/Auth";
import { useState } from "react";

const schema = yup.object().shape({
    email: yup.string()
                .required("Email address is required")
                .email("Email address must be a valid email"),
    displayName: yup.string()
                .required("Display Name is required")
                .max(20, "Display Name cannot be longer than 20 characters"),
    password: yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup.string()
                .oneOf([yup.ref("password")], "Passwords do not match")
});

type SignupInputs = yup.InferType<typeof schema>;

export default function SignupForm() {
    const { signUp } = useAuth();
    const { register, formState: { errors },  handleSubmit } = useForm({
        resolver: yupResolver<SignupInputs>(schema), 
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });
    const [errorStatus, setErrorStatus] = useState("");
    const [emailSubmission, setEmailSubmission] = useState("");

    const onSubmit: SubmitHandler<SignupInputs> = async (data: SignupInputs) => {
        try {
            await signUp(data.email, data.password, data.displayName);
            setEmailSubmission(data.email);
            setErrorStatus("");
        } catch(err) {
            const error = err as Error;
            setErrorStatus(error.message);
        }
    };

    const formErrors = [];
    for(const [fieldKey, fieldErr] of Object.entries(errors)) {
        formErrors.push(<li key={fieldKey}>{fieldErr.message}</li>)
    }
    if(errorStatus) formErrors.push(errorStatus);

    return (
        <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
            <fieldset className={styles.formContent}>
                {formErrors.length !== 0 && !emailSubmission && (
                    <div className={styles.formError}>
                        <ul>
                            {...formErrors}
                        </ul>
                    </div>
                )}
                {emailSubmission && 
                    (<div className={styles.formSuccess}>
                        <p>A verification email has been sent to <strong className={styles.email}>{emailSubmission}</strong>. Check your spam folder if you do not receive the email shortly.</p>
                    </div>)}
                <div className={styles.formRow}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input type="email" autoComplete="email" id="email" {...register("email")}/>
                </div>
                <div className={styles.formRow}>
                    <label htmlFor="displayName" className={styles.formLabel}>Display Name</label>
                    <input type="text" id="displayName" {...register("displayName")} />
                </div>
                <div className={styles.formRow}>
                    <label htmlFor="password" className={styles.formLabel}>Password</label>
                    <input type="password" autoComplete="new-password" id="password" {...register("password")} />
                </div>
                <div className={styles.formRow}>
                    <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                    <input type="password" autoComplete="new-password" id="confirmPassword" {...register("confirmPassword")} />    
                </div>
                <button type="submit" className={styles.submit}>Sign Up</button>
            </fieldset>
        </form>
    );
}