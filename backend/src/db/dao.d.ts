import { UUID } from "crypto";

export interface UserSavedataDAO {
    /** Given a specific user ID and a game value, return all achID with corresponding achID status
     * Used to rebuild user savedata
     * @param user Specific user to retrieve savedata for
     * @param game Specific game of the user to retrieve savedata for
     * @returns Map where key is achID and value is boolean (true if complete, false if not)
     */
    getUserAllAchievementComplete(user: UUID, game: string): Promise<Map<string, boolean> | null>;

    /** Given a specific user ID and a game value, return all current list (or generally string[]) objective values
     * Used to rebuild user savedata
     * @param user Specific user to retrieve savedata for
     * @param game Specific game of the user to retrieve savedata for
     * @returns Map where key is 2-length tuple object where {achID, objID} and value is that objective's current value
     */
    getUserAllObjectivesList(user: UUID, game: string): Promise<Map<AchObj, string[]> | null>;
    
    /** Given a specific user ID and a game value, return all counter objective values
     * Used to rebuild user savedata
     * @param user Specific user to retrieve savedata for
     * @param game Specific game of the user to retrieve savedata for
     * @returns Map where key is 2-length tuple object where {achID, objID} and value is that objective's current value
     */
    getUserAllObjectivesCounter(user: UUID, game: string): Promise<Map<AchObj, number> | null>;

    /** Mark an achievement in/complete, mutating data in the underlying database
     * @param user User whose savedata we are mutating
     * @param game Which game the achievement falls under
     * @param achID What achievement do we want to update the completion state for
     * @returns boolean representing if mutation was a success or not (false if it fails db-level validation)
     */
    setUserOneAchievementComplete(user: UUID, game: string, achID: string, newIsComplete: boolean): Promise<boolean>;

    /** Mutate a list objective in the user's savedata
     * @param user User whose savedata we are mutating
     * @param game Which game the achievement falls under
     * @param achID What achievement do we want to update the completion state for
     * @param objID What objective we want to mutate
     * @param newList The new value that should be inserted, replacing the old one
     * @returns boolean representing if mutation was a success or not (false if it fails db-level validation)
     */
    setUserOneObjectiveList(user: UUID, game: string, achID: string, objID: string, newList: string[]): Promise<boolean>;
    
    /** Mutate a counter objective in the user's savedata
     * @param user User whose savedata we are mutating
     * @param game Which game the achievement falls under
     * @param achID What achievement do we want to update the completion state for
     * @param objID What objective we want to mutate
     * @param newValue The new value that should be inserted, replacing the old one
     * @returns boolean representing if mutation was a success or not (false if it fails db-level validation)
     */
    setUserOneObjectiveCounter(user: UUID, game: string, achID: string, objID: string, newValue: number): Promise<boolean>;
}

export type AchObj = {
    achID: string,
    objID: string
};