export interface IconType {
    completed: string;
    incomplete: string;
};

export interface AchievementInfo {
    desc: string;
    icons: IconType;
    id: string;
    name: string;
};

export interface AchievementStateList {
    [achievementID: string]: AchievementState;
}

export interface AchievementState {
    completed: boolean;
}