import { AchievementInfo, AchievementState, AchievementStateList, CounterObjectiveInfo, ListObjectiveInfo, SequentialObjectiveInfo } from "./types";

/** Generates an object representing a singular save data, that is either stored locally in the browser or stored
 * in a remote database. It can generate a default savedata, in which no achievements have been marked complete
 * and none of the objectives have any progress. It can also generate what is called a "goal" savedata, which is
 * used by the reducer to determine, upon objective progress update, if the achievement should be marked complete
 * automatically.
 * 
 * @param {AchievementInfo[]} achievementList A list of all achievements and their associated information
 * @param {boolean} shouldMakeEmptySlate Whether or not to generate default state
 * @returns State object representing either empty slate (new account or savedata) or goals (for completion checking)
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

/** This function is used to copy values over from an old format
 * to a new format that may include new entries. One such example
 * of this use is when an achievement is added to the game - the
 * save data from the old version is copied onto a new version which
 * has the key-value pairs to track the progress of the new achievements.
 * 
 * If a key-value pair exists in
 *      both copies: the old copy's value is copied onto the new value
 *      just the new copy: the default in the new copy is used in the final copy
 *      just the old copy: hypothetically should never happen, but it is not saved
 * 
 * @param {Object} newCopy  What the new format should look like
 * @param {Object} oldCopy  What we're migrating from
 * @returns {Object} The new format with the values from the old, plus defaults
 */
export function copyChanges(newCopy: any, oldCopy: any): Object {
    let finalCopy = structuredClone(newCopy);
    for (const [key, value] of Object.entries(newCopy)) {
        if(!(key in oldCopy)) continue; // skip if this is a new entry

        if(Object(value) !== value) { // test if primitive
            finalCopy[key] = oldCopy[key]
        } else { // is object
            finalCopy[key] = copyChanges(newCopy[key], oldCopy[key]);
        }
    }
    return finalCopy;
}

/** This function clamps a number between [min, max]. This ensures the input
 * does not go below the minimum, or go above the maximum inclusive.
 * 
 * @param {number} min  The minimum allowed value
 * @param {number} num  The number to be clamped, if necessary
 * @param {number} max  The maximum allowed value
 * @returns {number}    The clamped value
 */
export const clamp = (min: number, num: number, max: number): number => Math.min(Math.max(num, min), max);