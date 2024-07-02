import styles from "./AchievementIcon.module.css";
import { useAchievementCompleted } from "@/hooks/AchievementHooks";

export function LocalIcon({achID, completed, incomplete}: IconProps) {
    const isDone = useAchievementCompleted(achID);

    return (
        <img src={ isDone ? completed : incomplete } className={styles.icon} alt=''/>
    );
}

export interface IconProps {
    completed: string;
    incomplete: string;
    achID: string;
}