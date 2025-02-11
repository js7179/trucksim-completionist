import pg from 'pg';
import UserSavedataPGDAO from '../../src/db/savedata-dao';

const adminConnection = new pg.Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PG_MASTER_USER,
    password: String(process.env.PG_MASTER_PASS),
});
const pool = new pg.Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PG_WEBSERV_USER,
    password: String(process.env.PG_WEBSERV_PASS),
});

const NIL_UUID = '00000000-0000-0000-0000-000000000000';
const TEST_ACHNID = 1_000_000;
const TEST_ACHTID = 'test';
const TEST_OBJNID_LIST = TEST_ACHNID + 1;
const TEST_OBJTID_LIST = 'foo';
const TEST_OBJNID_COUNTER = TEST_ACHNID + 2;
const TEST_OBJTID_COUNTER = 'bar';
const GAME = 'ets2';

const DAO = new UserSavedataPGDAO(pool);

async function cleanup(client: pg.Client) {
    await client.query('DELETE FROM auth.users WHERE id=$1::uuid', [NIL_UUID]);
    await client.query('DELETE FROM info_obj_list WHERE obj_nid=$1', [TEST_OBJNID_LIST]);
    await client.query('DELETE FROM info_obj_counter WHERE obj_nid=$1', [TEST_OBJNID_COUNTER]);
    await client.query('DELETE FROM info_achievement WHERE ach_nid=$1', [TEST_ACHNID]);
}

describe("savedata DAO", async () => {
    beforeAll(async () => {
        await adminConnection.connect();
        await cleanup(adminConnection); // Remove old information from the db
        await adminConnection.query('INSERT INTO auth.users (id) VALUES ($1::uuid)', [NIL_UUID]);
        await adminConnection.query('INSERT INTO info_achievement (ach_nid, ach_tid, game) VALUES ($1, $2, $3::trucksim_game)', 
            [TEST_ACHNID, TEST_ACHTID, GAME]);
        await adminConnection.query('INSERT INTO info_obj_list (obj_nid, ach_nid, obj_tid, goal) VALUES ($1, $2, $3, $4)', 
            [TEST_OBJNID_LIST, TEST_ACHNID, TEST_OBJTID_LIST, ['a', 'b', 'c']]);
        await adminConnection.query('INSERT INTO info_obj_counter (obj_nid, ach_nid, obj_tid, goal) VALUES ($1, $2, $3, $4)', 
            [TEST_OBJNID_COUNTER, TEST_ACHNID, TEST_OBJTID_COUNTER, 10]);
    });

    afterAll(async () => {
        await cleanup(adminConnection);
        await adminConnection.end();
        await pool.end();
    });

    it("achievement completed", async () => {
        const setSuccess = await DAO.setUserOneAchievementComplete(NIL_UUID, GAME, TEST_ACHTID, false);
        expect(setSuccess).toBeTruthy();

        const getResults = await DAO.getUserAllAchievementComplete(NIL_UUID, GAME);
        expect(getResults).toBeDefined();
        expect(getResults!.size).toEqual(1);
        expect(getResults!.get(TEST_ACHTID)).toBe(false);
    });

    it("objective, list", async () => {
        const listValue: string[] = ['a', 'b'];

        const setSuccess = await DAO.setUserOneObjectiveList(NIL_UUID, GAME, TEST_ACHTID, TEST_OBJTID_LIST, listValue);
        expect(setSuccess).toBeTruthy();

        const getResults = await DAO.getUserAllObjectivesList(NIL_UUID, GAME);
        expect(getResults).toBeDefined();
        expect(getResults!.size).toEqual(1);

        const { value } = getResults!.entries().next();
        expect(value[0]['achID']).toStrictEqual(TEST_ACHTID);
        expect(value[0]['objID']).toStrictEqual(TEST_OBJTID_LIST);
        expect(value[1]).toHaveLength(2);
        expect(value[1]).toEqual(expect.arrayContaining(listValue));
    });

    it("objective, counter", async () => {
        const newValue = 5;
        
        const setSuccess = await DAO.setUserOneObjectiveCounter(NIL_UUID, GAME, TEST_ACHTID, TEST_OBJTID_COUNTER, newValue);
        expect(setSuccess).toBeTruthy();

        const getResults = await DAO.getUserAllObjectivesCounter(NIL_UUID, GAME);
        expect(getResults).toBeDefined();
        expect(getResults!.size).toEqual(1);

        const { value } = getResults!.entries().next();
        expect(value[0]['achID']).toStrictEqual(TEST_ACHTID);
        expect(value[0]['objID']).toStrictEqual(TEST_OBJTID_COUNTER);
        expect(value[1]).toStrictEqual(newValue);
    });

    it("validation failure, counter", async () => {
        const newValue = 11;
        const setFailure = await DAO.setUserOneObjectiveCounter(NIL_UUID, GAME, TEST_ACHTID, TEST_OBJTID_COUNTER, newValue);
        expect(setFailure).toBeFalsy();
    });

    it("validation failure, list", async () => {
        const newValue = ['a', 'b', 'x'];
        const setFailure = await DAO.setUserOneObjectiveList(NIL_UUID, GAME, TEST_ACHTID, TEST_OBJTID_LIST, newValue);
        expect(setFailure).toBeFalsy();
    });
});
