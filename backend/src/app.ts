import express from "express";

const app = express();

const port = process.env.PORT || 3500;

app.get("/ping", (req, res) => {
    res.send({
        message: "Pong!"
    });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));