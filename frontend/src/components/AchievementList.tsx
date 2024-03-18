import { useState } from 'react';
import styles from "./AchievementList.module.css";
import { AchievementInfo } from "trucksim-tracker-common";

export default function AchievementList({ aList }:{ aList:AchievementInfo[] }) {
    const list = aList.map((achievement) => <Achievement {...achievement} key={achievement.id} />);
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementInfo) {
    const [completed, setCompleted] = useState(false);

    const checkboxComplete = () => {
        setCompleted(!completed);
    };

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
                    <input type="checkbox" id={checkboxID} value={completed ? 1 : 0} className={styles.achComplChkbox} onClick={checkboxComplete} />
                    <label htmlFor={checkboxID} className={styles.achComplLabel}></label>
                </div>
            </div>
        </section>
    );
}