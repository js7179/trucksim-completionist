import { CounterObjectiveInfo } from 'trucksim-completionist-common';
import { useLocalFuncSetNumberObj, useLocalStateAchievementNumberObj } from '@/hooks/LocalAchievementHooks';
import { useRemoteFuncSetNumberObj, useRemoteStateAchievementObjNumber } from '@/hooks/RemoteAchievementHooks';
import { useRemotePage } from '@/hooks/RemotePageContext';
import { Group, Button } from '@mantine/core';
import { ProgressBar } from '@/components/util/ProgressBar';
import { IconMinus, IconPlus } from '@/components/util/Icons';

export function LocalCounterObjective({achID, objid, goal, display}: CounterObjectiveProps) {
    const current = useLocalStateAchievementNumberObj(achID, objid);
    const dispatch = useLocalFuncSetNumberObj();

    const changeCount = (delta: number) => {
        const newValue = current + delta;
        if(newValue < 0 || newValue > goal) return;
        dispatch(achID, objid, newValue);
    }

    return (
        <VisualCounterObjective display={display} goal={goal} objid={objid} achID={achID} current={current} func={changeCount} />
    );
}

export function RemoteCounterObjective({achID, objid, goal, display}: CounterObjectiveProps) {
    const { uid, game } = useRemotePage();
    const { data: currentValue } = useRemoteStateAchievementObjNumber(uid, game, achID, objid);
    const dispatch = useRemoteFuncSetNumberObj();

    const changeCount = (delta: number) => {
        const newValue = currentValue + delta;
        if(newValue < 0 || newValue > goal) return;
        dispatch.mutate({ uid, game, achID, objid, n: newValue });
    };

    return (
        <VisualCounterObjective display={display} goal={goal} objid={objid} achID={achID} current={currentValue} func={changeCount} />
    );
}

export function VisualCounterObjective({goal, display, current, func}: VisualCounterObjectiveProps) {
    return (
        <Group style={{ width: '100%' }} p='md'>
            <p>{display}</p>
            <Button onClick={() => func(-1)} aria-label='Decrement'>
                <IconMinus height='1rem' width='1rem' />
            </Button>
            <ProgressBar current={current} max={goal} boxStyle={{flex: 1}} />
            <Button onClick={() => func(+1)} aria-label='Increment'>
                <IconPlus height='1rem' width='1rem' />
            </Button>
        </Group>
    );
}

export type CounterObjectiveProps = Omit<CounterObjectiveInfo, "type"> & { achID: string };

type VisualCounterObjectiveProps = CounterObjectiveProps & { 
    current: number;
    func: (delta: number) => void;
};