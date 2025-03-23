import { Router } from "express";
import { authenticationMW } from "../../middlewares/authenticationMW";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";


const chatRouter = Router();

chatRouter.get("/chat/:roomId", authenticationMW, async (req: Request, res: Response)=>{
    const roomId = Number(req.params.roomId);
    try {
        const messages = await prismaClient.chat.findMany({
            where:{
                roomId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        })
        res.json({
            messages
        })
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error: " + error
        })
    }
    
})