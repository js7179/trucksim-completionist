import { UUID } from "crypto";
import { AchievementStateList } from "trucksim-completionist-common";

export interface UserSavedataCache {

    /** Determines if a user has their savedata for a particular game saved
     * in the cache currently
     * @param uuid UUID of the user
     * @param game What game to query the availability of the user's savedata for
     * @returns {boolean} True if the savedata is in the cache, false otherwise
     */
    hasUserSavedataCached(uuid: UUID, game: string): boolean;

    /** Retrieves savedata in a specific game for a specific player from the cache
     * If it's not found in the cache, then null is returned
     * @param uuid The UUID of the user 
     * @param game What game to pull the user's savedata for
     */
    getUserSavedata(uuid: UUID, game: string): AchievementStateList | undefined;

    /** Sets savedata in a specific game for a specific player in the cache
     * 
     * @param uuid UUID of the user
     * @param game What game to pull the user's savedata for
     * @param newState The new savedata for that user's game
     * @returns {boolean} Whether or not if the value was saved to the cache successfully
     */
    setUserSavedata(uuid: UUID, game: string, newState: AchievementStateList): boolean;
}