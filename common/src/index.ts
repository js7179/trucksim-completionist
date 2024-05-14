import { generateStateTemplate, STATE_ACTION, StateUpdate, doStateUpdate, compareObjectiveObjects } from "./state";
import { AchievementInfo, AchievementStateList, AchievementState, ObjectiveState, ObjectiveInfo, ListObjectiveInfo, ListSubobjectiveItem, SequentialObjectiveInfo, CounterObjectiveInfo } from "./types";

/** 
 * This function is used to copy values over from an old format
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
export function copyChanges(newCopy: any, oldCopy: any): any {
    let finalCopy = structuredClone(newCopy);
    for (const [key, value] of Object.entries(newCopy)) {
        if(!(key in oldCopy)) continue; // skip if this is a new entry

        if(isPrimitive(value)) { // test if primitive
            finalCopy[key] = oldCopy[key]
        } else {
            if(Array.isArray(value)) { // if is array
                finalCopy[key] = Array.from(oldCopy[key]);
            } else {
                finalCopy[key] = copyChanges(newCopy[key], oldCopy[key]);
            }
        }
    }
    return finalCopy;
}

/**
 * This function tests if the given `val` is a primitive or an object.
 * 
 * If `val` was an object, then Object(val) will just return val. If it
 * was a primitive, then it returns an Object but equivalent to val. We then
 * use strict equality, which should fail if it's a primitive because their
 * types differ.
 * 
 * @param val The value to test if primitive or not
 * @returns {boolean}  If value is a primitive
 */
export function isPrimitive(val: any): boolean {
    return Object(val) !== val;
}

/**
 * This function clamps a number between [min, max]. This ensures the input
 * does not go below the minimum, or go above the maximum inclusive.
 * 
 * @param {number} min  The minimum allowed value
 * @param {number} num  The number to be clamped, if necessary
 * @param {number} max  The maximum allowed value
 * @returns {number}    The clamped value
 */
export const clamp = (min: number, num: number, max: number): number => Math.min(Math.max(num, min), max);

/* c8 ignore next */
export { generateStateTemplate, STATE_ACTION, doStateUpdate }; // re-export
/* c8 ignore next */
export type { StateUpdate, AchievementInfo, AchievementStateList, AchievementState, ObjectiveState, ObjectiveInfo, ListObjectiveInfo, ListSubobjectiveItem, SequentialObjectiveInfo, CounterObjectiveInfo };