import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '@/hooks/useAuth';
import { useState } from "react";
import AuthAlertComponent, { FormStatus } from "./AuthAlert";
import { Button, Container, Fieldset, Group, PasswordInput, TextInput } from "@mantine/core";

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
    const [formStatus, setFormStatus] = useState<FormStatus>({ show: false });

    const onSubmit: SubmitHandler<SignupInputs> = async (data: SignupInputs) => {
        try {
            await signUp(data.email, data.password, data.displayName);
            setFormStatus({
                show: true,
                isSuccess: true,
                message: `A verification email has been sent to ${data.email}. Check your spam folder if you do not receive the email shortly.`
            });
        } catch(err) {
            const error = err as Error;
            setFormStatus({
                show: true,
                isSuccess: false,
                message: error.message ?? `Could not register an account, please try again later`
            })
        }
    };

    return (
        <Container w='25%'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset legend='Register Account'>
                    {formStatus.show && ( <AuthAlertComponent formStatus={formStatus} /> )}
                    <TextInput 
                        required
                        label='Email'
                        {...register("email")} 
                        error={errors.email ? errors.email.message : ''}
                    />
                    <TextInput 
                        required
                        label='Display Name'
                        {...register("displayName")}
                        error={errors.displayName ? errors.displayName.message : ''} 
                    />
                    <PasswordInput 
                        required
                        label='Password'
                            {...register("password")}
                            error={errors.password ? errors.password.message : ''}
                        />
                    <PasswordInput 
                        required
                        label='Confirm Password'
                            {...register("confirmPassword")}
                            error={errors.confirmPassword ? errors.confirmPassword.message : ''}
                            mb={'1.5rem'}
                        />
                    <Group justify='center'>
                        <Button variant='filled' type="submit">Sign Up</Button>
                    </Group>
                </Fieldset>
            </form>
        </Container>
    );
}