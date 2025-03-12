import { useAuth } from "@/hooks/Auth";
import { Link } from "react-router-dom";

export default function Root() {
    const { session } = useAuth();

    return (
        <>
            <div>
                <Link to={`ets2`}>Click here to go to Euro Truck Simulator 2</Link><br/>
                <Link to={`ats`}>Click here to go to American Truck Simulator</Link><br/>
                {session ? 
                    <>
                        <Link to={`/${session.user.id}/ets2`}>Click here to go to Euro Truck Simulator 2 Remote</Link>
                    </>
                    :
                    <p>Not logged in</p>
                }
            </div>
        </>
    );
}