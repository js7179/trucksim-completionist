import styles from "./ListObjective.module.css";
import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { useStore } from "zustand";
import { STATE_ACTION, ListObjectiveInfo, isNonorderedArrayEqual } from "trucksim-tracker-common";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { CheckboxButton } from "../util/StylizedCheckbox";

export default function ListObjective(props: ListObjectiveProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const listValues = useStoreWithEqualityFn(store, 
                                              (s) => s.achList[props.achID].objectives[props.objid] as string[],
                                              (a, b) => isNonorderedArrayEqual(a, b));
    const dispatch = useStore(store, (s) => s.performAction);


    const toggleItem = (subobjID: string) => {
        const isMarkedOffCurrently = listValues.includes(subobjID);
        dispatch({
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: props.achID,
            objID: props.objid,
            subobjID: subobjID,
            shouldMarkOff: !isMarkedOffCurrently
        });
    };

    const listItems = props.values.map((subobj) => {
        const inputID = `${props.achID}.${props.objid}.${subobj.subobjid}`;
        const isChecked = listValues.includes(subobj.subobjid);

        return (
            <li className={styles.listObjItem} key={inputID}>
                <CheckboxButton 
                    htmlID={inputID}
                    checked={isChecked}
                    onClick={() => toggleItem(subobj.subobjid)}
                    size="1lh"
                    colorFilter="var(--text-color-filter)"
                    label={subobj.display}/>
            </li>
        );
    });

    return (
        <ul className={styles.listObj}>
            {...listItems}
        </ul>
    );
}

interface ListObjectiveProps extends ListObjectiveInfo {
    achID: string;
}