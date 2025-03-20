import { Router } from "express";
import { authenticationMW } from "../../middlewares/authenticationMW";
import { CreateRoomSchema } from "@repo/common/types";

const roomRouter:Router = Router();

roomRouter.post("/create-room", authenticationMW, (req, res)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body)
        if(!parsedData.success){
            res.status(402).json({
                "message":"invalid body"
            })
        }

    res.json({"message":"Room"})
})

export default roomRouter;