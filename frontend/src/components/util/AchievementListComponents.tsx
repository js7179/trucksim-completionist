import { AchListComponentProps } from "../AchievementList";
import { LocalIcon, RemoteIcon } from "../AchievementIcon";
import { LocalCompleteCheckbox, RemoteCompleteCheckbox } from "../AchievementCompleteCheckbox";
import { LocalListObjective, RemoteListObjective } from "../objectives/ListObjective";
import { LocalCounterObjective, RemoteCounterObjective } from "../objectives/CounterObjective";
import { LocalSequentialObjective, RemoteSequentialObjective } from "../objectives/SequentialObjective";
import { LocalPartialObjective, RemotePartialObjective } from "../objectives/PartialObjective";

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