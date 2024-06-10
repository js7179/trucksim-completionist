export interface AchievementInfo {
    desc: string;
    icons: {
        completed: string;
        incomplete: string;
    };
    id: string;
    name: string;
    objectives: ObjectiveInfo[];
}

export interface AchievementStateList {
    [achievementID: string]: AchievementState;
}

export interface AchievementState {
    completed: boolean;
    objectives: ObjectiveState;
}

export interface ObjectiveState {
    [objID: string]: string[] | number;
}

export interface ObjectiveInfo {
    objid: string;
    type: string;
}

export interface ListSubobjectiveItem {
    subobjid: string;
    display: string;
}

export interface ListObjectiveInfo extends ObjectiveInfo {
    values: ListSubobjectiveItem[];
}

export interface SequentialObjectiveInfo extends ObjectiveInfo {
    values: ListSubobjectiveItem[];
}

export interface CounterObjectiveInfo extends ObjectiveInfo {
    display: string;
    goal: number;
}