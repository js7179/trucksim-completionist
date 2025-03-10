import { AchievementStateList } from "trucksim-completionist-common";
import { UserSavedataCache } from "./cache";
import { LRUCache } from "mnemonist";
import { UUID } from "crypto";

const cacheKey = (uuid: UUID, game: string) => `${uuid}.${game}`;

class InMemorySavedataCache implements UserSavedataCache {

    private cache: LRUCache<string, AchievementStateList>;

    constructor() {
        this.cache = new LRUCache(75);
    }

    hasUserSavedataCached(uuid: UUID, game: string): boolean {
        return this.cache.has(cacheKey(uuid, game));
    }

    getUserSavedata(uuid: UUID, game: string): AchievementStateList | undefined {
        return this.cache.get(cacheKey(uuid, game));
    }
    
    setUserSavedata(uuid: UUID, game: string, newState: AchievementStateList): boolean {
        this.cache.set(cacheKey(uuid, game), newState);
        return true;
    }
}

export default InMemorySavedataCache;