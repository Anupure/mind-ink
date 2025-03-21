import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authenticationMW: RequestHandler = async (req, res, next) => {
    const token = req.headers["authorization"] ?? "";
    if(!JWT_SECRET){
        res.status(500).json({
            "message": "Server configuration error"
        });
        return
    }
    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        if(typeof decoded!=='string' ||!decoded){
            res.status(403).json({
                "message": "Invalid token payload"
            });
        }
        else{
            req.userId = decoded;
            next();
        }

    } catch (error) {
        res.status(403).json({
            "message": "Unauthorized"
        });
    }
};