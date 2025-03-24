
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

export function initDraw(canvas: HTMLCanvasElement)  {
    
      const ctx = canvas.getContext('2d');

      const existingShapes: Shape[] = [];

      if (!ctx) return;
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
      const handleMouseUp = (e: MouseEvent) => {
        isMouseDown = false;
        existingShapes.push({
            type:'rect',
            x: mouse.x,
            y: mouse.y,
            width: size.width,
            height: size.height,
        })
      };

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
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