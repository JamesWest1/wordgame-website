const uuid4 = require("uuid4");
const express = require("express");
const cors = require("cors");

import {Request, Response} from "express";

const app = express();

app.use(cors());

// const jsn = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

interface Player {
    playerId: String,
    name: String,
}

interface Session {
    sessionId: String, //uuid string
    password: String,
    owner: String, // uuid string of the owner
    players: Player[],
    words: Set<String>,
    previous: String,
    timeLimit: Number,
}

let sessions: Map<String, Session> = new Map();

function addPlayer(sessionId:String, player:Player, password:String) {
    let session:Session|undefined = sessions.get(sessionId);
    if (session === undefined) return false;
    if (session.password !== password) return false;
    session.players.push(player);
    return true;
}

app.post("/creategame", (req:Request, res:Response) => {
    let newSessionId:String = uuid4();
    let playerId:String = uuid4();
    let creator:Player = {playerId:playerId, name:req.body.name};
    let timeLimit:Number = req.body.timeLimit
    let newSession: Session = {timeLimit: timeLimit, sessionId:newSessionId, password:req.body.password, players:[creator], owner:playerId, words: new Set<String>(), previous: ""};
    sessions.set(newSession.sessionId, newSession);
    res.send({sessionId: newSession.sessionId, uId: playerId}).status(200);
})

app.put("/joinroom", (req:Request, res:Response) => {
    let sessionId:String = req.body.sessionId;
    let password:String = req.body.password;
    let playerId:String = uuid4();
    let name:String = req.body.name;
    let player:Player = {playerId:playerId, name:name};
    let outcome: boolean = addPlayer(sessionId, player, password);
    if (!outcome) res.send("Session doesn't exist").status(400);
    else res.send({playerId:playerId}).send(200);
})

app.put("/guess/:sessionId", (req: Request, res:Response) => {
    let {sessionId} = req.params;
    let playerId:String = req.body.playerId;
    let guess:String = req.body.guess;
})



app.listen(3003, () => {
    console.log("listening")
})