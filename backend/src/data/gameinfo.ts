import { AchievementInfo, AchievementStateList, generateStateTemplate } from "trucksim-completionist-common";
import ets2List from "trucksim-completionist-common/data/ets2_achievements.json";
import atsList from "trucksim-completionist-common/data/ats_achievements.json";

class GameInfo {
    private achInfos= new Map<string, AchievementInfo[]>();
    private savedataTemplates = new Map<string, AchievementStateList>();

    constructor(gameInfos: Map<string, AchievementInfo[]>) {
        this.achInfos = gameInfos;
        this.savedataTemplates = new Map<string, AchievementStateList>();
        gameInfos.forEach((achInfo, game) => {
            this.savedataTemplates.set(game, generateStateTemplate(achInfo));
        });
    }

    /** Determines if the game is known. Used for validation.
     * @param game Game to test for existence in application
     * @returns True if game exists, false otherwise
     */
    isValidGame(game: string): boolean {
        return this.achInfos.has(game);
    }

    /** Gets the achievement list for a particular game
     * @param game The game to grab the achievement list for
     * @returns The achievement list for the game
     * @throws Will throw a generic Error if the game is unknown (invalid input)
     */
    getGameAchInfo(game: string): AchievementInfo[] {
        if(!this.isValidGame(game)) throw new Error(`Unknown game "${game}"`);
        return this.achInfos.get(game)!;
    }

    /** Returns a copy of the blank savedata, a template used to rebuild user savedata 
     * Since it copies a direct reference to the object, do {@link structuredClone} on this object before mutating it
     * @param game Game to get the blank savedata for
     * @returns The savedata with no achievements or objectives progressed
     * @throws Will throw a generic Error if the game is unknown (invalid input)
     */
    getSavedataTemplate(game: string): AchievementStateList {
        if(!this.isValidGame(game)) throw new Error(`Unknown game "${game}"`);
        return this.savedataTemplates.get(game)!;
    }
}

const currentAchInfos = new Map<string, AchievementInfo[]>([
    ['ets2', ets2List],
    ['ats', atsList]
]);

const gameInfo = new GameInfo(currentAchInfos);
export default gameInfo;
export { GameInfo };