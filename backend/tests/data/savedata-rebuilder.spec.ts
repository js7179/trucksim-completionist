import { SavedataRebuilder } from "../../src/data/savedata-rebuilder";
import { AchObj, UserSavedataDAO } from "../../src/data/dao";
import { AchievementStateList } from "trucksim-completionist-common";

const defaultState: AchievementStateList = { 
    test: { 
        completed: false,
        objectives: { 
            li: [], 
            co: 0 
        } 
    } 
};
const NIL_UUID = '00000000-0000-0000-0000-000000000000';
const GAME = 'ets2';

const mockDAO: UserSavedataDAO = {
    getUserAllAchievementComplete: vi.fn().mockReturnValue(new Map()),
    getUserAllObjectivesCounter: vi.fn().mockReturnValue(new Map()),
    getUserAllObjectivesList: vi.fn().mockReturnValue(new Map()),
    setUserOneAchievementComplete: vi.fn(),
    setUserOneObjectiveList: vi.fn(),
    setUserOneObjectiveCounter: vi.fn()
};

const rebuilder = new SavedataRebuilder(mockDAO);

describe("savedata rebuilder", async () => {
    beforeAll(() => {
        // Override getSavedataTemplate which just structure clones a copy of the state
        Object.defineProperty(rebuilder, "getSavedataTemplate", {
            value: vi.fn().mockReturnValue(defaultState),
            writable: true,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("blank ach completed, blank list, blank counter", async () => {
        vi.mocked(mockDAO.getUserAllAchievementComplete).mockImplementationOnce(() => Promise.resolve(new Map()));
        vi.mocked(mockDAO.getUserAllObjectivesCounter).mockImplementationOnce(() => Promise.resolve(new Map()));
        vi.mocked(mockDAO.getUserAllObjectivesList).mockImplementationOnce(() => Promise.resolve(new Map()));

        const rebuiltSavedata = await rebuilder.rebuildSavedata(NIL_UUID, GAME);

        expect(rebuiltSavedata).toMatchObject(defaultState);
        expect(rebuilder["getSavedataTemplate"]).toBeCalledWith(GAME);
        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledOnce();
        expect(mockDAO.setUserOneAchievementComplete).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveList).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveCounter).not.toHaveBeenCalled();

        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledWith(NIL_UUID, GAME);
    });

    it("blank ach completed, blank list, filled counter", async () => {
        vi.mocked(mockDAO.getUserAllAchievementComplete).mockImplementationOnce(() => Promise.resolve(new Map()));
        vi.mocked(mockDAO.getUserAllObjectivesCounter).mockImplementationOnce(() => Promise.resolve(new Map<AchObj, number>([
            [{achID: 'test', objID: 'co'}, 5]
        ])));
        vi.mocked(mockDAO.getUserAllObjectivesList).mockImplementationOnce(() => Promise.resolve(new Map()));

        const rebuiltSavedata = await rebuilder.rebuildSavedata(NIL_UUID, GAME);

        expect(rebuiltSavedata).toMatchObject<AchievementStateList>({
            test: {
                completed: false,
                objectives: {
                    li: [],
                    co: 5
                }
            }
        });

        expect(rebuilder["getSavedataTemplate"]).toBeCalledWith(GAME);
        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledOnce();
        expect(mockDAO.setUserOneAchievementComplete).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveList).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveCounter).not.toHaveBeenCalled();

        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledWith(NIL_UUID, GAME);

    });

    it("blank ach completed, filled list, filled counter", async () => {
        vi.mocked(mockDAO.getUserAllAchievementComplete).mockImplementationOnce(() => Promise.resolve(new Map()));
        vi.mocked(mockDAO.getUserAllObjectivesCounter).mockImplementationOnce(() => Promise.resolve(new Map<AchObj, number>([
            [{achID: 'test', objID: 'co'}, 4]
        ])));
        vi.mocked(mockDAO.getUserAllObjectivesList).mockImplementationOnce(() => Promise.resolve(new Map<AchObj, string[]>([
            [{achID: 'test', objID: 'li'}, ['a', 'b']]
        ])));

        const rebuiltSavedata = await rebuilder.rebuildSavedata(NIL_UUID, GAME);

        expect(rebuiltSavedata).toMatchObject<AchievementStateList>({
            test: {
                completed: false,
                objectives: {
                    li: ['a', 'b'],
                    co: 4
                }
            }
        });

        expect(rebuilder["getSavedataTemplate"]).toBeCalledWith(GAME);
        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledOnce();
        expect(mockDAO.setUserOneAchievementComplete).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveList).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveCounter).not.toHaveBeenCalled();

        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledWith(NIL_UUID, GAME);
    });

    it("filled ach completed, filled list, filled counter", async () => {
        vi.mocked(mockDAO.getUserAllAchievementComplete).mockImplementationOnce(() => Promise.resolve(new Map<string, boolean>([
            ['test', true]
        ])));
        vi.mocked(mockDAO.getUserAllObjectivesCounter).mockImplementationOnce(() => Promise.resolve(new Map<AchObj, number>([
            [{achID: 'test', objID: 'co'}, 5]
        ])));
        vi.mocked(mockDAO.getUserAllObjectivesList).mockImplementationOnce(() => Promise.resolve(new Map<AchObj, string[]>([
            [{achID: 'test', objID: 'li'}, ['a', 'b', 'c']]
        ])));

        const rebuiltSavedata = await rebuilder.rebuildSavedata(NIL_UUID, GAME);

        expect(rebuiltSavedata).toMatchObject<AchievementStateList>({
            test: {
                completed: true,
                objectives: {
                    li: ['a', 'b', 'c'],
                    co: 5
                }
            }
        });
        expect(rebuilder["getSavedataTemplate"]).toBeCalledWith(GAME);
        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledOnce();
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledOnce();
        expect(mockDAO.setUserOneAchievementComplete).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveList).not.toHaveBeenCalled();
        expect(mockDAO.setUserOneObjectiveCounter).not.toHaveBeenCalled();

        expect(mockDAO.getUserAllAchievementComplete).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesCounter).toHaveBeenCalledWith(NIL_UUID, GAME);
        expect(mockDAO.getUserAllObjectivesList).toHaveBeenCalledWith(NIL_UUID, GAME);
    });
});

