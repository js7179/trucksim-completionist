import { Link } from "react-router-dom";

export default function Root() {
    return (
        <>
            <Link to={`ets2`}>Click here to go to Euro Truck Simulator 2</Link><br/>
            <Link to={`ats`}>Click here to go to American Truck Simulator</Link>
        </>
    );
}