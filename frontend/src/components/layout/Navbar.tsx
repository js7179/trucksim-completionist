import { Link } from "react-router-dom";
import styles from './Navbar.module.css';
import { useAuth } from "@/hooks/Auth";

export default function Navbar() {
    const { session, loading } = useAuth();

    return (
        <nav className={styles.navBar}>
            <Link to={`/`} className={styles.appTitle}>Trucksim Completionist</Link>
            <Link to={`ets2`} className={styles.gameLink}>Euro Truck Simulator 2</Link>
            <Link to={`ats`} className={styles.gameLink}>American Truck Simulator</Link>
            <span className={styles.blankSpace} />
            {loading && (
                <>
                    <p>Loading....</p>
                </>
            )
            }
            {session === null && loading == false && (
                <>
                    <Link to={'/signup'} className={styles.gameLink}>Sign Up</Link>            
                    <Link to={'/login'} className={styles.gameLink}>Login</Link>
                </>
            )}
            {session !== null  && loading == false && (
                <>
                    <span className={styles.displayName}>{session.user.user_metadata.displayName ?? session.user.email}</span>
                    <Link to={"/signout"} className={styles.gameLink}>Sign Out</Link>
                </>
            )}
        </nav>
    );
}