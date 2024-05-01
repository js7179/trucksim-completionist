import { ListObjectiveInfo } from "trucksim-tracker-common/src/types";
import styles from "./ListObjective.module.css";
import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { useStore } from "zustand";


export default function ListObjective(props: ListObjectiveProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const listValues = useStore(store, (s) => s.achList[props.achID].objectives[props.objid] as string[]);
    const toggleListSubobj = useStore(store, (s) => s.toggleListSubobj);

    const listItems = props.values.map((subobj) => {
        return (
            <div className={styles.listObjItem}>
                <input type="checkbox" 
                        id={subobj.subobjid}
                        className={styles.listObjInput}
                        checked={listValues.includes(subobj.subobjid)}
                        onClick={() => toggleListSubobj(props.achID, props.objid, subobj.subobjid)}
                        onChange={() => {}} />
                <label htmlFor={subobj.subobjid} className={styles.listObjLabelSVG}></label>
                <label htmlFor={subobj.subobjid} className={styles.listObjLabelText}>{subobj.display}</label>
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