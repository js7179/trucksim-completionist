import { useLocalFuncMarkListObj, useLocalStateAchievementListObj } from "@/hooks/LocalAchievementHooks";
import { clamp, PartialObjectiveInfo } from "trucksim-completionist-common";
import SubobjList, { SubobjListProps } from "./SubobjList";
import { useRemoteFuncMarkListObj, useRemoteStateAchievementObjList } from "@/hooks/RemoteAchievementHooks";
import { useRemotePage } from "@/hooks/RemotePageContext";
import { Center, Stack, Text } from "@mantine/core";

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
    const clampedValue = clamp(0, current.length, goalCount);
    const text = `${clampedValue} / ${goalCount}`;

    return (
        <Stack mt='md' gap='0'>
            <Center>
                <Text>{text}</Text>
            </Center>
            <SubobjList achID={achID} values={values} objid={objid} current={current} func={func} />
        </Stack>
    );
}

export type PartialObjectivesProp = Omit<PartialObjectiveInfo, "type"> & { achID: string; };
type VisualPartialObjectivesProp = PartialObjectivesProp & SubobjListProps;