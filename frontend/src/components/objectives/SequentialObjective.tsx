import styles from './Objectives.module.css';
import { SequentialObjectiveInfo } from "trucksim-completionist-common";
import { CheckboxButton } from '../util/StylizedCheckbox';
import { useLocalFuncSetNumberObj, useLocalStateAchievementNumberObj } from '@/hooks/LocalAchievementHooks';
import { useRemoteFuncSetNumberObj, useRemoteStateAchievementObjNumber } from '@/hooks/RemoteAchievementHooks';
import { useRemotePage } from '@/hooks/RemotePageContext';

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
            <li className={styles.seqObjListItem} key={htmlID}>
                <CheckboxButton 
                    htmlID={htmlID}
                    checked={isChecked}
                    onClick={() => func(stepIndex)}
                    size="1lh"
                    colorFilter="var(--text-color-filter)"
                    label={step.display}/>
            </li>
        );
    });

    return (
        <ol className={styles.seqObjList}>
            {...stepList}
        </ol>
    );
}

export type SequentialObjectiveProps = Omit<SequentialObjectiveInfo, "type"> & { achID: string; };
type VisualSequentialObjectiveProps = SequentialObjectiveProps & { 
    current: number,
    func: (stepIndex: number) => void
 };