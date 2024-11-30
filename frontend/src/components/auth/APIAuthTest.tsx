import { useAuth } from "@/hooks/Auth";
import axios from 'axios';
import { useState } from "react";

export default function APIAuthTest() {
    const { session } = useAuth();
    const [body, setBody] = useState<string>('');
    
    const onClick = async () => {
        const url = new URL('/testauth', import.meta.env.VITE_API_URL).href;
        
        const authHeader = session ? `Bearer ${session.access_token}` : 'Bearer Bearer Bearer';
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: authHeader
                }
            });
            setBody(`Your UUID is ${res.data.uuid}!`);
        } catch (err) {
            const error = err as Error;
            setBody(error.message);
        }
    };

    return (<div>
        {body && (<p>{body}</p>)}
        <button type='button' onClick={onClick}>Make API Request</button>
        <button type='button' onClick={() => setBody('')}>Clear</button>
    </div>);

}