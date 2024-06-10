import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { useStore } from "zustand";
import styles from "./AchievementIcon.module.css";

export function LocalIcon(props: IconProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const completed = useStore(store, (s) => s.achList[props.achID].completed);
    
    return (
        <img src={ completed ? props.completed : props.incomplete } className={styles.icon} alt=''/>
    );
}

export interface IconProps {
    completed: string;
    incomplete: string;
    achID: string;
}