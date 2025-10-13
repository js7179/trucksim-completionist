import * as yup from "yup";
import { useAuth } from '@/hooks/useAuth';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Container, Fieldset, Group, PasswordInput } from "@mantine/core";
import AuthAlertComponent, { FormStatus } from "./AuthAlert";

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
    const [formStatus, setFormStatus] = useState<FormStatus>({ show: false });

    const onSubmit: SubmitHandler<ResetPasswordTypes> = async (data: ResetPasswordTypes) => {
        try {
            await setNewPassword(data.newPassword);
            setFormStatus({
                show: true,
                isSuccess: true,
                message: `Your password has been reset! Redirecting you in 5 seconds...`
            });
        } catch (error) {
            const err = error as Error;
            setFormStatus({
                show: true,
                isSuccess: false,
                message: err.message ?? 'Could not successfully reset your password, please try again later'
            });
        }
    };

    useEffect(() => {
        if(formStatus.isSuccess ?? false) {
            const timeout = setTimeout(() => navigate('/'), 5000);
            return () => clearTimeout(timeout);
        }
    }, [formStatus, navigate]);

    return (
        <Container w='25%'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset>
                    {formStatus.show && ( <AuthAlertComponent formStatus={formStatus} /> )}
                    <PasswordInput 
                        required
                        label='New Password'
                            {...register("newPassword")}
                            error={errors.newPassword ? errors.newPassword.message : ''}
                            mb={'1.5rem'}
                        />
                    <PasswordInput
                        required
                        label='Confirm New Password'
                            {...register("confirmPassword")}
                            error={errors.confirmPassword ? errors.confirmPassword.message : ''}
                            mb={'1.5rem'}
                        />
                    <Group justify='center'>
                        <Button variant='filled' type="submit">Change Password</Button>
                    </Group>
                </Fieldset>
            </form>
        </Container>
    );
}