import { AchievementInfo, AchievementState, AchievementStateList, CounterObjectiveInfo, ListObjectiveInfo, SequentialObjectiveInfo, PartialObjectiveInfo, ObjectiveValueType, ObjectiveInfo } from "./types";

/** 
 * Generates an object representing a singular save data, that is either stored locally in the browser or stored
 * in a remote database. It generates a default savedata, in which no achievements have been marked complete
 * and none of the objectives have any progress.
 * 
 * @param {AchievementInfo[]} achievementList A list of all achievements and their associated information
 * @returns {AchievementStateList} State data for a user where all achievements are incomplete
 */
export function generateStateTemplate(achievementList: AchievementInfo[]): AchievementStateList {
    const ret: AchievementStateList = {};
    for(const achievement of achievementList) {
        const achState = generateDefaultAchievementState(achievement);
        ret[achievement.id] = achState;
    }
    return ret;
}

export function generateDefaultAchievementState(ach: AchievementInfo): AchievementState {
    const newState: AchievementState = { completed: false, objectives: {} };
    for(const obj of ach.objectives) {
        newState.objectives[obj.objid] = DEFAULTS[obj.type];
    }
    return newState;
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

/** Given a pre-existing savedata, the achievement list, and some action, clone the savedata
 * and apply the action to the new savedata, returning it along with any rows that was
 * affected by the change.
 * @param oldState The user's savedata before applying the action
 * @param achList The achievement list used to validate actions
 * @param action The specific action to be taken: marking/unmarking items in list objectives,
 *      setting counter objective values, or marking achievements as in/complete
 * @returns The new state under `newState`, along with affected properties in `rowsChanged`
 */
export function performStateUpdate(oldState: AchievementStateList, achList: AchievementInfo[], action: StateUpdate): StateUpdateOutput {
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