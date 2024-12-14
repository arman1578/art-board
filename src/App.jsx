import { useRef, useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [eraserSize] = useState(20);
  const canvasRef = useRef(null);

  // Handle tool switching
  const handlePenClick = () => {
    setIsErasing(false);
  };

  const handleEraserClick = () => {
    setIsErasing(true);
  };

  // Function to get the mouse position relative to the canvas
  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    return { offsetX, offsetY };
  };

  // Draw function: used for pen and erase
  const draw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!isDrawing || !canvas) return;

    const { offsetX, offsetY } = getMousePosition(e);

    if (isErasing) {
      // Erase: Clear part of the canvas (with eraser size)
      ctx.clearRect(offsetX - eraserSize / 2, offsetY - eraserSize / 2, eraserSize, eraserSize);
    } else {
      // Pen: Draw a continuous line
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }

    setLastPosition({ x: offsetX, y: offsetY });
  };

  // Start drawing or erasing (for pen)
  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = getMousePosition(e);
    setLastPosition({ x: offsetX, y: offsetY });
  };

  // Stop drawing or erasing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Eraser click handler: clear at the clicked position, not on drag
  const handleEraseClick = (e) => {
    if (isErasing) {
      const { offsetX, offsetY } = getMousePosition(e);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(offsetX - eraserSize / 2, offsetY - eraserSize / 2, eraserSize, eraserSize);
    }
  };

  // Set up event listeners for mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 5; // Pen width
    ctx.lineCap = "round"; // Smooth line ends
    ctx.strokeStyle = "#000000"; // Pen color

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("click", handleEraseClick); // For eraser clicks

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("click", handleEraseClick); // Remove eraser click listener
    };
  }, [isDrawing, lastPosition, isErasing]);

  return (
    <div className="App">
      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={handlePenClick} className={isErasing ? "" : "active"}>
          🖊️ Pen
        </button>
        <button onClick={handleEraserClick} className={isErasing ? "active" : ""}>
          🧹 Erase
        </button>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} width={800} height={600} className="canvas" />
    </div>
  );
}

export default App;
