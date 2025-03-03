"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid4 = require("uuid4");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
let sessions = new Map();
function addPlayer(sessionId, player, password) {
    let session = sessions.get(sessionId);
    if (session === undefined)
        return false;
    if (session.password !== password)
        return false;
    session.players.push(player);
    return true;
}
app.get("/creategame", (req, res) => {
    let newSessionId = uuid4();
    let playerId = uuid4();
    let creator = { playerId: playerId, name: req.body.name };
    let newSession = { sessionId: newSessionId, password: req.body.password, players: [creator], owner: playerId };
    sessions.set(newSession.sessionId, newSession);
    res.send({ sessionId: newSession.sessionId, uId: playerId }).status(200);
});
app.put("/joingame", (req, res) => {
    let sessionId = req.body.sessionId;
    let password = req.body.password;
    let playerId = uuid4();
    let name = req.body.name;
    let player = { playerId: playerId, name: name };
    let outcome = addPlayer(sessionId, player, password);
    if (!outcome)
        res.send("Session doesn't exist").status(400);
    else
        res.send({ playerId: playerId }).send(200);
});
app.listen(3003, () => {
    console.log("listening");
});
