import axios from "axios";

type RectShape = {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

type CircleShape = {
    type: 'circle';
    x: number;
    y: number;
    radius: number;
}

type Shape = RectShape | CircleShape;

export async function initDraw(canvas: HTMLCanvasElement, slug: string, socket: WebSocket) {
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
                const isDuplicate = existingShapes.some(shape => 
                    shape.x === newShape.x && 
                    shape.y === newShape.y && 
                    shape.type==='rect'&& shape.width === newShape.width && 
                    shape.type==='rect'&& shape.height === newShape.height
                );

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
            ctx.strokeRect(mouse.x, mouse.y, size.width, size.height);
        }
    };

    const handleMouseUp = () => {
        if (isMouseDown) {
            isMouseDown = false;
            const shape: RectShape = {
                type: 'rect',
                x: mouse.x,
                y: mouse.y,
                width: size.width,
                height: size.height,
            };

            // Validate shape dimensions to prevent tiny or zero-sized shapes
            if (Math.abs(shape.width) > 5 && Math.abs(shape.height) > 5) {
                // Add shape to local list
                existingShapes.push(shape);
                
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
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    });
};

const getExistingShapes = async (slug: string): Promise<Shape[]> => {
    try {
        const res = await axios.get(`http://localhost:5000/api/v1/shapes/${slug}`);
        return res.data.messages.map((x: any) => JSON.parse(x.message));
    } catch (error) {
        console.error("Error fetching shapes:", error);
        return [];
    }
};