'use client';

import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { initDraw } from '@/app/draw';
import { RecordType } from 'zod';



export default function RoomPage() {
  const { slug } = useParams<{ slug: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        initDraw(canvas);
    }

    return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <canvas ref={canvasRef} id="myCanvas" className="w-full h-full"></canvas>
    </div>
  );
}
function resizeCanvas(this: Window, ev: UIEvent) {
    throw new Error('Function not implemented.');
}

