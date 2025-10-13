import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { Stack } from '@mantine/core';

export default function ResetPasswordPage() {
    const { session } = useAuth();

    return (
        <main>
            <Stack align='center' mt='lg'>
                <h1>Reset Password for {session?.user.email}</h1>
                <ResetPasswordForm />
            </Stack>
        </main>
    );
}