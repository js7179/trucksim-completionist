import styles from './Objectives.module.css';
import { ProgressBar } from '../util/ProgressBar';
import { CounterObjectiveInfo } from 'trucksim-completionist-common';
import { useFuncSetNumberObj, useStateAchievementNumberObj } from '@/hooks/AchievementHooks';

export default function CounterObjective({achID, objid, goal, display}: CounterObjectiveProps) {
    const current = useStateAchievementNumberObj(achID, objid);
    const dispatch = useFuncSetNumberObj();

    const changeCount = (delta: number) => {
        const newValue = current + delta;
        if(newValue < 0 || newValue > goal) return;
        dispatch(achID, objid, newValue);
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

interface CounterObjectiveProps extends Omit<CounterObjectiveInfo, "type"> {
    achID: string;
}