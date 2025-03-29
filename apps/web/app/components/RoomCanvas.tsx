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

  return <Canvas slug={slug} socket={socket} />;
};