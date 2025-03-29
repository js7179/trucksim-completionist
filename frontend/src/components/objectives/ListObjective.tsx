import { ListObjectiveInfo } from "trucksim-completionist-common";
import SubobjList from './SubobjList';
import { useLocalStateAchievementListObj, useLocalFuncMarkListObj } from "@/hooks/LocalAchievementHooks";
import { useRemoteStateAchievementObjective, useRemoteFuncMarkListObj } from "@/hooks/RemoteAchievementHooks";
import { useRemotePage } from "@/hooks/RemotePage";

export function LocalListObjective({achID, objid, values}: ListObjectiveProps) {
    const listValues = useLocalStateAchievementListObj(achID, objid);
    const dispatch = useLocalFuncMarkListObj();

    const toggleItem = (subobjID: string) => {
        const isMarkedOffCurrently = listValues.includes(subobjID);
        dispatch(achID, objid, subobjID, !isMarkedOffCurrently);
    };

    return (
        <SubobjList achID={achID} objid={objid} values={values} current={listValues} func={toggleItem} />
    );
}

export function RemoteListObjective({achID, objid, values}: ListObjectiveProps) {
    const { uid, game } = useRemotePage();
    const { data } = useRemoteStateAchievementObjective(uid, game, achID, objid);
    const dispatch = useRemoteFuncMarkListObj();

    const listValues = data as string[];

    const toggleItem = (subobjID: string) => {
        const curSubobjState = listValues.includes(subobjID);
        dispatch.mutate({ uid, game, achID, objid, subobjid: subobjID, shouldMarkOff: !curSubobjState });
    }

    return (
        <SubobjList values={values} objid={objid} achID={achID} current={listValues} func={toggleItem} />
    );
}

export type ListObjectiveProps = Omit<ListObjectiveInfo, "type"> & { achID: string; };