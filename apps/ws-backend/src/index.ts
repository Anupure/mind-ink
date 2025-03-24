import { WebSocketServer, WebSocket } from "ws";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, WS_PORT } from "./config";
import { prismaClient } from "@repo/db/client";


const wss = new WebSocketServer({
    port: WS_PORT ? parseInt(WS_PORT) : 6000,
    host: '0.0.0.0'
  });
interface User  {
    userId: string,
    rooms: string[],
    ws: WebSocket
}


let users : User[] = []
const rooms: string[] = []

const checkUser = (token : string) :string | null =>{
    if(!token || !JWT_SECRET){
        return null
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log(decoded)
        if(typeof decoded==='string' || !decoded || !decoded.userId){
            return null;
        }
        return decoded.userId;
    } catch (error) {
        return null;
    }
    
}

wss.on('connection',async (ws, request)=>{
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')
    if(token===null){
        ws.close();
        return;
    }
    const userId = checkUser(token);
    if(userId === null){
        console.log('Invalid token');
        ws.close();
        return null;
    }
    users.push({userId, rooms: [], ws})
    ws.on('message', async (data)=>{
        const parsedData = JSON.parse(data as unknown as string);
        if(!parsedData.roomId){
            return;
        }
        if(!rooms.includes(parsedData.roomId)){
            try {
                const roomId = Number(parsedData.roomId);
                const dbRoom = await prismaClient.room.findMany({
                    where:{
                        id: roomId
                    }
                })
                console.log("dbRoom: ",dbRoom);
                if(!dbRoom || dbRoom.length===0){
                    console.error("Room not found");
                    ws.send(JSON.stringify({type: 'error', message: 'Room not found'}));
                    return;
                }
            } catch (error) {
                console.error(error);
                return;  
            }   
        }
        const user = users.find(u=>u.ws===ws);
        if(!user){
            return;
        }
        if(parsedData.type==='join_room'){

            user.rooms.push(parsedData.roomId);
            user.ws.send(JSON.stringify({type: 'room_list', rooms}));
        }
        if(parsedData.type==='leave_room'){
            user.rooms = user.rooms.filter(r=>r!==parsedData.roomId);
        }
        if(parsedData.type==='chat'){
            const message = `${user.userId}: ${parsedData.message}`;
            const roomName = parsedData.roomName;
            const chat = await prismaClient.shape.create({
                data: {
                    roomName,
                    userId,
                    message:parsedData.message
                }
            })
            users.forEach(u => {
                if(u.rooms.includes(roomName)){
                    u.ws.send(JSON.stringify({type: 'chat', message, roomName}));
                }
            });
        }
    })
    
})
