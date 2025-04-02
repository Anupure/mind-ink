'use client'

import { useEffect, useRef } from "react";
import { initDraw } from "../draw";
import { useAtom } from "jotai";
import { toolSelectState } from "../state/toolSelect";


export const Canvas = ({slug, socket}:{slug:string, socket:WebSocket})=>{
    const [selectedTool] = useAtom(toolSelectState);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cleanupRef = useRef<(() => void) | undefined>(undefined);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Cleanup previous event listeners before initializing a new one
      cleanupRef.current?.();

      initDraw(canvas, slug, socket, selectedTool)
          .then((cleanup) => {
              cleanupRef.current = cleanup; // Store the cleanup function
          })
          .catch((error) => {
              console.error("Error initializing drawing:", error);
          });

      return () => {
          console.log(`Cleaning up canvas for tool: ${selectedTool}`);
          cleanupRef.current?.(); // Ensure previous cleanup runs
          cleanupRef.current = undefined; // Reset reference
      };
  }, [selectedTool]);
  

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <canvas ref={canvasRef} id="myCanvas" className="w-full h-full"></canvas>
    </div>
  );
}