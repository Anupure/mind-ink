import express from "express";
import { PORT, JWT_SECRET } from "./config";
import userRouter from "./routes/user";
import roomRouter from "./routes/user/room";

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use("/api/v1/rooms", roomRouter);

app.listen(PORT);