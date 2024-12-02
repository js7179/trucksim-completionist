import express from "express";
import cors from 'cors';
import AuthorizationHeaderMiddleware from "./middleware/auth";

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

app.get("/testauth", AuthorizationHeaderMiddleware, (req, res) => {
    res.status(200).send({ uuid: res.locals.uuid });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));