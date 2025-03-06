import express from "express";
import cors from 'cors';
import userdataRouter from "./routes/userdata";
import gameInfo from "./data/gameinfo";
import pg from 'pg';
import UserSavedataPGDAO from "./data/savedata-dao";
import { SavedataManager } from "./data/savedata-manager";
import AuthorizationHeaderMiddleware from "./middleware/auth";
import InMemorySavedataCache from "./data/memorycache";

//console.log(process.env);

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

const app = express();

app.use(cors());
app.disable('x-powered-by');
app.set('etag', false);
app.use(express.json());

const port = process.env.PORT || 3500;

app.get("/ping", (req, res) => {
    res.send({
        message: "Pong!"
    });
});

app.use('/:uid/:game', /*AuthorizationHeaderMiddleware,*/ userdataRouter(savedataRebuider, gameInfo, savedataCache));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));