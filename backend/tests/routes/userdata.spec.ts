import { UserSavedataCache } from "../../src/data/cache";
import { GameInfo } from "../../src/data/gameinfo";
import { SavedataManager } from "../../src/data/savedata-manager";
import userdataRouter from "../../src/routes/userdata";
import express, { NextFunction, Request, Response } from "express";
import request from 'supertest';
import { UUID } from "crypto";
import { performStateUpdate } from "trucksim-completionist-common";
import { StateUpdateError } from "trucksim-completionist-common/src/state";

vi.mock('trucksim-completionist-common', () => {
    return {
        performStateUpdate: vi.fn()
    };
});

const NIL_UUID: UUID = '00000000-0000-0000-0000-000000000000';
const GAME_NAME = 'test';
const BLANK_ACTION = {};
const SAVEDATA_INCOMPLETE = { test: { completed: false, objectives: {} } };
const SAVEDATA_COMPLETE = { test: { completed: true, objectives: {} } };

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

// For testing purpose, we explicitly put the UUID in the Auth header rather than a JWT
const AUTH_MIDDLEWARE = vi.fn();

const ROUTE_UNDER_TEST = `/${NIL_UUID}/${GAME_NAME}`;
const testApp = express();
testApp.use(express.json());
testApp.use('/:uid/:game', AUTH_MIDDLEWARE, userdataRouter(savedataManager, gameInfo, savedataCache));

