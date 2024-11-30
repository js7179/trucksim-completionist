import { useAuth } from "@/hooks/Auth";
import axios from 'axios';
import { useState } from "react";

export default function APIAuthTest() {
    const { session } = useAuth();
    const [body, setBody] = useState<string>('');
    
    const onClick = async () => {
        const url = new URL('/testauth', import.meta.env.VITE_API_URL).href;
        
        const authHeader = session ? `Bearer ${session.access_token}` : '';
        const res = await axios.get(url, {
            headers: {
                Authorization: authHeader
            }
        });
        if(res.status === 200) {
            setBody(`200 ${res.data}`);
        } else {
            setBody(`Error code ${res.status} ${res.statusText}`);
        }
    };

    return (<div>
        {body && (<p>{body}</p>)}
        <button type='button' onClick={onClick}>Make API Request</button>
    </div>);

}