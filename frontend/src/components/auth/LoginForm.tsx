import { useAuth } from '@/hooks/useAuth';
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { PasswordInput, TextInput, Button, Container, Group, Fieldset } from '@mantine/core';
import AuthAlertComponent, { FormStatus } from './AuthAlert';

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
    const [ formStatus, setFormStatus ] = useState<FormStatus>({ show: false });

    const onSubmit: SubmitHandler<LoginInputs> = async (data: LoginInputs) => {
        try {
            await login(data.email, data.password);
            setFormStatus({
                show: true, 
                isSuccess: true,
                message: 'Logged in! Redirecting you shortly...'
            });
        } catch (error) {
            const err = error as Error;
            setFormStatus({
                show: true,
                isSuccess: false,
                message: err.message ?? 'Could not log you in, please try again later'
            });
        }
    };


    return (
        <Container w='25%'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset>
                    {formStatus.show && ( <AuthAlertComponent formStatus={formStatus} /> )}
                    <TextInput 
                        required
                        label='Email'
                        {...register("email")} 
                        error={errors.email ? errors.email.message : ''}
                    />
                    <PasswordInput 
                        required
                        label='Password'
                        {...register("password")}
                        error={errors.password ? errors.password.message : ''}
                        mb={'1.5rem'}
                    />
                    <Group justify='center'>
                        <Button variant='filled' type="submit">Login</Button>
                    </Group>
                </Fieldset>
            </form>
        </Container>
    );
}