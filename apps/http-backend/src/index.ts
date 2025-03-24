import express from "express";
import { HTTP_PORT, JWT_SECRET } from "./config";
import userRouter from "./routes/user";
import roomRouter from "./routes/room";
import shapesRouter from "./routes/shapes";
import cors from 'cors';

const app = express();

app.use(express.json());
//cors allow all origins
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
console.log(HTTP_PORT,JWT_SECRET);

app.use('/api/v1/user', userRouter);
app.use("/api/v1/rooms", roomRouter);
app.use('api/v1/shapes/', shapesRouter);

app.listen(Number(HTTP_PORT), '0.0.0.0', () => {
    console.log(`HTTP server listening on port ${HTTP_PORT}`);
  });