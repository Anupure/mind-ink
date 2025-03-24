import { Router } from "express";
import { authenticationMW } from "../../middlewares/authenticationMW";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";


const chatRouter = Router();

chatRouter.get("/chat/:slug", authenticationMW, async (req: Request, res: Response)=>{
    try {
        const slug = req.params.slug;
        const messages = await prismaClient.shape.findMany({
            where:{
                roomName:slug
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