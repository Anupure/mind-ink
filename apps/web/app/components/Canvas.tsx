'use client'

import { useEffect, useRef } from "react";
import { initDraw } from "../draw";


export const Canvas = ({slug, socket}:{slug:string, socket:WebSocket})=>{

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            initDraw(canvas, slug, socket);
        }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <canvas ref={canvasRef} id="myCanvas" className="w-full h-full"></canvas>
    </div>
  );
}