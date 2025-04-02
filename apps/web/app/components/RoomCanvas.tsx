"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { Circle, Pencil, MousePointer2, Square, Eraser } from "lucide-react";
import IconButton from "./IconButton";
import { useAtom } from "jotai";
import { toolSelectState } from "../state/toolSelect";

const tools={
  PENCIL: "PENCIL",
  CIRCLE: "CIRCLE",
  POINTER: "POINTER",
  SQUARE: "SQUARE",
  ERASER: "ERASER"
}
type ToolShape = "PENCIL" | "CIRCLE" | "POINTER" | "ERASER" | "SQUARE"

export const RoomCanvas = ({ slug }: { slug: string }) => {
  const [selectedTool, setSelectedTool] = useAtom(toolSelectState)
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error("Token not found");
      setIsConnecting(false);
      return;
    }

    const ws = new WebSocket(
      `ws://127.0.0.1:9000/?token=${token}`
    );

    ws.onopen = () => {
      setSocket(ws);
      setIsConnecting(false);
      // Send join room message
      ws.send(JSON.stringify({ 
        type: "join_room", 
        roomName: slug 
      }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnecting(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [slug]);

  if (isConnecting) {
    return <div>Connecting...</div>;
  }

  if (!socket) {
    return <div>Connection Failed</div>;
  }

  return <div>
      <Canvas slug={slug} socket={socket} />;
      <TopBar selectedTool={selectedTool as ToolShape} setSelectedTool={setSelectedTool}/>
    </div>
};
export const TopBar = ({selectedTool, setSelectedTool}:{selectedTool:ToolShape, setSelectedTool:(s:ToolShape)=>void})=>{
  const handleToolSelect = (tool: ToolShape) => {
    console.log(`Before change: ${selectedTool}`);
    setSelectedTool(tool);
    setTimeout(() => {
      console.log(`After change (async): ${selectedTool}`);
    }, 0);
  };
  return(
    <div className="flex justify-center top-5  left-[40%] fixed rounded-lg bg-slate-800 p-2">
      <IconButton isActive={selectedTool===tools.POINTER} icon={<MousePointer2 />} onClick={()=>
        {setSelectedTool("POINTER")}}></IconButton>
      <IconButton isActive={selectedTool===tools.CIRCLE} icon={<Circle />} onClick={()=>{handleToolSelect("CIRCLE")}}></IconButton>
      <IconButton isActive={selectedTool===tools.PENCIL} icon={<Pencil />} onClick={()=>{handleToolSelect("PENCIL")}}></IconButton>
      <IconButton isActive={selectedTool===tools.SQUARE} icon={<Square />} onClick={()=>{handleToolSelect("SQUARE")}}></IconButton>
      <IconButton isActive={selectedTool===tools.ERASER} icon={<Eraser />} onClick={()=>{handleToolSelect("ERASER")}}></IconButton>
    </div>
  )
}