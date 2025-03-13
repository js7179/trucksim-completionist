import styles from './Objectives.module.css';
import { ProgressBar } from '../util/ProgressBar';
import { CounterObjectiveInfo } from 'trucksim-completionist-common';
import { useLocalFuncSetNumberObj, useLocalStateAchievementNumberObj } from '@/hooks/LocalAchievementHooks';
import { useRemoteStateAchievementObjective } from '@/hooks/RemoteAchievementHooks';
import { useRemotePage } from '@/hooks/RemotePage';

export function LocalCounterObjective({achID, objid, goal, display}: CounterObjectiveProps) {
    const current = useLocalStateAchievementNumberObj(achID, objid);
    const dispatch = useLocalFuncSetNumberObj();

    const changeCount = (delta: number) => {
        const newValue = current + delta;
        if(newValue < 0 || newValue > goal) return;
        dispatch(achID, objid, newValue);
    }

    return (
        <VisualCounterObjective display={display} goal={goal} objid={objid} achID={achID} current={current} func={(delta) => changeCount(delta)} />
    );
}

export function RemoteCounterObjective({achID, objid, goal, display}: CounterObjectiveProps) {
    const { uid, game } = useRemotePage();
    const { data } = useRemoteStateAchievementObjective(uid, game, achID, objid);
    const current = data as number;

    const changeCount = (delta: number) => {
        const newValue = current + delta;
        if(newValue < 0 || newValue > goal) return;
        console.log(`TODO`);
    };

    return (
        <VisualCounterObjective display={display} goal={goal} objid={''} achID={''} current={0} func={(delta) => changeCount(delta)} />
    );
}

function VisualCounterObjective({goal, display, current, func}: VisualCounterObjectiveProps) {
    return (
        <div className={styles.counterObjective}>
            <p>{display}</p>
            <button type="button" className={styles.decrementBtn} onClick={() => func(-1)}>-</button>
            <ProgressBar current={current} max={goal} />
            <button type="button" className={styles.incrementBtn} onClick={() => func(+1)}>+</button>
        </div>
    );
}

export type CounterObjectiveProps = Omit<CounterObjectiveInfo, "type"> & { achID: string };

type VisualCounterObjectiveProps = CounterObjectiveProps & { 
    current: number, 
    func: (delta: number) => void 
};