import { Router } from "express";
import { authenticationMW } from "../../../middlewares/authenticationMW";

const roomRouter:Router = Router();

roomRouter.post("/create-room", authenticationMW, (req, res)=>{
    //db call

    res.json({"message":"Room"})
})

export default roomRouter;