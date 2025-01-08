import { isPrimitive } from "./index";
import { AchievementInfo, AchievementState, AchievementStateList, CounterObjectiveInfo, ListObjectiveInfo, ObjectiveState, SequentialObjectiveInfo, PartialObjectiveInfo, ObjectiveValueType, ObjectiveInfo } from "./types";

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
    const ret: AchievementStateList = {};
    for(const achievement of achievementList) {
        const achState: AchievementState =  {
            completed: !shouldMakeEmptySlate,
            objectives: {}
        };
        for(const objective of achievement.objectives) {
            switch(objective.type) {
                case 'list':
                    if(shouldMakeEmptySlate) {
                        achState.objectives[objective.objid] = [];
                    } else {
                        const obj = objective as ListObjectiveInfo;
                        achState.objectives[objective.objid] = obj.values.map((subobj) => subobj.subobjid);
                    }
                    break;
                case 'counter':
                    if(shouldMakeEmptySlate) {
                        achState.objectives[objective.objid] = 0;
                    } else {
                        const obj = objective as CounterObjectiveInfo;
                        achState.objectives[objective.objid] = obj.goal;
                    }
                    break;
                case 'sequential':
                    if(shouldMakeEmptySlate) {
                        achState.objectives[objective.objid] = 0;
                    } else {
                        const obj = objective as SequentialObjectiveInfo;
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
    const newState = structuredClone(oldState);
    const achID = action.achID;
    const objID = action.objID ?? '';
    if(!Object.values(STATE_ACTION).includes(action.type)) { // make sure action type is valid
        throw new Error(`Unknown action "${action.type}"`);
    }
    // Check that objID exists for objective related actions
    if(action.type !== STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK && !Object.hasOwn(action, 'objID')) {
        throw new Error(`Missing "objID" in doStateUpdate`);
    }
    switch(action.type) {
        case STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK: {
            if(!Object.hasOwn(action, 'shouldMarkOff')) {
                throw new Error(`Missing "shouldMarkOff" in doStateUpdate`);
            }
            const shouldMarkOff = action.shouldMarkOff as boolean;
            newState[achID].completed = shouldMarkOff;
            if(shouldMarkOff) {
                newState[achID].objectives = structuredClone(goalState[achID].objectives);
            } else {
                newState[achID].objectives = resetObjective(oldState[achID].objectives);
            }
            break;
        }
        case STATE_ACTION.OBJ_SET_NUMERICAL: {
            if(!Object.hasOwn(action, 'n')) {
                throw new Error(`Missing "n" in doStateUpdate`);
            }
            const n = action.n! as number;
            // data validation
            if(n < 0) {
                throw new Error(`"n" cannot be negative`);
            }
            if(n > (goalState[achID].objectives[objID] as number)) {
                throw new Error(`"n" cannot be greater than goal state n, ${action}`);
            }
            newState[achID].objectives[objID] = n;
            break;
        }
        case STATE_ACTION.OBJ_TOGGLE_LIST_ITEM: {
            if(!Object.hasOwn(action, 'subobjID')) {
                throw new Error(`Missing "subobjID" in doStateUpdate`);
            }
            if(!Object.hasOwn(action, 'shouldMarkOff')) {
                throw new Error(`Missing "shouldMarkOff" in doStateUpdate`);
            }
            const subobjID = action.subobjID!;
            // data validation
            const goalList = goalState[achID].objectives[objID] as string[];
            if(!goalList.includes(subobjID)) {
                throw new Error(`subobjID given does not exist`);
            }

            const oldValue = oldState[achID].objectives[objID] as string[];
            if(action.shouldMarkOff) {
                newState[achID].objectives[objID] = oldValue.concat(subobjID);
            } else {
                newState[achID].objectives[objID] = oldValue.filter((item) => item !== subobjID);
            }
            break;
        }
    }
    if(action.type !== STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK) { // if we just did something with the objectives...
        const areObjectivesFulfilled = compareObjectiveObjects(goalState[achID].objectives, newState[achID].objectives);
        if(newState[achID].completed && !areObjectivesFulfilled) { // If we are no longer fulfilling objs but still have achievement marked complete...
            newState[achID].completed = false;
        } else if(areObjectivesFulfilled && !newState[achID].completed) { // If we are fulfilling objs w/ achievement marked incomplete
            newState[achID].completed = true;
        }
    }
    return newState;
}

export class StateUpdateError extends Error {
    constructor(message?: string) {
        super(message);
    }
    toString() { return this.message; }
};

const NEW_STATE_ACTION: Record<string, (newState: AchievementStateList, achInfo: AchievementInfo, action: StateUpdate) => string[]> = {
    'achComplete': achCompleteMark,
    'objSetNumerical': objSetNumerical, 
    'objSetList': objSetList
};

const DEFAULTS: Record<string, ObjectiveValueType> = {
    'counter': 0,
    'sequential': 0,
    'list': [],
    'partial': []
};

const GET_GOAL: Record<string, (objInfo: ObjectiveInfo) => ObjectiveValueType> = {
    'counter': (info) => (info as CounterObjectiveInfo).goal,
    'sequential': (info) => (info as SequentialObjectiveInfo).values.length,
    'list': (info) => (info as ListObjectiveInfo).values.map((subobj) => subobj.subobjid),
    'partial': (info) => (info as PartialObjectiveInfo).values.map((subobj) => subobj.subobjid)
}

export type StateUpdateOutput = { newState: AchievementStateList, rowsChanged: string[] };

function achCompleteMark(newState: AchievementStateList, achInfo: AchievementInfo, action: StateUpdate): string[] {
    if(!Object.hasOwn(action, "shouldMarkOff")) {
        throw new StateUpdateError(`Missing new value in action`);
    }
    const achID = achInfo.id;
    const rowsChanged = [];
    const shouldMarkOff = action.shouldMarkOff as boolean;
    // no change check
    if((newState[achID].completed && shouldMarkOff) || 
        (!newState[achID].completed && !shouldMarkOff)) {
        return [];
    }
    newState[achID].completed = shouldMarkOff;
    rowsChanged.push(`${achID}.completed`);
    for(const obj of achInfo.objectives) {
        const objID = obj.objid, objType = obj.type;
        if(shouldMarkOff) {
            newState[achID].objectives[objID] = structuredClone(GET_GOAL[objType](obj));
        } else {
            newState[achID].objectives[objID] = structuredClone(DEFAULTS[objType]);
        }
        rowsChanged.push(`${achID}.objectives.${objID}`);
    }
    return rowsChanged;
}

function objSetNumerical(newState: AchievementStateList, achInfo: AchievementInfo, action: StateUpdate): string[] {
    if(!Object.hasOwn(action, "n")) {
        throw new StateUpdateError("No value indicated in state update");
    }
    const achID = action.achID, objID = action.objID!, newVal = action.n!;
    if(newVal < 0) {
        throw new StateUpdateError("New value cannot be negative");
    }
    const objInfo = achInfo.objectives.find((obj) => obj.objid === objID);
    if(!objInfo) {
        throw new StateUpdateError(`Unknown objective "${objID}"`);
    }
    let goal: number;
    if(objInfo.type === 'counter') {
        goal = (objInfo as CounterObjectiveInfo).goal;
    } else if(objInfo.type === 'sequential') {
        goal = (objInfo as SequentialObjectiveInfo).values.length;
    } else {
        throw new StateUpdateError("Invalid action type for this objective");
    }
    if(newVal > goal) {
        throw new StateUpdateError("New value cannot exceed goal value");
    }
    // no change check
    if(newState[achID].objectives[objID] === newVal) {
        return [];
    }
    newState[achID].objectives[objID] = newVal;
    const rowsChanged = [ `${achID}.objectives.${objID}` ];

    const isAchObjFulfilled = isAchievementObjectivesFulfilled(newState, achInfo);
    // unmark achievement if needed
    if((isAchObjFulfilled && !newState[achID].completed) || 
       (!isAchObjFulfilled && newState[achID].completed)) {
        newState[achID].completed = isAchObjFulfilled;
        rowsChanged.push(`${achID}.completed`);
    }
    return rowsChanged;
}

function objSetList(newState: AchievementStateList, achInfo: AchievementInfo, action: StateUpdate): string[] {
    if(!Object.hasOwn(action, "subobjID")) {
        throw new StateUpdateError("No subobjid indicated in state update");
    }
    if(!Object.hasOwn(action, "shouldMarkOff")) {
        throw new StateUpdateError("No shouldMarkOff indicated in state update");
    }
    const achID = action.achID, objID = action.objID!, subobjID = action.subobjID!, shouldMarkOff = action.shouldMarkOff!;
    const objInfo = achInfo.objectives.find((obj) => obj.objid === objID);
    if(!objInfo) {
        throw new StateUpdateError(`Unknown objective "${objID}"`);
    }
    if(objInfo.type !== 'list' && objInfo.type !== 'partial') {
        throw new StateUpdateError("Invalid action type for this objective");
    }
    const validSubobjids = (objInfo as ListObjectiveInfo).values;
    if(!validSubobjids.some(val => val.subobjid === subobjID)) {
        throw new StateUpdateError(`Unknown subobjid ${subobjID}`);
    }
    const targetObj = newState[achID].objectives[objID] as string[];
    // no change check
    if( (shouldMarkOff && targetObj.some(val => val === subobjID)) || 
        (!shouldMarkOff && !targetObj.some(val => val === subobjID))   ) {
        return [];
    }
    const rowsChanged = [ `${achID}.objectives.${objID}` ];
    if(shouldMarkOff) {
        targetObj.push(subobjID); 
    } else {
        newState[achID].objectives[objID] = targetObj.filter((val) => val !== subobjID);
    }

    const isAchObjFulfilled = isAchievementObjectivesFulfilled(newState, achInfo);

    // unmark achievement if needed
    if((isAchObjFulfilled && !newState[achID].completed) || 
       (!isAchObjFulfilled && newState[achID].completed)) {
        newState[achID].completed = isAchObjFulfilled;
        rowsChanged.push(`${achID}.completed`);
    }
    return rowsChanged;
}

export function isAchievementObjectivesFulfilled(newState: AchievementStateList, achInfo: AchievementInfo): boolean {
    const objState = newState[achInfo.id].objectives;
    for(const obj of achInfo.objectives) {
        const objID = obj.objid, objType = obj.type;
        if(!Object.hasOwn(objState, objID)) { // fail-safe
            return false;
        }
        if(!Object.hasOwn(GET_GOAL, obj.type)) {
            // hypothetically speaking this should _never_ happen
            throw new StateUpdateError(`Unknown objtype ${objType}`);
        }
        const goal = GET_GOAL[obj.type](obj);
        const objVal = objState[objID];

        if(objType === 'counter' || objType === 'sequential') {
            if(goal !== objVal) return false;
        } else if (objType === 'list') {
            const goalCasted = goal as string[];
            const valCasted = objVal as string[];
            
            const check = goalCasted.every((subobjid) => valCasted.includes(subobjid));
            if(!check) return false;
        } else if(objType === 'partial') {
            const valLength = (objVal as string[]).length;
            const objCasted = obj as PartialObjectiveInfo;
            
            if(valLength < objCasted.count) return false;
        }
    }
    return true;
}

export function newStateUpdate(oldState: AchievementStateList, achList: AchievementInfo[], action: StateUpdate): StateUpdateOutput {
    if(!Object.hasOwn(action, "type")) {
        throw new StateUpdateError("No action indicated in state update");
    }
    if(!Object.hasOwn(action, "achID")) {
        throw new StateUpdateError("No achievement specified in state update");
    }
    const actionType = action.type, achID = action.achID;
    if(!Object.values(STATE_ACTION).includes(actionType)) {
        throw new StateUpdateError(`Unknown state update action "${actionType}"`);
    }
    if(actionType !== STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK && !Object.hasOwn(action, "objID")) {
        throw new StateUpdateError("No objective specified in state update");
    }
    const newState = structuredClone(oldState);
    const achievementInfo = achList.find((ach) => ach.id === achID);
    if(!achievementInfo) {
        throw new StateUpdateError(`Unknown achievement "${achID}"`);
    }
    if(!Object.hasOwn(newState, achID)) { // fail-safe
        newState[achID] = generateDefaultAchievementState(achievementInfo);
    }

    const rowsChanged = NEW_STATE_ACTION[actionType](newState, achievementInfo, action);
    return { newState, rowsChanged };
}

export function generateDefaultAchievementState(ach: AchievementInfo): AchievementState {
    const newState: AchievementState = { completed: false, objectives: {} };
    for(const obj of ach.objectives) {
        newState.objectives[obj.objid] = DEFAULTS[obj.type];
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
    const newObjectives: ObjectiveState = structuredClone(oldObjectives);
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
            const goalSorted = value.toSorted();
            const newSorted = (newState[key] as string[]).toSorted();

            if(JSON.stringify(goalSorted) !== JSON.stringify(newSorted)) return false;
        }
    }
    return true;
}