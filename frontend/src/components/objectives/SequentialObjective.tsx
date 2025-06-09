import { SequentialObjectiveInfo } from "trucksim-completionist-common";
import { useLocalFuncSetNumberObj, useLocalStateAchievementNumberObj } from '@/hooks/LocalAchievementHooks';
import { useRemoteFuncSetNumberObj, useRemoteStateAchievementObjNumber } from '@/hooks/RemoteAchievementHooks';
import { useRemotePage } from '@/hooks/RemotePageContext';
import { Checkbox, List } from '@mantine/core';

export function LocalSequentialObjective({achID, objid, values}: SequentialObjectiveProps) {
    const objValue = useLocalStateAchievementNumberObj(achID, objid);
    const dispatch = useLocalFuncSetNumberObj();

    const selectListItem = (stepIndex: number) => {
        if(stepIndex === objValue) {
            stepIndex -= 1;
        }
        dispatch(achID, objid, stepIndex);
    };

    return (
        <VisualSequentialObjective values={values} objid={objid} achID={achID} current={objValue} func={selectListItem} />
    );
}

export function RemoteSequentialObjective({achID, objid, values}: SequentialObjectiveProps) {
    const { uid, game } = useRemotePage();
    const { data: objValue } = useRemoteStateAchievementObjNumber(uid, game, achID, objid);
    const dispatch = useRemoteFuncSetNumberObj();

    const selectListItem = (stepIndex: number) => {
        if(stepIndex === objValue) {
            stepIndex -= 1;
        }
        dispatch.mutate({ uid, game, achID, objid, n: stepIndex });
    }

    return (
        <VisualSequentialObjective values={values} objid={objid} achID={achID} current={objValue} func={selectListItem} />
    );
}

export function VisualSequentialObjective({achID, objid, values, current, func}: VisualSequentialObjectiveProps) {
    const stepList = values.map((step, index) => {
        const stepIndex = index + 1;
        const isChecked = current >= stepIndex;
        const htmlID = `${achID}.${objid}.${step.subobjid}`;
        return (
            <List.Item key={htmlID}>
                <Checkbox
                    key={htmlID}
                    color='gray'
                    checked={isChecked}
                    label={step.display}
                    onClick={() => func(index + 1)} />
            </List.Item>
        );
    });

    return (
        <List type="ordered" p='md' pl='lg'>
            {...stepList}
        </List>
    );
}

export type SequentialObjectiveProps = Omit<SequentialObjectiveInfo, "type"> & { achID: string; };
type VisualSequentialObjectiveProps = SequentialObjectiveProps & { 
    current: number,
    func: (stepIndex: number) => void
 };