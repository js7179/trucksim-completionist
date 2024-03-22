import { useContext } from 'react';
import styles from "./AchievementList.module.css";
import { AchievementInfo } from "trucksim-tracker-common/src/types";
import { AchievementStateContext } from '@/store/AchievementStore';
import { useStore } from 'zustand';

export default function AchievementList({ aList }:{ aList:AchievementInfo[] }) {
    const list = aList.map((achievement) => <Achievement {...achievement} key={achievement.id} />);
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementInfo) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const completed = useStore(store, (s) => s.achList[props.id].completed);
    const toggleAchComplete = useStore(store, (s) => s.toggleAchComplete);

    const checkboxID = props.id + "Checkbox";

    return (
        <section className={styles.achievement}>
            <div className={styles.info}>
                <div className={styles.icons}>
                    <img src={ completed ? props.icons.completed : props.icons.incomplete } alt=''/>
                </div>
                <div className={styles.desc}>
                    <h2 className={styles.achievementName}>{props.name}</h2>
                    <p>{props.desc}</p>
                </div>
                <div className={styles.achievementCompleted}>
                    <input type="checkbox" id={checkboxID} value={completed ? 1 : 0} className={styles.achComplChkbox} onClick={() => toggleAchComplete(props.id)} />
                    <label htmlFor={checkboxID} className={styles.achComplLabel}></label>
                </div>
            </div>
        </section>
    );
}