import { useLocalFuncMarkListObj, useLocalStateAchievementListObj } from "@/hooks/LocalAchievementHooks";
import { clamp, PartialObjectiveInfo } from "trucksim-completionist-common";
import styles from './Objectives.module.css';
import SubobjList, { SubobjListProps } from "./SubobjList";
import { useRemoteFuncMarkListObj, useRemoteStateAchievementObjList } from "@/hooks/RemoteAchievementHooks";
import { useRemotePage } from "@/hooks/RemotePage";

export function LocalPartialObjective({achID, objid, values, count: goalCount}: PartialObjectivesProp) {
    const listValues = useLocalStateAchievementListObj(achID, objid);
    const dispatch = useLocalFuncMarkListObj();

    const toggleItem = (subobjID: string) => {
        const isMarkedOffCurrently = listValues.includes(subobjID);
        dispatch(achID, objid, subobjID, !isMarkedOffCurrently);
    };

    return (
        <VisualPartialObjective count={goalCount} values={values} objid={objid} achID={achID} current={listValues} func={toggleItem} />
    );
}

export function RemotePartialObjective({achID, objid, values, count: goalCount}: PartialObjectivesProp) {
    const { uid, game } = useRemotePage();
    const { data: listValues } = useRemoteStateAchievementObjList(uid, game, achID, objid);
    const dispatch = useRemoteFuncMarkListObj();


    const toggleItem = (subobjID: string) => {
        const isMarkedOffCurrently = listValues.includes(subobjID);
        dispatch.mutate({ uid, game, achID, objid, subobjid: subobjID, shouldMarkOff: !isMarkedOffCurrently });
    }

    return (
        <VisualPartialObjective count={goalCount} values={values} objid={objid} achID={achID} current={listValues} func={toggleItem} />
    );
}

export function VisualPartialObjective({achID, objid, values, count: goalCount, current, func}: VisualPartialObjectivesProp) {
    return (
        <div>
            <div className={styles.center}>{clamp(0, current.length, goalCount)}/{goalCount}</div>
            <SubobjList achID={achID} values={values} objid={objid} current={current} func={func} />
        </div>
    );
}

export type PartialObjectivesProp = Omit<PartialObjectiveInfo, "type"> & { achID: string; };
type VisualPartialObjectivesProp = PartialObjectivesProp & SubobjListProps;