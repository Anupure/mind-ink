import express from "express";
import { HTTP_PORT, JWT_SECRET } from "./config";
import userRouter from "./routes/user";
import roomRouter from "./routes/room";

const app = express();

app.use(express.json());
console.log(HTTP_PORT,JWT_SECRET);

app.use('/api/v1/user', userRouter);
app.use("/api/v1/rooms", roomRouter);

app.listen(HTTP_PORT);