import { generateStateTemplate, STATE_ACTION, StateUpdate, doStateUpdate } from "./state";
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function copyChanges(newCopy: any, oldCopy: any): any {
    const finalCopy = structuredClone(newCopy);
    for (const [key, value] of Object.entries(newCopy)) {
        if(!(key in oldCopy)) continue; // skip if this is a new entry

        if(isPrimitive(value)) { // test if primitive
            finalCopy[key] = oldCopy[key];
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPrimitive(val: any): boolean {
    return Object(val) !== val;
}

/**
 * Determines from two given arrays of the same type, do they both
 * contain the same elements, ignoring their order in the array?
 * 
 * @param {T[]} a Array to compare
 * @param {T[]} b Array to compare
 * @returns {boolean} Do both arrays have the same elements, ignoring order
 * @example
 * isNonorderedArrayEqual([1, 3, 2], [1, 2, 3]) => true
 * isNonorderedArrayEqual([], [1]) => false
 * isNonorderedArrayEqual([], []) => true
 */
export function isNonorderedArrayEqual<T>(a: T[], b: T[]): boolean {
    if(a.length !== b.length) return false;
    return a.every(item => b.includes(item));
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