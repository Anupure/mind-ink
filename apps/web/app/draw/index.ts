import axios from "axios";

type RectShape = {
    type: 'rect';
    startX: number;
    startY: number;
    width: number;
    height: number;
}

type CircleShape = {
    type: 'circle';
    startX: number;
    startY: number;
    radius: number;
}
type PencilShape = {
    type: 'line';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

type Shape = RectShape | CircleShape | PencilShape;

type ToolShape = "PENCIL" | "CIRCLE" | "POINTER" | "ERASER" | "SQUARE"

export async function initDraw(canvas: HTMLCanvasElement, slug: string, socket: WebSocket, selectedTool:ToolShape) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // State management
    let isMouseDown = false;
    const mouse = { x: 0, y: 0 };
    const size = { width: 0, height: 0 };
    let existingShapes: Shape[] = [];

    // Fetch and render initial shapes
    async function loadInitialShapes() {
        try {
            existingShapes = await getExistingShapes(slug);
            if (!ctx) return
            clearAndPopulateCanvas(canvas, ctx, existingShapes);
        } catch (error) {
            console.error("Error loading initial shapes:", error);
        }
    }

    // WebSocket message handler
    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            
            // Handle different message types
            if (data.type === 'shape') {
                const newShape = JSON.parse(data.message);
                
                // Prevent duplicate shapes
                const isDuplicate = existingShapes.some(shape => {
                    if (shape.type === 'rect' && newShape.type === 'rect') {
                        return shape.startX === newShape.startX && 
                               shape.startY === newShape.startY && 
                               shape.width === newShape.width && 
                               shape.height === newShape.height;
                    } else if (shape.type === 'circle' && newShape.type === 'circle') {
                        return shape.startX === newShape.startX && 
                               shape.startY === newShape.startY && 
                               shape.radius === newShape.radius;
                    } else if (shape.type === 'line' && newShape.type === 'line') {
                        return shape.startX === newShape.startX && 
                               shape.startY === newShape.startY && 
                               shape.endX === newShape.endX && 
                               shape.endY === newShape.endY;
                    }
                    return false;
                });

                if (!isDuplicate) {
                    existingShapes.push(newShape);
                    clearAndPopulateCanvas(canvas, ctx, existingShapes);
                }
            }
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }
    };

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
        isMouseDown = true;
        mouse.x = e.clientX - canvas.offsetLeft;
        mouse.y = e.clientY - canvas.offsetTop;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isMouseDown) {
            const currentX = e.clientX - canvas.offsetLeft;
            const currentY = e.clientY - canvas.offsetTop;
            
            size.width = currentX - mouse.x;
            size.height = currentY - mouse.y;
            
            clearAndPopulateCanvas(canvas, ctx, existingShapes);
            ctx.strokeStyle = 'white';

            if(selectedTool === 'CIRCLE') {
                const radius = Math.sqrt(Math.pow(currentX - mouse.x, 2) + Math.pow(currentY - mouse.y, 2));
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            else if(selectedTool === 'SQUARE') {
                ctx.strokeRect(mouse.x, mouse.y, (size.width),(size.height));
            }
            else if(selectedTool === 'PENCIL'){
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            }
        }
    };

    const handleMouseUp = (e:MouseEvent) => {
        if (isMouseDown) {
            isMouseDown = false;
            const currentX = e.clientX - canvas.offsetLeft;
            const currentY = e.clientY - canvas.offsetTop;
            let shape : Shape | undefined
            if(selectedTool === 'CIRCLE'){
                const radius = Math.sqrt(Math.pow(currentX - mouse.x, 2) + Math.pow(currentY- mouse.y, 2));
                if(radius>5){
                    shape = {
                        type: 'circle',
                        startX: mouse.x,
                        startY: mouse.y,
                        radius: radius,
                    };
                }
            }
            else if(selectedTool === 'SQUARE'){
                if(Math.abs(size.height)>5 && Math.abs(size.width)>5){

                    shape = {
                        type: 'rect',
                        startX: mouse.x,
                        startY: mouse.y,
                        width: size.width,
                        height: size.height,
                    };
                }
            }
            else if(selectedTool === 'PENCIL'){
                const distance = Math.sqrt(Math.pow(currentX- mouse.x, 2) + Math.pow(currentY- mouse.y, 2))
                if(distance > 5){

                    shape = {
                        type: 'line',
                        startX: mouse.x,
                        startY: mouse.y,
                        endX: currentX,
                        endY: currentY,
                    };
                }
            }
            if (shape) {
                // Add shape to local list
                existingShapes.push(shape as Shape);
                
                // Send shape via WebSocket
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: 'shape',
                        message: JSON.stringify(shape),
                        roomName: slug
                    }));
                }

                // Immediately update canvas
                clearAndPopulateCanvas(canvas, ctx, existingShapes);
            }
        }
    };

    // Canvas resize handler
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        clearAndPopulateCanvas(canvas, ctx, existingShapes);
    };

    // Event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', resizeCanvas);

    // Initial setup
    resizeCanvas();
    await loadInitialShapes();

    // Return cleanup function
    return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('resize', resizeCanvas);
    };
}

const clearAndPopulateCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, existingShapes: Shape[]) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'white';
    existingShapes.forEach((shape) => {
        if (shape.type === 'rect') {
            ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
        }
        else if(shape.type === 'circle') {
            const radius = Math.sqrt(Math.pow(shape.radius, 2));
            ctx.beginPath();
            ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else if(shape.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
        }
    });
};
const BACKEND_URL =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT
    : process.env.NEXT_PUBLIC_ENVIRONMENT === "staging"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_STAGING
    : process.env.NEXT_PUBLIC_BACKEND_URL_PRODUCTION;

  const API_PORT = process.env.NEXT_PUBLIC_HTTP_PORT || 5000;

const getExistingShapes = async (slug: string): Promise<Shape[]> => {
    try {
        const res = await axios.get(`${BACKEND_URL}:${API_PORT}/api/v1/shapes/${slug}`);
        return res.data.messages.map((x: any) => JSON.parse(x.message));
    } catch (error) {
        console.error("Error fetching shapes:", error);
        return [];
    }
};