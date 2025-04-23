import express from "express";
import cors from 'cors';
import userdataRouter from "./routes/userdata";
import gameInfo from "./data/gameinfo";
import pg from 'pg';
import UserSavedataPGDAO from "./data/savedata-dao";
import { SavedataManager } from "./data/savedata-manager";
import InMemorySavedataCache from "./data/memorycache";
import buildAuthMiddleware from "@/middleware/auth";

let passEnv: boolean = true;
const ENV_VARS = [
    'JWT_ISS', 'JWT_SECRET', 
    'PGHOST', 'PGPORT', 'PGDATABASE', 'PG_WEBSERV_USER', 'PG_WEBSERV_PASS',
];
for(const envVar of ENV_VARS) {
    if(process.env[envVar] === undefined) {
        console.error(`Environment variable '${envVar}' is not configured!`);
        passEnv = false;
    }
}
if(process.env['NODE_ENV'] === 'production' && process.env['CORS_ORIGIN'] === undefined) {
    console.error(`Environment variable 'CORS_ORIGIN' is not configured!`);
    passEnv = false;
}
if(!passEnv) process.exit(1);

const pgPool = new pg.Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PG_WEBSERV_USER,
    password: String(process.env.PG_WEBSERV_PASS),
});

const dao = new UserSavedataPGDAO(pgPool);
const savedataRebuider = new SavedataManager(dao, gameInfo);
const savedataCache = new InMemorySavedataCache();
const authHeader = await buildAuthMiddleware(process.env.JWT_SECRET, process.env.JWT_ISS);

const app = express();

const CORS_ORIGIN = process.env['NODE_ENV'] === 'production' ? process.env.CORS_ORIGIN : true;

app.use(cors({
    origin: CORS_ORIGIN,
}));
app.disable('x-powered-by');
app.set('etag', false);
app.use(express.json());

const port = process.env.PORT || 3500;

app.get("/ping", (req, res) => {
    res.send({
        message: "Pong!"
    });
});

app.use('/:uid/:game', authHeader, userdataRouter(savedataRebuider, gameInfo, savedataCache));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));