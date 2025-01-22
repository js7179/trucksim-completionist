import { Client } from 'pg';
import { AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, PartialObjectiveInfo, SequentialObjectiveInfo } from '../common/src/types';
import { readFileSync } from 'fs';

const ETS2_ACHIEVEMENTS: AchievementInfo[] = JSON.parse(readFileSync('./common/data/ets2_achievements.json', { encoding: 'utf8' }));
const ATS_ACHIEVEMENTS: AchievementInfo[] = JSON.parse(readFileSync('./common/data/ats_achievements.json', { encoding: 'utf8' }));

const QUERY_INSERT_ACHIEVEMENT = 'INSERT INTO info_achievement(ach_tid, game) VALUES ($2, $1) RETURNING ach_nid';
const QUERY_INSERT_COUNTER = 'INSERT INTO info_obj_counter(ach_nid, obj_tid, goal) VALUES ($1, $2, $3)';
const QUERY_INSERT_LIST = 'INSERT INTO info_obj_list(ach_nid, obj_tid, goal) VALUES ($1, $2, $3)';

const pgClient = new Client({
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    port: 54322,
    database: 'postgres'
});

async function processGame(gameName: string, achievements: AchievementInfo[]) {
    for(const ach of achievements) {
        const insertResults = await pgClient.query(QUERY_INSERT_ACHIEVEMENT, [gameName, ach.id]);
        const ach_nid = insertResults.rows[0]['ach_nid'];

        for(const obj of ach.objectives) {
            const objType = obj.type;
            if(objType === 'list') {
                const objCasted = obj as ListObjectiveInfo;
                const goalArray = objCasted.values.map((subobj) => subobj.subobjid);
                await pgClient.query(QUERY_INSERT_LIST, [ach_nid, obj.objid, goalArray]);
            } else if(objType === 'counter') {
                const objCasted = obj as CounterObjectiveInfo;
                const goal = objCasted.goal;
                await pgClient.query(QUERY_INSERT_COUNTER, [ach_nid, obj.objid, goal]);
            } else if(objType === 'sequential') {
                const objCasted = obj as SequentialObjectiveInfo;
                const goal = objCasted.values.length;
                await pgClient.query(QUERY_INSERT_COUNTER, [ach_nid, obj.objid, goal]);
            } else if(objType === 'partial') {
                const objCasted = obj as PartialObjectiveInfo;
                const goalArray = objCasted.values.map((subobj) => subobj.subobjid);
                await pgClient.query(QUERY_INSERT_LIST, [ach_nid, objCasted.objid, goalArray]);
            } else {
                console.error(`Unknown objType "${objType}"`);
            }
        }
    }
}

async function main() {
    await pgClient.connect();
    console.log('Connected!');

    console.log('Clearing old data...');
    await pgClient.query('TRUNCATE TABLE info_achievement RESTART IDENTITY CASCADE');
    await pgClient.query('ALTER SEQUENCE info_objnid_seq RESTART WITH 1');

    console.log('Populating ETS2 achievements...');
    await processGame('ets2', ETS2_ACHIEVEMENTS);

    console.log('Populating ATS achievements...');
    await processGame('ats', ATS_ACHIEVEMENTS);

    console.log('Done! Terminating...');
    process.exit(0);
}

main();