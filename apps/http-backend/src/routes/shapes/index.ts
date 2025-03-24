import { Router } from "express";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";


const shapesRouter : Router = Router();

shapesRouter.get("/:slug", async (req: Request, res: Response)=>{
    try {
        const slug = req.params.slug;
        const messages = await prismaClient.shape.findMany({
            where:{
                roomSlug:slug
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

export default shapesRouter;