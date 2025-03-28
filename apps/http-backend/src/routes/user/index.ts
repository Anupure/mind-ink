
import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt'
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
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = await prismaClient.user.create({
                    data:{
                        email: req.body.username,
                        password: hashedPassword,
                        name: req.body.name
                    }
                })
                if (!JWT_SECRET) {
                    return;
                }
                const token = jwt.sign({ userId: user.id }, JWT_SECRET);
                res.json({
                    "message": "User created successfully",
                    "userId": user.id,
                    token
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

userRouter.post("/signin",async (req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(402).json({
            "message":parsedData.error.issues[0]?.message
        })
    }
    if (!JWT_SECRET) {
        return;
    }
    if(!parsedData.data){
        return
    }
    const {username, password} = parsedData.data
    const user = await prismaClient.user.findFirst({
        where: {
            email: username
        }
    })
    if(!user){
        res.status(404).json({
            "message":"User not found"
        })
        return
    }
    const hashedPassword = await bcrypt.compare(password,user.password)
    if(!hashedPassword){
        res.status(401).json({
            "message":"Invalid credentials"
        })
        return
    }
    const userId = user.id;
    const token = jwt.sign({userId},JWT_SECRET);
    res.json({
        "message": "User authenticated successfully",
        "token": token
    })
})

export default userRouter