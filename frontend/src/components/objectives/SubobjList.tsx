import { ListObjectiveInfo, ListSubobjectiveItem } from "trucksim-completionist-common";
import { CheckboxButton } from "../util/StylizedCheckbox";
import styles from './Objectives.module.css';

export default function SubobjList({achID, objid, values, current, func}: SubobjListProps) {
    const listItems = values.map((subobj: ListSubobjectiveItem) => {
        const inputID = `${achID}.${objid}.${subobj.subobjid}`;
        const isChecked = current.includes(subobj.subobjid);
        return (
            <li className={styles.listObjItem} key={inputID}>
                <CheckboxButton 
                    htmlID={inputID}
                    checked={isChecked}
                    onClick={() => func(subobj.subobjid)}
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

export type SubobjListProps = Omit<ListObjectiveInfo, "type"> & {
    achID: string; 
    current: string[];
    func: (subobjid: string) => void;
 };