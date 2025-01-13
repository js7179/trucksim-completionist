import { useStateAchievementListObj } from "@/hooks/AchievementHooks";
import { clamp, PartialObjectiveInfo } from "trucksim-completionist-common";
import styles from './Objectives.module.css';
import SubobjList from "./SubobjList";

export default function PartialObjective({achID, objid, values, count: goalCount}: PartialObjectivesProp) {
    const listValues = useStateAchievementListObj(achID, objid);

    return (
        <div>
            <div className={styles.center}>{clamp(0, listValues.length, goalCount)}/{goalCount}</div>
            <SubobjList achID={achID} values={values} objid={objid} />
        </div>
    );
}

interface PartialObjectivesProp extends PartialObjectiveInfo {
    achID: string;
}