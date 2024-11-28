import { useAuth } from "@/hooks/Auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignoutPage() {
    const { session, signOut } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Signing you out...");

    useEffect(() => {
        if(session !== null) {
            signOut();
            setStatus("You have been signed out! Redirecting momentarily...");
        }
    }, []);

    useEffect(() => {
        if(session === null) {
            navigate("/");
        }
    }, [session]);

    return (
        <h1>{status}</h1>
    );
}