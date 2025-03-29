import { Router } from "express";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";


const shapesRouter : Router = Router();

shapesRouter.get("/:slug", async (req: Request, res: Response)=>{
    try {
        const slug = req.params.slug;
        console.log("slug in get shapes is " + slug)
        const messages = await prismaClient.shape.findMany({
            where:{
                roomSlug:slug
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        })
        if(!messages.length){
            res.status(200).json({ messages:[]})
            return
        }else{
            res.status(200).json({ messages: messages });
        }
    } catch (error) {
        res.status(411).json({
            message:[]
        })
    }
    
})

export default shapesRouter;