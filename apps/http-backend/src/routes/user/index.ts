import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import {CreateUserSchema, SigninSchema} from "@repo/common/types"

const userRouter:Router = Router();

userRouter.post("/signup",(req,res)=>{
    const parsedData = CreateUserSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(402).json({
            "message":parsedData.error.issues[0]?.message
        })
    }
    else{
        res.status(200).json({
            "message": "successful"
        })
    }
    
})

userRouter.post("/signin",(req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(402).json({
            "message":"invalid body"
        })
    }
    const userId = 1;
    if (!JWT_SECRET) {
        return;
    }
    const token = jwt.sign({userId},JWT_SECRET, { expiresIn: '1h' });
})

export default userRouter