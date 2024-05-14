import { useContext } from 'react';
import styles from "./AchievementList.module.css";
import { AchievementStateContext } from '@/store/AchievementStore';
import { useStore } from 'zustand';
import ListObjective from './objectives/ListObjective';
import CounterObjective from './objectives/CounterObjective';
import SequentialObjective from './objectives/SequentialObjective';
import { STATE_ACTION, AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, SequentialObjectiveInfo } from 'trucksim-tracker-common';

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
    const dispatch = useStore(store, (s) => s.performAction);

    const objs = props.objectives.map((obj) => {
        switch(obj.type) {
            case 'list':
                return <ListObjective {...obj as ListObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'counter':
                return <CounterObjective {...obj as CounterObjectiveInfo} achID={props.id} key={obj.objid}/>;
            case 'sequential':
                return <SequentialObjective {...obj as SequentialObjectiveInfo} achID={props.id} key={obj.objid} />;
        }
    });

    const showObjectives = objs.length != 0;

    const toggleAchievement = () => {
        dispatch({
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: props.id,
            shouldMarkOff: !completed
        });
    };

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
                    <input type="checkbox" id={props.id}
                            value={completed ? 1 : 0}
                            className={styles.achComplChkbox}
                            onClick={() => toggleAchievement()}
                            checked={completed}
                            onChange={() => {}} />
                    <label htmlFor={props.id} className={styles.achComplLabel}></label>
                </div>
            </div>
            {showObjectives && (
                <div className={styles.objectiveContainer}>
                    {...objs}
                </div>
            )}
        </section>
    );
}