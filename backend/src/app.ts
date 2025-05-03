import express from "express";
import cors from 'cors';
import userdataRouter from "./routes/userdata";
import gameInfo from "./data/gameinfo";
import pg from 'pg';
import UserSavedataPGDAO from "./data/savedata-dao";
import { SavedataManager } from "./data/savedata-manager";
import InMemorySavedataCache from "./data/memorycache";
import buildAuthMiddleware from "@/middleware/auth";
import { existsSync, readFileSync } from "fs";

const secrets: Record<string, string> = {
    PG_WEBSERV_USER: '',
    PG_WEBSERV_PASS: '',
    JWT_SECRET: ''
};

const optConsts: Record<string, string> = {
    CACHE_SIZE: '50'
};

function setupEnv() {
    let passEnv: boolean = true;
    const ENV_VARS = [ 'JWT_ISS', 'PGHOST', 'PGPORT', 'PGDATABASE' ];
    for(const envVar of ENV_VARS) {
        if(process.env[envVar] === undefined) {
            console.error(`Environment variable '${envVar}' is not configured!`);
            passEnv = false;
        }
    }
    // CORS
    if(process.env['NODE_ENV'] === 'production' && process.env['CORS_ORIGIN'] === undefined) {
        console.error(`Environment variable 'CORS_ORIGIN' is not configured!`);
        passEnv = false;
    }
    // Secrets
    for(const key of Object.keys(secrets)) {
        if(process.env[key] !== undefined) { // we've defined it via env variable
            secrets[key] = String(process.env[key]);
            console.warn(`Secret ${key} is exposed in environment variable!`);
            continue;
        }
        const envKeyPath = `${key}_FILE`;
        if(process.env[envKeyPath] === undefined) {
            console.error(`${envKeyPath} is not defined!`);
            passEnv = false;
            continue;
        }
        const secretPath = process.env[envKeyPath]!;
        if(existsSync(secretPath)) {
            const secretValue = readFileSync(secretPath, { encoding: 'utf8' }).trim();
            secrets[key] = secretValue;
        } else {
            console.error(`Secret ${key} is not set either through environment variable or mounted in container!`);
            passEnv = false;
        }
    }
    if(!passEnv) process.exit(1);
    // Optional constants
    for(const key of Object.keys(optConsts)) {
        if(process.env[key] !== undefined) {
            console.log(`Overridden ${key} with '${process.env[key]}'`);
        } else {
            console.log(`${key} set to default '${ optConsts[key] }'`);
        }
    }
}

setupEnv();

const pgPool = new pg.Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: secrets.PG_WEBSERV_USER,
    password: secrets.PG_WEBSERV_PASS,
    ssl: true,
});

const dao = new UserSavedataPGDAO(pgPool);
const savedataRebuider = new SavedataManager(dao, gameInfo);
const savedataCache = new InMemorySavedataCache(Number(optConsts.CACHE_SIZE));
const authHeader = await buildAuthMiddleware(secrets.JWT_SECRET, process.env.JWT_ISS);

const app = express();

const CORS_ORIGIN: string | boolean = process.env['NODE_ENV'] === 'production' ? process.env.CORS_ORIGIN : true;

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
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