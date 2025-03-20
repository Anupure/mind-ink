
import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import {CreateUserSchema, SigninSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
const userRouter:Router = Router();

userRouter.post("/signup",async (req,res)=>{
    const parsedData = CreateUserSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(402).json({
            "message":parsedData.error.issues[0]?.message
        })
    }
    else{
        try {
            const findUser = await prismaClient.user.findMany({
                where: {
                    email: req.body.username
                }
            })
            if(findUser.length > 0){
                res.status(409).json({
                    "message":"Email already exists"
                })
                return
            }
            try {
                const user = await prismaClient.user.create({
                    data:{
                        email: req.body.username,
                        password: req.body.password,
                        name: req.body.name
                    }
                })
                res.json({
                    "message": "User created successfully",
                    "userId": user.id
                })
            } catch (error) {
                res.status(500).json({
                    "message":"Internal server error: " + error
                })
            }
        } catch (error) {
            res.status(500).json({
                "message":"Internal server error: " + error
            })
        }
        
    }
    
})

userRouter.post("/signin",(req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(402).json({
            "message":"invalid body"
        })
    }
    if (!JWT_SECRET) {
        return;
    }
    if(!parsedData.data){
        return
    }
    const {username, password} = parsedData.data
    const token = jwt.sign(username,JWT_SECRET, { expiresIn: '1h' });
})

export default userRouter