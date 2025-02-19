import { UUID } from "crypto";
import { UserSavedataDAO } from "./dao";
import { AchievementStateList } from "trucksim-completionist-common";
import { GameInfo } from "./gameinfo";


export class SavedataRebuilder {
    private dao: UserSavedataDAO;
    private gameInfo: GameInfo;
    
    constructor(dao: UserSavedataDAO, gameInfo: GameInfo) {
        this.dao = dao;
        this.gameInfo = gameInfo;
    }

    async rebuildSavedata(uuid: UUID, game: string): Promise<AchievementStateList> {
        const savedata = structuredClone(this.gameInfo.getSavedataTemplate(game));
        
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