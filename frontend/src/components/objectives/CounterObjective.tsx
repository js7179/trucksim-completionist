import { CounterObjectiveInfo } from 'trucksim-tracker-common/src/types';
import styles from './CounterObjective.module.css';
import { ProgressBar } from '../util/ProgressBar';
import { useContext } from 'react';
import { useStore } from 'zustand';
import { AchievementStateContext } from '@/store/AchievementStore';

export default function CounterObjective(props: CounterObjectiveProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const current = useStore(store, (s) => s.achList[props.achID].objectives[props.objid] as number);
    const changeCount = useStore(store, (s) => s.addToCounterObj);

    return (
        <div className={styles.counterObjective}>
            <p>{props.display}</p>
            <button type="button" className={styles.decrementBtn} onClick={() => changeCount(props.achID, props.objid, -1, props.goal)}>-</button>
            <ProgressBar current={current} max={props.goal} />
            <button type="button" className={styles.incrementBtn} onClick={() => changeCount(props.achID, props.objid, 1, props.goal)}>+</button>
        </div>
    );
}

interface CounterObjectiveProps extends CounterObjectiveInfo {
    achID: string;
}