describe("user savedata route", () => {
    beforeAll(() => {
        vi.mocked(gameInfo.isValidGame).mockImplementation((game) => game === GAME_NAME);
        vi.mocked(AUTH_MIDDLEWARE).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            if(req.headers.authorization) {
                res.locals.uuid = req.headers.authorization;
            }
            next();
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
    
    it("GET, 404 invalid game", async () => {
        await request(testApp)
            .get(`/${NIL_UUID}/${GAME_NAME + "foobar"}`)
            .set('Authorization', NIL_UUID)
            .expect(404)
            .expect('Invalid game "testfoobar"');

        expect(savedataCache.hasUserSavedataCached).not.toHaveBeenCalled();
    });

    it("GET, 403 forbidden no-auth", async () => {
        await request(testApp)
            .get(ROUTE_UNDER_TEST)
            .expect(403);

        expect(savedataCache.hasUserSavedataCached).not.toHaveBeenCalled();
    });

    it("GET, 200 in-cache", async () => {
        vi.mocked(savedataCache.hasUserSavedataCached).mockReturnValueOnce(true);
        vi.mocked(savedataCache.getUserSavedata).mockReturnValueOnce(SAVEDATA_INCOMPLETE);

        await request(testApp)
            .get(ROUTE_UNDER_TEST)
            .set('Authorization', NIL_UUID)
            .expect(200, SAVEDATA_INCOMPLETE);
        expect(savedataCache.hasUserSavedataCached).toHaveBeenCalledWith(NIL_UUID, GAME_NAME);
        expect(savedataCache.getUserSavedata).toHaveBeenCalledWith(NIL_UUID, GAME_NAME);
        expect(savedataManager.rebuildSavedata).not.toHaveBeenCalled();
    });

    it("GET, 200 not-in-cache", async () => {
        vi.mocked(savedataCache.hasUserSavedataCached).mockReturnValueOnce(false);
        vi.mocked(savedataManager.rebuildSavedata).mockResolvedValueOnce(SAVEDATA_COMPLETE);

        await request(testApp)
            .get(ROUTE_UNDER_TEST)
            .set('Authorization', NIL_UUID)
            .expect(200, SAVEDATA_COMPLETE);
        expect(savedataCache.hasUserSavedataCached).toHaveBeenCalledWith(NIL_UUID, GAME_NAME);
        expect(savedataCache.setUserSavedata).toBeCalledWith(NIL_UUID, GAME_NAME, SAVEDATA_COMPLETE);
        expect(savedataManager.rebuildSavedata).toHaveBeenCalledWith(NIL_UUID, GAME_NAME);
    });

    it("POST, 404 invalid game", async () => {
        await request(testApp)
            .post(`/${NIL_UUID}/${GAME_NAME + "foobar"}`)
            .set('Authorization', NIL_UUID)
            .send(BLANK_ACTION)
            .expect(404, 'Invalid game "testfoobar"');

        expect(savedataCache.hasUserSavedataCached).not.toHaveBeenCalled();
        expect(performStateUpdate).not.toHaveBeenCalled();
    });

    it("POST, 403 forbidden no-auth", async () => {
        await request(testApp)
            .post(ROUTE_UNDER_TEST)
            .expect(403);

        expect(savedataCache.hasUserSavedataCached).not.toHaveBeenCalled();
    });

    it("POST, 200 mark ach complete", async () => {
        const rowsChanged = ['test.completed'];
        vi.mocked(savedataCache.hasUserSavedataCached).mockReturnValueOnce(true);
        vi.mocked(savedataCache.getUserSavedata).mockResolvedValueOnce(SAVEDATA_INCOMPLETE);
        vi.mocked(performStateUpdate).mockReturnValueOnce({ newState: SAVEDATA_COMPLETE, rowsChanged: rowsChanged});

        await request(testApp)
            .post(ROUTE_UNDER_TEST)
            .set('Authorization', NIL_UUID)
            .send(BLANK_ACTION)
            .expect(200, SAVEDATA_COMPLETE);

        expect(performStateUpdate).toHaveBeenCalled();
        expect(savedataManager.applyChanges).toHaveBeenCalledWith(NIL_UUID, GAME_NAME, SAVEDATA_COMPLETE, rowsChanged);
        expect(savedataCache.setUserSavedata).toHaveBeenCalledWith(NIL_UUID, GAME_NAME, SAVEDATA_COMPLETE);       
    });

    it("POST, 204 not modified", async () => {
        vi.mocked(savedataCache.hasUserSavedataCached).mockReturnValueOnce(true);
        vi.mocked(savedataCache.getUserSavedata).mockReturnValueOnce(SAVEDATA_COMPLETE);
        vi.mocked(performStateUpdate).mockReturnValueOnce({ newState: SAVEDATA_COMPLETE, rowsChanged: []});

        await request(testApp)
            .post(ROUTE_UNDER_TEST)
            .set('Authorization', NIL_UUID)
            .send(BLANK_ACTION)
            .expect(204);

        expect(performStateUpdate).toHaveBeenCalled();
        expect(savedataManager.applyChanges).not.toHaveBeenCalled();
        expect(savedataCache.setUserSavedata).not.toHaveBeenCalled();       
    });

    it("POST, 400 bad request", async () => {
        const errorMsg = 'test';

        vi.mocked(savedataCache.hasUserSavedataCached).mockReturnValueOnce(false);
        vi.mocked(savedataManager.rebuildSavedata).mockResolvedValueOnce(SAVEDATA_INCOMPLETE);
        vi.mocked(performStateUpdate).mockImplementationOnce(() => { throw new StateUpdateError(errorMsg) });

        await request(testApp)
            .post(ROUTE_UNDER_TEST)
            .set('Authorization', NIL_UUID)
            .send(BLANK_ACTION)
            .expect(400, { message: errorMsg });

        expect(performStateUpdate).toHaveBeenCalled();
        expect(savedataManager.applyChanges).not.toHaveBeenCalled();
        expect(savedataCache.setUserSavedata).not.toHaveBeenCalled();
    });

    it("POST, 503 save to DAO", async () => {
        const rowsChanged = ['test.completed'];
        vi.mocked(savedataCache.hasUserSavedataCached).mockReturnValueOnce(true);
        vi.mocked(savedataCache.getUserSavedata).mockReturnValueOnce(SAVEDATA_INCOMPLETE);
        vi.mocked(performStateUpdate).mockReturnValueOnce({ newState: SAVEDATA_COMPLETE, rowsChanged: rowsChanged });
        vi.mocked(savedataManager.applyChanges).mockImplementationOnce(() => { throw new Error() });

        await request(testApp)
            .post(ROUTE_UNDER_TEST)
            .set('Authorization', NIL_UUID)
            .send(BLANK_ACTION)
            .expect(503);
        expect(performStateUpdate).toHaveBeenCalled();
        expect(savedataManager.applyChanges).toHaveBeenCalled();
        expect(savedataCache.setUserSavedata).not.toHaveBeenCalled();
    });
});