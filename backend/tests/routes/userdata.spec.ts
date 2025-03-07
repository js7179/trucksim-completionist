import { UserSavedataCache } from "../../src/data/cache";
import { GameInfo } from "../../src/data/gameinfo";
import { SavedataManager } from "../../src/data/savedata-manager";
import userdataRouter from "../../src/routes/userdata";
import express from "express";
import { AchievementInfo, AchievementStateList } from "trucksim-completionist-common";
import request from 'supertest';
import { UUID } from "crypto";

const NIL_UUID: UUID = '00000000-0000-0000-0000-000000000000';
const GAME_NAME = 'test';

// @ts-expect-error. It's fine. We're mocking this.
const gameInfo: GameInfo = {
    achInfos: new Map(),
    savedataTemplates: new Map(),
    isValidGame: vi.fn(),
    getGameAchInfo: vi.fn(),
    getSavedataTemplate: vi.fn()
};
gameInfo.getGameAchInfo = vi.fn();
gameInfo.getSavedataTemplate = vi.fn();
gameInfo.isValidGame = vi.fn();

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

const ROUTE_UNDER_TEST = `/${NIL_UUID}/${GAME_NAME}`;
const testApp = express();
testApp.use('/:uid/:game', userdataRouter(savedataManager, gameInfo, savedataCache));



describe("user savedata route", () => {
    beforeAll(() => {
        vi.mocked(gameInfo.isValidGame).mockImplementation((game) => game === GAME_NAME);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
    
    it("GET, 404s on invalid game", async () => {
        await request(testApp)
            .get(`/${NIL_UUID}/${GAME_NAME + "foobar"}`)
            .expect(404)
            .expect('Invalid game "testfoobar"');

        expect(savedataCache.getUserSavedata).not.toHaveBeenCalled();
    });

    it("GET, 200 in-cache blank slate", async () => {
        const body = {
            test: {
                completed: false,
                objectives: {}
            }
        };

        vi.mocked(savedataCache.hasUserSavedataCached).mockReturnValueOnce(true);
        vi.mocked(savedataCache.getUserSavedata).mockReturnValueOnce(body);

        await request(testApp).get(ROUTE_UNDER_TEST).expect(200, body);
        expect(savedataCache.hasUserSavedataCached).toHaveBeenCalledWith(NIL_UUID, GAME_NAME);
        expect(savedataCache.getUserSavedata).toHaveBeenCalledWith(NIL_UUID, GAME_NAME);
    });
});