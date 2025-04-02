import { WebSocketServer, WebSocket } from "ws";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, WS_PORT } from "./config";
import { prismaClient } from "@repo/db/client";
const PORT = Number(WS_PORT || 7000);

const wss = new WebSocketServer({
    port: 9000,
    verifyClient: (info:any) => {
      info.req.headers['Access-Control-Allow-Origin'] = '*';
      return true;
    },
    perMessageDeflate: false,
});
  
interface User {
    userId: string,
    rooms: string[],
    ws: WebSocket
}

let users: User[] = []
const rooms: string[] = []

const checkUser = (token: string): string | null => {
    if(!token || !JWT_SECRET){
        return null
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if(typeof decoded === 'string' || !decoded || !decoded.userId){
            return null;
        }
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

wss.on('connection', async (ws, request) => {
    console.log('New connection');
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')
    if(token === null){
        ws.close();
        return;
    }
    const userId = checkUser(token);
    console.log("decoded userId: ", userId);
    if(userId === null){
        console.log('Invalid token');
        ws.close();
        return null;
    }

    // Store the user with their WebSocket connection
    const user: User = {userId, rooms: [], ws};
    users.push(user);

    ws.on('message', async function message(data) {
        let parsedData :any;
        try {
            if(typeof data !== "string"){
                parsedData = JSON.parse(data.toString());
            } else {
                parsedData = JSON.parse(data);
            }

            switch(parsedData.type) {
                case 'join_room':
                    const joinUser = users.find(x => x.ws === ws);
                    if (joinUser) {
                        joinUser.rooms.push(parsedData.roomName);
                        console.log(`User ${userId} joined room ${parsedData.roomName}`);
                    }
                    break;

                case 'leave_room':
                    const leaveUser = users.find(x => x.ws === ws);
                    if (leaveUser) {
                        leaveUser.rooms = leaveUser.rooms.filter(room => room !== parsedData.roomName);
                        console.log(`User ${userId} left room ${parsedData.roomName}`);
                    }
                    break;

                case 'shape':
                    const roomName = parsedData.roomName;
                    const message = parsedData.message;

                    // Save shape to database
                    await prismaClient.shape.create({
                        data: {
                            roomSlug: roomName,
                            message,
                            userId
                        }
                    });

                    // Broadcast shape to all users in the room
                    users.forEach(user => {
                        if (user.rooms.includes(roomName)) {
                            try {
                                user.ws.send(JSON.stringify({
                                    type: "shape",
                                    message: message,
                                    userId: userId
                                }));
                            } catch (error) {
                                console.error(`Error sending message to user in room ${roomName}:`, error);
                            }
                        }
                    });
                    break;

                default:
                    console.log('Unknown message type:', parsedData.type);
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        // Remove the user from the users array
        users = users.filter(u => u.ws !== ws);
        console.log(`User ${userId} disconnected`);
    });
});

console.log(`WebSocket server running on port ${PORT}`);