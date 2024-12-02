import { useState } from "react";
import { testUser } from "@/api/api";

export default function APIAuthTest() {
    const [body, setBody] = useState<string>('');
    
    const onClick = async () => {
        try {
            const res = await testUser();
            setBody(`Your UUID is ${res}!`);
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