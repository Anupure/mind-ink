import axios from "axios";
const mouse = {
    x: 0,
    y: 0,
  };
const size ={
    width: 0,
    height: 0,
}
type Shape = {
    type: 'rect',
    x: number,
    y: number,
    width: number,
    height: number,
} | {
    type: 'circle',
    x: number,
    y: number,
    radius: number,
}

export async function initDraw(canvas: HTMLCanvasElement, slug : string, socket: WebSocket)  {
    
      const ctx = canvas.getContext('2d');

      const existingShapes: Shape[] = await getExistingShapes(slug);
      
      if (!ctx) return;

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type === 'chat'){
            const message = data.message;
            existingShapes.push(message);
            clearAndPopulateCanvas(canvas, ctx, existingShapes);
        }
      }

      let isMouseDown = false;
      const handleMouseDown = (e: MouseEvent) => {
        isMouseDown = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };
      const handleMouseMove = (e: MouseEvent) => {
        if(isMouseDown) {
        size.width = e.clientX - mouse.x;
        size.height = e.clientY - mouse.y;
        
        }
        clearAndPopulateCanvas(canvas, ctx, existingShapes);
        ctx.strokeRect(mouse.x, mouse.y, size.width, size.height);
      };
      const handleMouseUp = () => {
        isMouseDown = false;
        const shape : Shape = {
            type:'rect',
            x: mouse.x,
            y: mouse.y,
            width: size.width,
            height: size.height,
        }
        existingShapes.push(shape)
        socket.send(JSON.stringify({
          type: 'chat',
          message: JSON.stringify(shape)
        }))
      };

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        clearAndPopulateCanvas(canvas, ctx, existingShapes);
        
        ctx.strokeStyle = 'white';
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
      };
  
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
}

const clearAndPopulateCanvas = (canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D, existingShapes: Shape[]) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach((shape: Shape) => {
        if(shape.type ==='rect'){
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        }
    })
    
}

const getExistingShapes = async(slug:string ) => {

  const res = await axios.get(`http://localhost:5000/api/v1/shapes/${slug}`)
  const messages = res.data.message;
  const parsedMessage = JSON.parse(messages);
  const shapes : Shape[] = parsedMessage.map((message: any) => JSON.parse(message));
  
  console.log("parsed Messages: ", parsedMessage);
  console.log("shapes: ", shapes);
  return shapes
}