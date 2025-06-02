import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from "react-router";
import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Button, Stack } from '@mantine/core';

export default function LoginPage() {
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
                <LoginForm />
                <Button mt='xs' type="button" onClick={() => navigate('/sendpwreset')}>Forgot Password?</Button>
            </Stack>
        </main>
    );
}