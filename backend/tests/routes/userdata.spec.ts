import { UserSavedataCache } from "../../src/data/cache";
import { GameInfo } from "../../src/data/gameinfo";
import { SavedataManager } from "../../src/data/savedata-manager";
import userdataRouter from "../../src/routes/userdata";
import express from "express";
import { AchievementInfo } from "trucksim-completionist-common";
import request from 'supertest';

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const testApp = express();

const testAchievement: AchievementInfo = {
    desc: "",
    icons: {
        completed: "",
        incomplete: ""
    },
    id: "",
    name: "",
    objectives: []
};

const gameInfoGames = new Map([['test', [ testAchievement ]]]);
const gameInfo: GameInfo = new GameInfo(gameInfoGames);

// @ts-expect-error. Complains about DAO. It's fine. We only override implementation for higher layer within DAL.
const savedataManager: SavedataManager = {
    dao: {
        getUserAllAchievementComplete: vi.fn(),
        getUserAllObjectivesList: vi.fn(),
        getUserAllObjectivesCounter: vi.fn(),
        setUserOneAchievementComplete: vi.fn(),
        setUserOneObjectiveList: vi.fn(),
        setUserOneObjectiveCounter: vi.fn()
    },
    gameInfo: gameInfo,
    rebuildSavedata: vi.fn(),
    applyChanges: vi.fn()
};


const savedataCache: UserSavedataCache = {
    hasUserSavedataCached: vi.fn(),
    getUserSavedata: vi.fn(),
    setUserSavedata: vi.fn()
};

testApp.use('/:uid/:game', userdataRouter(savedataManager, gameInfo, savedataCache));

describe("user savedata route", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    
    it("GET, 404s on invalid game", () => {
        request(testApp)
            .get(`/${NIL_UUID}/testfoobar`)
            .expect(404)
            .expect('Invalid game "testfoobar"');
    });
});