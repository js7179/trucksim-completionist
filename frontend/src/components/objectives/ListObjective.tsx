import styles from "./ListObjective.module.css";
import { STATE_ACTION, ListObjectiveInfo } from "trucksim-completionist-common";
import { CheckboxButton } from "../util/StylizedCheckbox";
import { useAchievementDispatch, useAchievementObjectiveList } from "@/hooks/AchievementHooks";

export default function ListObjective({achID, objid, values}: ListObjectiveProps) {
    const listValues = useAchievementObjectiveList(achID, objid);
    const dispatch = useAchievementDispatch();

    const toggleItem = (subobjID: string) => {
        const isMarkedOffCurrently = listValues.includes(subobjID);
        dispatch({
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: achID,
            objID: objid,
            subobjID: subobjID,
            shouldMarkOff: !isMarkedOffCurrently
        });
    };

    const listItems = values.map((subobj) => {
        const inputID = `${achID}.${objid}.${subobj.subobjid}`;
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