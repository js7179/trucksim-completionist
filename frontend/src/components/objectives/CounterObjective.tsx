import styles from './CounterObjective.module.css';
import { ProgressBar } from '../util/ProgressBar';
import { STATE_ACTION, CounterObjectiveInfo } from 'trucksim-completionist-common';
import { useAchievementDispatch, useAchievementObjectiveNumber } from '@/hooks/AchievementHooks';

export default function CounterObjective({achID, objid, goal, display}: CounterObjectiveProps) {
    const current = useAchievementObjectiveNumber(achID, objid);
    const dispatch = useAchievementDispatch();

    const changeCount = (delta: number) => {
        const newValue = current + delta;
        if(newValue < 0 || newValue > goal) return;
        dispatch({
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: achID,
            objID: objid,
            n: newValue
        });
    }

    return (
        <div className={styles.counterObjective}>
            <p>{display}</p>
            <button type="button" className={styles.decrementBtn} onClick={() => changeCount(-1)}>-</button>
            <ProgressBar current={current} max={goal} />
            <button type="button" className={styles.incrementBtn} onClick={() => changeCount(+1)}>+</button>
        </div>
    );
}

interface CounterObjectiveProps extends CounterObjectiveInfo {
    achID: string;
}