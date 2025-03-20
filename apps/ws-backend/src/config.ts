import dotenv from 'dotenv'
import path from 'path'

// Specify the exact path to your .env file
dotenv.config()
export const JWT_SECRET = process.env.JWT_SECRET
export const HTTP_PORT = process.env.HTTP_PORT
export const WS_PORT = process.env.WS_PORT