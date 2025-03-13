import { useLocalStateAchievementListObj, useLocalFuncMarkListObj } from "@/hooks/LocalAchievementHooks";
import { ListObjectiveInfo } from "trucksim-completionist-common";
import { CheckboxButton } from "../util/StylizedCheckbox";
import styles from './Objectives.module.css';
import { useRemoteStateAchievementObjective } from "@/hooks/RemoteAchievementHooks";
import { useRemotePage } from "@/hooks/RemotePage";

export function LocalSubobjList({achID, objid, values}: SubobjListProps) {
    const listValues = useLocalStateAchievementListObj(achID, objid);
    const dispatch = useLocalFuncMarkListObj();

    const toggleItem = (subobjID: string) => {
        const isMarkedOffCurrently = listValues.includes(subobjID);
        dispatch(achID, objid, subobjID, !isMarkedOffCurrently);
    };

    return (
        <VisualSubobjList values={values} objid={objid} achID={achID} current={listValues} func={toggleItem} />
    );
}

export function RemoteSubobjList({achID, objid, values}: SubobjListProps) {
    const { uid, game } = useRemotePage();
    const { data } = useRemoteStateAchievementObjective(uid, game, achID, objid);

    const listValues = data as string[];

    const toggleItem = (subobjID: string) => {
        console.log(`${subobjID} clicked`);
    }

    return (
        <VisualSubobjList values={values} objid={objid} achID={achID} current={listValues} func={toggleItem} />
    )
}

export function VisualSubobjList({achID, objid, values, current, func}: VisualSubobjListProps) {
    const listItems = values.map((subobj) => {
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

type SubobjListProps = Omit<ListObjectiveInfo, "type">  & {
    achID: string; 
};
type VisualSubobjListProps = SubobjListProps & { 
    current: string[];
    func: (subobjid: string) => void;
 };