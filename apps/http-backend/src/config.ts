import dotenv from 'dotenv'
dotenv.config()
export const JWT_SECRET = process.env.JWT_SECRET
export const HTTP_PORT = process.env.HTTP_PORT
export const WS_PORT = process.env.WS_PORT
console.log("http port: ", HTTP_PORT)