import styles from "./ListObjective.module.css";
import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { useStore } from "zustand";
import { STATE_ACTION, ListObjectiveInfo, isNonorderedArrayEqual } from "trucksim-tracker-common";
import { useStoreWithEqualityFn } from "zustand/traditional";

export default function ListObjective(props: ListObjectiveProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const listValues = useStoreWithEqualityFn(store, 
                                              (s) => s.achList[props.achID].objectives[props.objid] as string[],
                                              (a, b) => isNonorderedArrayEqual(a, b));
    const dispatch = useStore(store, (s) => s.performAction);


    const toggleItem = (subobjID: string) => {
        let isMarkedOffCurrently = listValues.includes(subobjID);
        dispatch({
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: props.achID,
            objID: props.objid,
            subobjID: subobjID,
            shouldMarkOff: !isMarkedOffCurrently
        });
    };

    const listItems = props.values.map((subobj) => {
        let inputID = props.achID + subobj.subobjid;

        return (
            <div className={styles.listObjItem}>
                <input type="checkbox" 
                        id={inputID}
                        className={styles.listObjInput}
                        checked={listValues.includes(subobj.subobjid)}
                        onClick={() => toggleItem(subobj.subobjid)}
                        onChange={() => {}}/>
                <label htmlFor={inputID} className={styles.listObjLabelSVG}></label>
                <label htmlFor={inputID} className={styles.listObjLabelText}>{subobj.display}</label>
            </div>
        );
    });

    return (
        <div className={styles.listObj}>
            {...listItems}
        </div>
    );
}

interface ListObjectiveProps extends ListObjectiveInfo {
    achID: string;
}