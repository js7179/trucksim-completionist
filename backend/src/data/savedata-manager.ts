import { UUID } from "crypto";
import { DAOError, UserSavedataDAO } from "./dao";
import { AchievementStateList, ObjectiveValueType } from "trucksim-completionist-common";
import { GameInfo } from "./gameinfo";


export class SavedataManager {
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

    async applyChanges(uuid: UUID, game: string, newStateObject: AchievementStateList, rowsChanged: string[]) {
        const gameInfo = this.gameInfo.getGameAchInfo(game);
        for(const rowChanged of rowsChanged) {
            const split = rowChanged.split('.');
            const achID = split[0];
            if(split[1] === 'completed') {
                const newValue = newStateObject[achID].completed;
                const result = await this.dao.setUserOneAchievementComplete(uuid, game, achID, newValue);
                if(!result) throw new DAOError(`Could not save complete state change on ${achID} to ${newValue}`);
            } else if(split[1] === 'objectives') {
                const objID = split[2];
                const achInfo = gameInfo.find((ach) => ach.id === achID);
                if(!achInfo) throw new Error(`Unknown achID ${achID}`);
                const objInfo = achInfo.objectives.find((obj) => obj.objid === objID);
                if(!objInfo) throw new Error(`Unknown objID ${objID} for achID ${achID}`);
                
                if(!(objInfo.type in UPDATE_OBJECTIVE)) throw new Error(`Unknown objtype ${objInfo.type} for objID ${objID} of achID ${achID}`);

                const newValue = newStateObject[achID].objectives[objID];
                const result = await UPDATE_OBJECTIVE[objInfo.type](this.dao, uuid, game, achID, objID, newValue);
                if(!result) throw new DAOError(`Could not save objective state change on achID=${achID} objID=${objID}`);
            } else {
                throw new Error(`Unknown rowChanged ${rowChanged}`);
            }
        }
    }
}

type UpdateObjectiveFunc = (dao: UserSavedataDAO, user: UUID, game: string, achID: string, objID: string, newVal: ObjectiveValueType) => Promise<boolean>;

const UPDATE_OBJECTIVE: Record<string, UpdateObjectiveFunc> = {
    'list': async (dao, user, game, achID, objID, newVal) => dao.setUserOneObjectiveList(user, game, achID, objID, newVal as string[]),
    'partial': async (dao, user, game, achID, objID, newVal) => dao.setUserOneObjectiveList(user, game, achID, objID, newVal as string[]),
    'counter': async (dao, user, game, achID, objID, newVal) => dao.setUserOneObjectiveCounter(user, game, achID, objID, newVal as number),
    'sequential': async (dao, user, game, achID, objID, newVal) => dao.setUserOneObjectiveCounter(user, game, achID, objID, newVal as number),
}