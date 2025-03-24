"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export const RoomCanvas = ({ slug }: { slug: string }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    console.log("in between slug: ", slug, "asnd type :", typeof(slug))
    const ws = new WebSocket(
      `ws://127.0.0.1:8080/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbThtcmxndXgwMDAwcXA0c2pnd2oweTZ0IiwiaWF0IjoxNzQyODAyNDc2fQ.KpbmkV8_4LBCD77CcQoK64A5QIdHNvPJyzpmLKiAExk`
    );

    try {
      ws.onopen = () => {
        console.log("WebSocket Connected");
        setSocket(ws);
  
        // Now that the connection is open, send the message
        ws.send(JSON.stringify({ type: "JOIN_ROOM", roomName: slug }));
      };
    } catch (error) {
    console.log("onOpen Error: ", error);
    }
    

    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [slug]);

  if (!socket) {
    return <>Connecting...</>;
  }

  return <Canvas slug={slug} socket={socket} />;
};
