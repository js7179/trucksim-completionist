import express from "express";
import cors from 'cors';
import AuthenticationHeader from "./middleware/auth";

const app = express();
app.use(cors());

const port = process.env.PORT || 3500;

app.use(AuthenticationHeader);

app.get("/ping", (req, res) => {
    res.send({
        message: "Pong!"
    });
});

app.get("/testauth", (req, res) => {
    res.status(200).send();
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));