import { Router, Request, Response } from "express";
import { authenticationMW } from "../../middlewares/authenticationMW";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const roomRouter:Router = Router();

roomRouter.post("/create-room", authenticationMW, async (req: Request, res: Response)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body)
        if(!parsedData.success){
            res.status(402).json({
                "message":parsedData.error.issues[0]?.message
            })
            return
        }

        if(!parsedData.data){
            return
        }
        const name = parsedData.data.name
        const userId = req.userId;
        if(!userId) return
        const findRoom = await prismaClient.room.findFirst({
            where: {
                slug: name
            }
        })
        if(findRoom){
            res.status(409).json({
                "message":"Room with the same name already exists"
            })
            return
        }
        try {
            const room = await prismaClient.room.create({
                data:{
                    slug: name,
                    adminId: userId
                    }
            })

            res.json({
                "message":"Room created successfully",
                "room": room.slug
            })
        } catch (error) {
            res.status(500).json({
                "message":"Internal server error: " + error
            }) 
        }

})
roomRouter.get("/chat/:roomId", authenticationMW, async (req: Request, res: Response)=>{
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

export default roomRouter;