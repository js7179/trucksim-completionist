import { AchievementInfo, AchievementStateList } from "./types";

function generateDefaultState(aList: AchievementInfo[]): AchievementStateList {
    var ret: AchievementStateList = {};
    for(const achievement of aList) {
        ret[achievement.id] = {
            completed: false
        };
    }
    return ret;
}

export { generateDefaultState };