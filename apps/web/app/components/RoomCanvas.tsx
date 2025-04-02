"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export const RoomCanvas = ({ slug }: { slug: string }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error("Token not found");
      setIsConnecting(false);
      return;
    }
    const WS_BASE_URL = process.env.NODE_ENV === "development" 
      ? process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT || "ws://127.0.0.1"
      : process.env.NODE_ENV === "test" 
      ? process.env.NEXT_PUBLIC_BACKEND_URL_TEST?.replace("http://", "ws://") || "ws://13.217.201.135"
      : process.env.NEXT_PUBLIC_BACKEND_URL_PRODUCTION?.replace("http://", "ws://") || "ws://3.87.245.116";
    
    const WS_PORT = process.env.NEXT_PUBLIC_WS_PORT || "6000";
    
    const wsUrl = `${WS_BASE_URL}:${WS_PORT}/?token=${token}`;

    const ws = new WebSocket(wsUrl);

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

  return <Canvas slug={slug} socket={socket} />;
};