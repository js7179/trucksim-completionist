import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from "react-router";
import { useEffect } from "react";
import SendPasswordResetForm from "@/components/auth/SendPasswordResetForm";
import { Button, Group, Stack } from '@mantine/core';

export default function SendPwResetPage() {
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(session !== null) {
            navigate("/");
        }
    }, [session, navigate]);

    return (
        <main>
            <Stack align='center' mt='lg'>
                <SendPasswordResetForm />
                <Group>
                    <Button type="button" onClick={() => navigate('/login')}>Back to Login</Button><br/>
                    <Button type="button" onClick={() => navigate('/signup')}>Sign Up</Button>
                </Group>
            </Stack>
        </main>
    );
}