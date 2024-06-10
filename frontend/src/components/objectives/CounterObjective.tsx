import styles from './CounterObjective.module.css';
import { ProgressBar } from '../util/ProgressBar';
import { useContext } from 'react';
import { useStore } from 'zustand';
import { AchievementStateContext } from '@/store/AchievementStore';
import { STATE_ACTION, CounterObjectiveInfo } from 'trucksim-tracker-common';

export default function CounterObjective(props: CounterObjectiveProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const current = useStore(store, (s) => s.achList[props.achID].objectives[props.objid] as number);
    const dispatch = useStore(store, (s) => s.performAction);

    const changeCount = (delta: number) => {
        const newValue = current + delta;
        if(newValue < 0 || newValue > props.goal) return;
        dispatch({
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: props.achID,
            objID: props.objid,
            n: newValue
        });
    }

    return (
        <div className={styles.counterObjective}>
            <p>{props.display}</p>
            <button type="button" className={styles.decrementBtn} onClick={() => changeCount(-1)}>-</button>
            <ProgressBar current={current} max={props.goal} />
            <button type="button" className={styles.incrementBtn} onClick={() => changeCount(+1)}>+</button>
        </div>
    );
}

interface CounterObjectiveProps extends CounterObjectiveInfo {
    achID: string;
}