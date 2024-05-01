import { SequentialObjectiveInfo } from "trucksim-tracker-common/src/types";
import styles from './SequentialObjective.module.css';
import listStyles from './ListObjective.module.css';
import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { useStore } from "zustand";

export default function SequentialObjective(props: SequentialObjectiveProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const objValue = useStore(store, (s) => s.achList[props.achID].objectives[props.objid] as number);
    const setSequentialObj = useStore(store, (s) => s.setSequentialObj);

    function listItemClicked(stepIndex: number) {
        if(stepIndex == objValue) { // If we want to just unselect current item
            setSequentialObj(props.achID, props.objid, stepIndex - 1);
        } else {
            setSequentialObj(props.achID, props.objid, stepIndex); // Otherwise, set new value
        }
    }

    const stepList = props.values.map((step, index) => {
        const stepIndex = index + 1;
        const isChecked = objValue >= stepIndex;
        return (
            <li className={styles.seqObjListItem}>
                <input type="checkbox"
                    id={step.subobjid}
                    className={listStyles.listObjInput}
                    checked={isChecked}
                    onClick={() => listItemClicked(stepIndex)}
                    onChange={() => {}} />
                <label htmlFor={step.subobjid} className={listStyles.listObjLabelSVG}/>
                <label htmlFor={step.subobjid} className={listStyles.listObjLabelText}>{step.display}</label>
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