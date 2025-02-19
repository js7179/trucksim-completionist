import { UUID } from "crypto";
import { UserSavedataDAO } from "./dao";
import { AchievementStateList } from "trucksim-completionist-common";
import { templateSavedataETS2, templateSavedataATS } from "./gameinfo";

export class SavedataRebuilder {
    private dao: UserSavedataDAO;

    constructor(dao: UserSavedataDAO) {
        this.dao = dao;
    }

    private getSavedataTemplate(game: string): AchievementStateList {
        if(game === 'ets2') {
            return structuredClone(templateSavedataETS2);
        } else if(game === 'ats') {
            return structuredClone(templateSavedataATS);
        } else {
            throw new Error(`Unknown game "${game}"`);
        }
    }

    async rebuildSavedata(uuid: UUID, game: string): Promise<AchievementStateList> {
        const savedata = this.getSavedataTemplate(game);
        
        const achCompletedData = await this.dao.getUserAllAchievementComplete(uuid, game);
        const objCounterData = await this.dao.getUserAllObjectivesCounter(uuid, game);
        const objListData = await this.dao.getUserAllObjectivesList(uuid, game);

        for(const [achID, isCompleted] of achCompletedData) {
            savedata[achID].completed = isCompleted;
        }
        for(const [achObj, counterVal] of objCounterData) {
            savedata[achObj.achID].objectives[achObj.objID] = counterVal;
        }
        for(const [achObj, listVal] of objListData) {
            savedata[achObj.achID].objectives[achObj.objID] = [...listVal];
        }
        return savedata;
    }
}