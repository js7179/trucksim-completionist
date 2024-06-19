import styles from "./ListObjective.module.css";
import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { useStore } from "zustand";
import { STATE_ACTION, ListObjectiveInfo, isNonorderedArrayEqual } from "trucksim-tracker-common";
import { useStoreWithEqualityFn } from "zustand/traditional";
import StylizedCheckbox from "../util/StylizedCheckbox";

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
            <div className={styles.listObjItem} key={inputID}>
                <ObjectiveCheckbox 
                    htmlID={inputID}
                    isChecked={isChecked}
                    onClick={() => toggleItem(subobj.subobjid)}
                    label={subobj.display} />
            </div>
        );
    });

    return (
        <div className={styles.listObj}>
            {...listItems}
        </div>
    );
}

const COMMON_CHECKBOX_STYLES: React.CSSProperties = {
    filter: 'invert(100%)',
    width: '1lh',
    height: '1lh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%'
};

export function ObjectiveCheckbox(props:ObjectiveCheckboxProps) {
    return (<StylizedCheckbox 
        htmlID={props.htmlID} 
        checked={props.isChecked}
        onClick={props.onClick}
        buttonCheckedStyle={{
            backgroundImage: 'url("/vector/checked.svg")',
            ...COMMON_CHECKBOX_STYLES
        }}
        buttonUncheckedStyle={{
            backgroundImage: 'url("/vector/unchecked.svg")',
            ...COMMON_CHECKBOX_STYLES
        }}
        labelText={props.label}
        labelCheckedStyle={{textDecoration: 'line-through'}}
    />);
}

interface ListObjectiveProps extends ListObjectiveInfo {
    achID: string;
}

interface ObjectiveCheckboxProps {
    htmlID: string;
    isChecked: boolean;
    onClick: VoidFunction;
    label: string;
}