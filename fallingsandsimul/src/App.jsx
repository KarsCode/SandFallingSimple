import { useRef, useEffect } from "react";
import p5 from "p5";

function App() {
  const sketchRef = useRef(null);

  useEffect(() => {
    // The p5.js sketch
    const sketch = (p) => {
      let cols, rows, w = 5, hueValue = 200, grid;

      // Create a 2D array
      const make2DArray = (cols, rows) => {
        let arr = new Array(cols);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = new Array(rows).fill(0);
        }
        return arr;
      };

      // Check if a column is within bounds
      const withinCols = (i) => i >= 0 && i < cols;

      // Check if a row is within bounds
      const withinRows = (j) => j >= 0 && j < rows;

      p.setup = () => {
        const canvasWidth = Math.min(window.innerWidth * 0.95, 800); // Adjust width as needed
        const canvasHeight = Math.min(window.innerHeight * 0.9, 500); // Adjust height as needed
        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent(sketchRef.current);
        p.colorMode(p.HSB, 360, 255, 255);
        cols = Math.floor(p.width / w);
        rows = Math.floor(p.height / w);
        grid = make2DArray(cols, rows);
      };

      p.mouseDragged = () => {
        const mouseCol = Math.floor(p.mouseX / w);
        const mouseRow = Math.floor(p.mouseY / w);

        const matrix = 5;
        const extent = Math.floor(matrix / 2);
        for (let i = -extent; i <= extent; i++) {
          for (let j = -extent; j <= extent; j++) {
            if (p.random(1) < 0.75) {
              const col = mouseCol + i;
              const row = mouseRow + j;
              if (withinCols(col) && withinRows(row)) {
                grid[col][row] = hueValue;
              }
            }
          }
        }

        // Change the color of the sand over time
        hueValue += 1;
        if (hueValue > 360) {
          hueValue = 1;
        }
      };

      p.draw = () => {
        p.background(0);

        // Draw the sand
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            p.noStroke();
            if (grid[i][j] > 0) {
              p.fill(grid[i][j], 255, 255);
              let x = i * w;
              let y = j * w;
              p.square(x, y, w);
            }
          }
        }

        // Create a 2D array for the next frame of animation
        const nextGrid = make2DArray(cols, rows);

        // Check every cell
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const state = grid[i][j];

            if (state > 0) {
              const below = grid[i][j + 1];
              let dir = 1;
              if (p.random(1) < 0.5) {
                dir *= -1;
              }

              let belowA = -1;
              let belowB = -1;
              if (withinCols(i + dir)) {
                belowA = grid[i + dir][j + 1];
              }
              if (withinCols(i - dir)) {
                belowB = grid[i - dir][j + 1];
              }

              // Can it fall below or left or right?
              if (below === 0) {
                nextGrid[i][j + 1] = state;
              } else if (belowA === 0) {
                nextGrid[i + dir][j + 1] = state;
              } else if (belowB === 0) {
                nextGrid[i - dir][j + 1] = state;
              } else {
                nextGrid[i][j] = state;
              }
            }
          }
        }

        grid = nextGrid;
      };
    };

    // Create a new p5 instance
    const p5Instance = new p5(sketch);

    // Cleanup on component unmount
    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <div className="p-5 font-bold text-3xl crimson-text-bold text-center">
        Kartik&apos;s Amazing Sand Falling Simulator
      </div>
      <div className="border-4 border-red-500" ref={sketchRef}></div>
    </div>
  );
}

export default App;
