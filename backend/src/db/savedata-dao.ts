import pg from 'pg';
import { AchObj, UserSavedataDAO } from "./dao";
import { UUID } from "crypto";

/** 1: uuid     2: game     3: ach ID       4: newCompleted */
const QUERY_SET_ACHCOMPLETED: pg.QueryConfig = {
    text: `INSERT INTO data_ach_completed (uid, ach_nid, iscompleted) VALUES (
            $1::uuid,
            (SELECT ach_nid FROM info_achievement WHERE ach_tid=$3::text AND game=$2::trucksim_game),
            $4
            ) ON CONFLICT (uid, ach_nid) DO UPDATE SET iscompleted=$4`
};

/** 1: uuid     2: game     3: ach ID       4: obj ID       5: value */
const QUERY_SET_OBJ_LIST: pg.QueryConfig = {
    text: `INSERT INTO data_obj_list (uid, obj_nid, val) VALUES (
            $1::uuid,
            (SELECT obj_nid FROM info_mapping_objectives WHERE game=$2::trucksim_game AND ach_tid=$3 AND obj_tid=$4),
            $5::text[]
            ) ON CONFLICT (uid, obj_nid) DO UPDATE SET val=$5::text[]`
};

/** 1: uuid     2: game     3: ach ID       4: obj ID       5: value */
const QUERY_SET_OBJ_COUNTER: pg.QueryConfig = {
    text: `INSERT INTO data_obj_counter (uid, obj_nid, val) VALUES (
        $1::uuid,
        (SELECT obj_nid FROM info_mapping_objectives WHERE game=$2::trucksim_game AND ach_tid=$3 AND obj_tid=$4),
        $5
        ) ON CONFLICT (uid, obj_nid) DO UPDATE SET val=$5`
};

// 1: uuid      2: game
const QUERY_GET_ACHCOMPLETED: pg.QueryConfig = {
    name: 'data_get_achcompleted',
    text: `SELECT info_achievement.ach_tid, data_ach_completed.iscompleted
            FROM data_ach_completed 
            JOIN info_achievement ON info_achievement.ach_nid=data_ach_completed.ach_nid
            WHERE data_ach_completed.uid=$1::uuid AND info_achievement.game=$2::trucksim_game`
};

// TODO: Switch GET queries into using `info_mapping_objectives`?

/** 1: uuid      2: game */
const QUERY_GET_OBJ_LIST: pg.QueryConfig = {
    name: 'data_get_obj_list',
    text: `SELECT info_mapping_objectives.ach_tid, info_mapping_objectives.obj_tid, data_obj_list.val
            FROM data_obj_list 
            JOIN info_mapping_objectives ON info_mapping_objectives.obj_nid=data_obj_list.obj_nid
            WHERE data_obj_list.uid=$1::uuid AND info_mapping_objectives.game=$2::trucksim_game`
};

/** 1: uuid      2: game */ 
const QUERY_GET_OBJ_COUNTER: pg.QueryConfig = {
    name: 'data_get_obj_counter',
    text: `SELECT info_mapping_objectives.ach_tid, info_mapping_objectives.obj_tid, data_obj_counter.val
            FROM data_obj_counter
            JOIN info_mapping_objectives ON info_mapping_objectives.obj_nid=data_obj_counter.obj_nid
            WHERE data_obj_counter.uid=$1::uuid AND info_mapping_objectives.game=$2::trucksim_game`
};

export default class UserSavedataPGDAO implements UserSavedataDAO {
    private client: pg.Pool;
    constructor(client: pg.Pool) {
        this.client = client;
    }

    async getUserAllAchievementComplete(user: UUID, game: string): Promise<Map<string, boolean> | null> {
        const output = new Map<string, boolean>();
        const queryRes = await this.client.query(QUERY_GET_ACHCOMPLETED, [user, game]);
        const rows = queryRes.rows;
        for(const row of rows) {
            output.set(row['ach_tid'], row['iscompleted']);
        }
        return output;
    }

    async getUserAllObjectivesList(user: UUID, game: string): Promise<Map<AchObj, string[]> | null> {
        const output = new Map<AchObj, string[]>();
        const queryRes = await this.client.query(QUERY_GET_OBJ_LIST, [user, game]);
        const rows = queryRes.rows;
        for(const row of rows) {
            output.set({ achID: row['ach_tid'], objID: row['obj_tid']}, row['val']);
        }
        return output;
    }
    
    async getUserAllObjectivesCounter(user: UUID, game: string): Promise<Map<AchObj, number> | null> {
        const output = new Map<AchObj, number>();
        const queryRes = await this.client.query(QUERY_GET_OBJ_COUNTER, [user, game]);
        const rows = queryRes.rows;
        for(const row of rows) {
            output.set({ achID: row['ach_tid'], objID: row['obj_tid']}, row['val']);
        }
        return output;
    }
    
    async setUserOneAchievementComplete(user: UUID, game: string, achID: string, newIsComplete: boolean): Promise<boolean> {
        const result = await this.client.query(QUERY_SET_ACHCOMPLETED, [user, game, achID, newIsComplete]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    async setUserOneObjectiveList(user: UUID, game: string, achID: string, objID: string, newList: string[]): Promise<boolean> {
        const result = await this.client.query(QUERY_SET_OBJ_LIST, [user, game, achID, objID, newList]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    async setUserOneObjectiveCounter(user: UUID, game: string, achID: string, objID: string, newValue: number): Promise<boolean> {
            const result = await this.client.query(QUERY_SET_OBJ_COUNTER, [user, game, achID, objID, newValue]);
            return result.rowCount !== null && result.rowCount > 0;
    }
};