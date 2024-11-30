import express from "express";
import cors from 'cors';

const app = express();
app.use(cors());

const port = process.env.PORT || 3500;

app.get("/ping", (req, res) => {
    res.send({
        message: "Pong!"
    });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));