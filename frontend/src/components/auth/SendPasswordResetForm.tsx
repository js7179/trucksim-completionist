import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Container, Fieldset, Group, TextInput } from '@mantine/core';
import AuthAlertComponent, { FormStatus } from './AuthAlert';

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
    const [formStatus, setFormStatus] = useState<FormStatus>({ show: false });

    const onSubmit: SubmitHandler<ResetPwInputs> = async (data: ResetPwInputs) => {
        try {
            sendPasswordReset(data.email);
            setFormStatus({
                show: true,
                isSuccess: true,
                message: `A password reset request has been sent to ${data.email} if an account associated with that email exists. Check your spam folder if you do not see it.`
            })
        } catch(err) {
            const error = err as Error;
            setFormStatus({
                show: true,
                isSuccess: false,
                message: error.message ?? 'Could not successfully request a password reset, please try again later'
            });
        }
    };

    return (
        <Container w='25%'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset legend='Request Password Reset'>
                    {formStatus.show && ( <AuthAlertComponent formStatus={formStatus} /> )}
                    <TextInput
                        required
                        label='Email'
                        {...register("email")} 
                        error={errors.email ? errors.email.message : ''}
                        mb='1.5rem'
                    />
                    <Group justify='center'>
                        <Button variant='filled' type="submit">Send Password Reset Email</Button>
                    </Group>
                </Fieldset>
            </form>
        </Container>
    );
}