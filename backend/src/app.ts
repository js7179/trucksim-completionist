import express from "express";
import cors from 'cors';
import userdataRouter from "./routes/userdata";
import gameInfo from "./data/gameinfo";
import pg from 'pg';
import UserSavedataPGDAO from "./data/savedata-dao";
import { SavedataRebuilder } from "./data/savedata-rebuilder";
import AuthorizationHeaderMiddleware from "./middleware/auth";

//console.log(process.env);

const pgPool = new pg.Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PG_WEBSERV_USER,
    password: String(process.env.PG_WEBSERV_PASS),
});

const dao = new UserSavedataPGDAO(pgPool);
const savedataRebuider = new SavedataRebuilder(dao, gameInfo);

const app = express();

app.use(cors());
app.disable('x-powered-by');
app.set('etag', false);

const port = process.env.PORT || 3500;

app.get("/ping", (req, res) => {
    res.send({
        message: "Pong!"
    });
});

app.use('/:uid/:game', /*AuthorizationHeaderMiddleware,*/ userdataRouter(savedataRebuider));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));