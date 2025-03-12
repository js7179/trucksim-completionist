import { useStateAchievementListObj } from "@/hooks/LocalAchievementHooks";
import { clamp, PartialObjectiveInfo } from "trucksim-completionist-common";
import styles from './Objectives.module.css';
import SubobjList from "./SubobjList";

export function LocalPartialObjective({achID, objid, values, count: goalCount}: PartialObjectivesProp) {
    const listValues = useStateAchievementListObj(achID, objid);

    return (
        <div>
            <div className={styles.center}>{clamp(0, listValues.length, goalCount)}/{goalCount}</div>
            <SubobjList achID={achID} values={values} objid={objid} />
        </div>
    );
}

export function RemotePartialObjective({achID, objid, values, count: goalCount}: PartialObjectivesProp) {
    return (<p>To be implemented</p>);
}
export interface PartialObjectivesProp extends PartialObjectiveInfo {
    achID: string;
}