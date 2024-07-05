import { Link } from "react-router-dom";
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navBar}>
            <Link to={`/`} className={styles.appTitle}>Trucksim Completionist</Link>
            <Link to={`ets2`} className={styles.gameLink}>Euro Truck Simulator 2</Link>
            <Link to={`ats`} className={styles.gameLink}>American Truck Simulator</Link>
        </nav>
    );
}