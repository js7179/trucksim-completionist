import styles from './SequentialObjective.module.css';
import { SequentialObjectiveInfo } from "trucksim-completionist-common";
import { CheckboxButton } from '../util/StylizedCheckbox';
import { useFuncSetNumberObj, useStateAchievementNumberObj } from '@/hooks/AchievementHooks';

export default function SequentialObjective({achID, objid, values}: SequentialObjectiveProps) {
    const objValue = useStateAchievementNumberObj(achID, objid);
    const dispatch = useFuncSetNumberObj();

    const selectListItem = (stepIndex: number) => {
        if(stepIndex == objValue) {
            stepIndex -= 1;
        }
        dispatch(achID, objid, stepIndex);
    };

    const stepList = values.map((step, index) => {
        const stepIndex = index + 1;
        const isChecked = objValue >= stepIndex;
        const htmlID = `${achID}.${objid}.${step.subobjid}`;
        return (
            <li className={styles.seqObjListItem} key={htmlID}>
                <CheckboxButton 
                    htmlID={htmlID}
                    checked={isChecked}
                    onClick={() => selectListItem(stepIndex)}
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

interface SequentialObjectiveProps extends SequentialObjectiveInfo {
    achID: string;
}