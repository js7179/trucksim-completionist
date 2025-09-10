import { AchListComponentProps } from "@/components/achievements/AchievementList";
import { LocalIcon, RemoteIcon } from "@/components/achievements/AchievementIcon";
import { LocalCompleteCheckbox, RemoteCompleteCheckbox } from "@/components/achievements/AchievementCompleteCheckbox";
import { LocalListObjective, RemoteListObjective } from "@/components/objectives/ListObjective";
import { LocalCounterObjective, RemoteCounterObjective } from "@/components/objectives/CounterObjective";
import { LocalSequentialObjective, RemoteSequentialObjective } from "@/components/objectives/SequentialObjective";
import { LocalPartialObjective, RemotePartialObjective } from "@/components/objectives/PartialObjective";

export const makeLocalAchListComponents = (): AchListComponentProps => ({
    achIcon: LocalIcon,
    achCompleteCheckbox: LocalCompleteCheckbox,
    achObjList: LocalListObjective,
    achObjCounter: LocalCounterObjective,
    achObjSeq: LocalSequentialObjective,
    achObjPartial: LocalPartialObjective
});

export const makeRemoteAchListComponents = (): AchListComponentProps => ({
    achIcon: RemoteIcon,
    achCompleteCheckbox: RemoteCompleteCheckbox,
    achObjList: RemoteListObjective,
    achObjCounter: RemoteCounterObjective,
    achObjSeq: RemoteSequentialObjective,
    achObjPartial: RemotePartialObjective
});