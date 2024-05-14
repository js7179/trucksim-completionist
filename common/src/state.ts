import { isPrimitive } from "./index";
import { AchievementInfo, AchievementState, AchievementStateList, CounterObjectiveInfo, ListObjectiveInfo, ObjectiveState, SequentialObjectiveInfo } from "./types";

/** 
 * Generates an object representing a singular save data, that is either stored locally in the browser or stored
 * in a remote database. It can generate a default savedata, in which no achievements have been marked complete
 * and none of the objectives have any progress. It can also generate what is called a "goal" savedata, which is
 * used by the reducer to determine, upon objective progress update, if the achievement should be marked complete
 * automatically.
 * 
 * @param {AchievementInfo[]} achievementList A list of all achievements and their associated information
 * @param {boolean} shouldMakeEmptySlate Whether or not to generate default state
 * @returns {AchievementStateList} State object representing either empty slate (new account/savedata) or goals (for completion checking)
 */
export function generateStateTemplate(achievementList: AchievementInfo[], shouldMakeEmptySlate: boolean = true): AchievementStateList {
    var ret: AchievementStateList = {};
    for(const achievement of achievementList) {
        let achState: AchievementState =  {
            completed: !shouldMakeEmptySlate,
            objectives: {}
        };
        for(const objective of achievement.objectives) {
            switch(objective.type) {
                case 'list':
                    if(shouldMakeEmptySlate) {
                        achState.objectives[objective.objid] = [];
                    } else {
                        let obj = objective as ListObjectiveInfo;
                        achState.objectives[objective.objid] = obj.values.map((subobj) => subobj.subobjid);
                    }
                    break;
                case 'counter':
                    if(shouldMakeEmptySlate) {
                        achState.objectives[objective.objid] = 0;
                    } else {
                        let obj = objective as CounterObjectiveInfo;
                        achState.objectives[objective.objid] = obj.goal;
                    }
                    break;
                case 'sequential':
                    if(shouldMakeEmptySlate) {
                        achState.objectives[objective.objid] = 0;
                    } else {
                        let obj = objective as SequentialObjectiveInfo;
                        achState.objectives[objective.objid] = obj.values.length;
                    }
                    break;
                default:
                    throw new Error(`Unknown objective type "${objective.type}"`);
            }
        }
        ret[achievement.id] = achState;
    }
    return ret;
}

export const STATE_ACTION = {
    ACHIEVEMENT_COMPLETE_MARK: 'achComplete',
    OBJ_SET_NUMERICAL: 'objSetNumerical',
    OBJ_TOGGLE_LIST_ITEM: 'objSetList'
}

export interface StateUpdate {
    type: string;
    achID: string;
    objID?: string;
    subobjID?: string; // for list, specific item list
    shouldMarkOff?: boolean; // for list, whether to mark as complete or not
    n?: number; // what to set obj value to
}

export function doStateUpdate(oldState: AchievementStateList, goalState: AchievementStateList, action: StateUpdate): AchievementStateList {
    let newState = structuredClone(oldState);
    let achID = action.achID;
    let objID = action.objID ?? '';
    if(!Object.values(STATE_ACTION).includes(action.type)) { // make sure action type is valid
        throw new Error(`Unknown action "${action.type}"`);
    }
    // Check that objID exists for objective related actions
    if(action.type !== STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK && !action.hasOwnProperty('objID')) {
        throw new Error(`Missing "objID" in doStateUpdate`);
    }
    switch(action.type) {
        case STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK:
            if(!action.hasOwnProperty('shouldMarkOff')) {
                throw new Error(`Missing "shouldMarkOff" in doStateUpdate`);
            }
            let shouldMarkOff = action.shouldMarkOff as boolean;
            newState[achID].completed = shouldMarkOff;
            if(shouldMarkOff) {
                newState[achID].objectives = structuredClone(goalState[achID].objectives);
            } else {
                newState[achID].objectives = resetObjective(oldState[achID].objectives);
            }
            break;
        case STATE_ACTION.OBJ_SET_NUMERICAL:
            if(!action.hasOwnProperty('n')) {
                throw new Error(`Missing "n" in doStateUpdate`);
            }
            let n = action.n! as number;
            // data validation
            if(n < 0) {
                throw new Error(`"n" cannot be negative`);
            }
            if(n > (goalState[achID].objectives[objID] as number)) {
                throw new Error(`"n" cannot be greater than goal state n, ${action}`);
            }
            newState[achID].objectives[objID] = n;
            break;
        case STATE_ACTION.OBJ_TOGGLE_LIST_ITEM:
            if(!action.hasOwnProperty('subobjID')) {
                throw new Error(`Missing "subobjID" in doStateUpdate`);
            }
            if(!action.hasOwnProperty('shouldMarkOff')) {
                throw new Error(`Missing "shouldMarkOff" in doStateUpdate`);
            }
            let subobjID = action.subobjID!;
            // data validation
            let goalList = goalState[achID].objectives[objID] as string[];
            if(!goalList.includes(subobjID)) {
                throw new Error(`subobjID given does not exist`);
            }

            let oldValue = oldState[achID].objectives[objID] as string[];
            if(action.shouldMarkOff) {
                var newValue = oldValue.concat(subobjID);
            } else {
                var newValue = oldValue.filter((item) => item !== subobjID);
            }
            newState[achID].objectives[objID] = newValue;
            break;
    }
    if(action.type !== STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK) { // if we just did something with the objectives...
        let areObjectivesFulfilled = compareObjectiveObjects(goalState[achID].objectives, newState[achID].objectives);
        if(newState[achID].completed && !areObjectivesFulfilled) { // If we are no longer fulfilling objs but still have achievement marked complete...
            newState[achID].completed = false;
        } else if(areObjectivesFulfilled && !newState[achID].completed) { // If we are fulfilling objs w/ achievement marked incomplete
            newState[achID].completed = true;
        }
    }
    return newState;
}

/**
 * Resets the objective state. Counter and sequential objectives get set to 0
 * and list objectives have their arrays cleared.
 * 
 * @param {ObjectiveState} oldObjectives Old objective state
 * @returns {ObjectiveState} Resetted objective state
 */
export function resetObjective(oldObjectives: ObjectiveState): ObjectiveState {
    let newObjectives: ObjectiveState = structuredClone(oldObjectives);
    for(const [key, value] of Object.entries(oldObjectives)) {
        if(isPrimitive(value)) { // is number
            newObjectives[key] = 0;
        } else { // is array
            newObjectives[key] = [];
        }
    }

    return newObjectives;
}

export function compareObjectiveObjects(goal: ObjectiveState, newState: ObjectiveState): boolean {
    for(const [key, value] of Object.entries(goal)) {
        if(typeof value === "number") {
            if(value !== newState[key]) return false;
        } else {
            let goalSorted = value.toSorted();
            let newSorted = (newState[key] as string[]).toSorted();

            if(JSON.stringify(goalSorted) !== JSON.stringify(newSorted)) return false;
        }
    }
    return true;
}