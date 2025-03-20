import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

const userRouter:Router = Router();

userRouter.post("/signup",(req,res)=>{
    res.status(200).json({
        "message": "successful"
    })
})

userRouter.post("/signin",(req,res)=>{
    const userId = 1;
    if (!JWT_SECRET) {
        return;
    }
    const token = jwt.sign({userId},JWT_SECRET, { expiresIn: '1h' });
})

export default userRouter