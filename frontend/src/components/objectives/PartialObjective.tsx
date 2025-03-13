import { useLocalStateAchievementListObj } from "@/hooks/LocalAchievementHooks";
import { clamp, PartialObjectiveInfo } from "trucksim-completionist-common";
import styles from './Objectives.module.css';
import { LocalSubobjList, RemoteSubobjList } from "./SubobjList";
import { useRemoteStateAchievementObjective } from "@/hooks/RemoteAchievementHooks";
import { useRemotePage } from "@/hooks/RemotePage";

export function LocalPartialObjective({achID, objid, values, count: goalCount}: PartialObjectivesProp) {
    const listValues = useLocalStateAchievementListObj(achID, objid);

    return (
        <div>
            <div className={styles.center}>{clamp(0, listValues.length, goalCount)}/{goalCount}</div>
            <LocalSubobjList achID={achID} values={values} objid={objid} />
        </div>
    );
}

export function RemotePartialObjective({achID, objid, values, count: goalCount}: PartialObjectivesProp) {
    const { uid, game } = useRemotePage();
    const { data } = useRemoteStateAchievementObjective(uid, game, achID, objid);

    const listValues = data as string[];

    return (
        <div>
            <div className={styles.center}>{clamp(0, listValues.length, goalCount)}/{goalCount}</div>
            <RemoteSubobjList achID={achID} values={values} objid={objid} />
        </div>
    );
}

export type PartialObjectivesProp = Omit<PartialObjectiveInfo, "type"> & { achID: string; };
