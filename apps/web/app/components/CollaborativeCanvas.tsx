import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

type Shape = {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

const CollaborativeCanvas: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);

    // Establish WebSocket connection
    useEffect(() => {
        // Replace with your actual token retrieval method
        const token = localStorage.getItem('token');
        
        if (!slug || !token) return;

        const ws = new WebSocket(`ws://localhost:9000?token=${token}`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            // Join the room
            ws.send(JSON.stringify({
                type: 'join_room',
                roomName: slug
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'shape') {
                    const newShape = JSON.parse(data.message);
                    setShapes(prevShapes => {
                        // Prevent duplicate shapes
                        const exists = prevShapes.some(
                            shape => 
                                shape.x === newShape.x && 
                                shape.y === newShape.y && 
                                shape.width === newShape.width && 
                                shape.height === newShape.height
                        );
                        return exists ? prevShapes : [...prevShapes, newShape];
                    });
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [slug]);

    // Canvas drawing logic
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        
        if (!canvas || !ctx || !socket) return;

        const drawShapes = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'white';
            shapes.forEach(shape => {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            });
        };

        // Initial canvas setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Drawing state
        let isDrawing = false;
        let startX = 0;
        let startY = 0;

        const startDraw = (e: MouseEvent) => {
            isDrawing = true;
            startX = e.clientX - canvas.offsetLeft;
            startY = e.clientY - canvas.offsetTop;
        };

        const draw = (e: MouseEvent) => {
            if (!isDrawing) return;

            const currentX = e.clientX - canvas.offsetLeft;
            const currentY = e.clientY - canvas.offsetTop;

            const width = currentX - startX;
            const height = currentY - startY;

            drawShapes(); // Redraw existing shapes
            ctx.strokeStyle = 'white';
            ctx.strokeRect(startX, startY, width, height);
        };

        const endDraw = (e: MouseEvent) => {
            if (!isDrawing) return;
            isDrawing = false;

            const currentX = e.clientX - canvas.offsetLeft;
            const currentY = e.clientY - canvas.offsetTop;

            const shape: Shape = {
                type: 'rect',
                x: startX,
                y: startY,
                width: currentX - startX,
                height: currentY - startY
            };

            // Send shape through WebSocket
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'shape',
                    message: JSON.stringify(shape),
                    roomName: slug
                }));
            }

            drawShapes();
        };

        // Add event listeners
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseout', endDraw);

        // Initial draw
        drawShapes();

        return () => {
            canvas.removeEventListener('mousedown', startDraw);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', endDraw);
            canvas.removeEventListener('mouseout', endDraw);
        };
    }, [shapes, socket, slug]);

    return (
        <canvas 
            ref={canvasRef} 
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%' 
            }} 
        />
    );
};

export default CollaborativeCanvas;