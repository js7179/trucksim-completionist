import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Stack, Button } from "@mantine/core";

export default function SignupPage() {
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
                <SignupForm />
                <Button variant='filled' type="button" onClick={() => navigate('/login')}>Login with an existing account</Button>
            </Stack>
        </main>
    );
}