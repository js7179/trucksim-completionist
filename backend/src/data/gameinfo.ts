import ets2List from "trucksim-completionist-common/data/ets2_achievements.json";
import atsList from "trucksim-completionist-common/data/ats_achievements.json";
import { AchievementInfo, generateStateTemplate } from "trucksim-completionist-common";


export const achInfoETS2 = ets2List as AchievementInfo[];
export const achInfoATS = atsList as AchievementInfo[];

export const templateSavedataETS2 = generateStateTemplate(achInfoETS2);
export const templateSavedataATS = generateStateTemplate(achInfoATS);