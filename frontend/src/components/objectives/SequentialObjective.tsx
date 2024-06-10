import styles from './SequentialObjective.module.css';
import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { useStore } from "zustand";
import { STATE_ACTION, SequentialObjectiveInfo } from "trucksim-tracker-common";
import Checkbox from '../util/Checkbox';

export default function SequentialObjective(props: SequentialObjectiveProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const objValue = useStore(store, (s) => s.achList[props.achID].objectives[props.objid] as number);
    const dispatch = useStore(store, (s) => s.performAction);

    const selectListItem = (stepIndex: number) => {
        if(stepIndex == objValue) {
            stepIndex -= 1;
        }
        dispatch({
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: props.achID,
            objID: props.objid,
            n: stepIndex
        });
    };

    const stepList = props.values.map((step, index) => {
        const stepIndex = index + 1;
        const isChecked = objValue >= stepIndex;
        const htmlID = props.achID + step.subobjid;
        return (
            <li className={styles.seqObjListItem}>
                <Checkbox 
                    htmlID={htmlID} 
                    checked={isChecked}
                    onClick={() => selectListItem(stepIndex)}
                    filterCSS='invert(100%)'
                    size='1lh'
                    labelText={step.display}/>
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