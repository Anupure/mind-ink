import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, WS_PORT } from "./config";


const wss = new WebSocketServer({port: WS_PORT? parseInt(WS_PORT) : 6000});

wss.on('connection',(ws, request)=>{
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')
    if(!token || !JWT_SECRET){
        return
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    if(typeof decoded=='string' || !decoded || !decoded.userId){
        ws.close();
        return;
    }
    ws.on('error', console.error);

    ws.on('message',(data)=>{
        ws.send("Pong");
    })
})
