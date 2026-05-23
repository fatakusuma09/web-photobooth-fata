export interface FilterOption {
  id: string;
  name: string;
  class: string;
  canvasFilter: string; // for canvas context filter property
}

export interface FrameOption {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { id: "none", name: "Normal", class: "", canvasFilter: "none" },
  { id: "vintage", name: "Vintage", class: "sepia contrast-125 brightness-95", canvasFilter: "sepia(0.6) contrast(1.2) brightness(0.95)" },
  { id: "grayscale", name: "B&W", class: "grayscale contrast-120", canvasFilter: "grayscale(1) contrast(1.2)" },
  { id: "retro-warm", name: "Warm Sun", class: "sepia-[0.25] saturate-150 contrast-105", canvasFilter: "sepia(0.25) saturate(1.5) contrast(1.05)" },
  { id: "cyber-punk", name: "Cyberpunk", class: "hue-rotate-60 saturate-200 contrast-125", canvasFilter: "hue-rotate(60deg) saturate(2) contrast(1.25)" },
  { id: "dreamy", name: "Dreamy", class: "blur-[0.5px] brightness-110 saturate-125 contrast-90", canvasFilter: "blur(0.5px) brightness(1.1) saturate(1.25) contrast(0.9)" },
];

export const FRAME_OPTIONS: FrameOption[] = [
  { id: "none", name: "No Frame", description: "Polos tanpa frame", color: "transparent" },
  { id: "polaroid", name: "Polaroid", description: "Klasik retro putih", color: "#ffffff" },
  { id: "neon", name: "Neon Cyber", description: "Glow magenta & cyan", color: "linear-gradient(to right, #ec4899, #3b82f6)" },
  { id: "pastel-hearts", name: "Love Hearts", description: "Pastel pink & cinta", color: "#fecdd3" },
  { id: "y2k-glitch", name: "Y2K Retro", description: "Ungu retro 2000an", color: "#d8b4fe" },
];

/**
 * Draws the selected frame overlay onto a 2D canvas.
 * This ensures that the generated final images match the live preview frame.
 */
export function drawFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameId: string,
  index: number, // frame index (e.g. 1 to 4) for printing sequence number
  totalFrames: number
) {
  ctx.save();

  if (frameId === "polaroid") {
    // Polaroid Frame: White thick border, especially thicker at the bottom
    const borderTop = Math.round(height * 0.05);
    const borderSide = Math.round(width * 0.05);
    const borderBottom = Math.round(height * 0.15);

    // Temp copy of image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.drawImage(ctx.canvas, 0, 0);
    }

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw image inside the borders
    const innerWidth = width - borderSide * 2;
    const innerHeight = height - borderTop - borderBottom;
    ctx.drawImage(tempCanvas, borderSide, borderTop, innerWidth, innerHeight);

    // Draw caption text
    ctx.fillStyle = "#374151"; // Gray-700
    ctx.font = `italic bold ${Math.round(height * 0.05)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `Photo ${index}/${totalFrames}`,
      width / 2,
      height - borderBottom / 2
    );
  } else if (frameId === "neon") {
    // Neon Cyber: Glowing neon border with gradient and stars
    const thickness = Math.round(width * 0.03);

    // Draw glowing border using canvas shadows
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#f43f5e"; // Pink-500

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#f43f5e");
    grad.addColorStop(0.5, "#a855f7");
    grad.addColorStop(1, "#3b82f6");

    ctx.strokeStyle = grad;
    ctx.lineWidth = thickness;
    ctx.strokeRect(thickness / 2, thickness / 2, width - thickness, height - thickness);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw cyber stars in corners
    ctx.fillStyle = "#ffffff";
    const drawStar = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          x + r * Math.cos(((18 + i * 72) * Math.PI) / 180),
          y - r * Math.sin(((18 + i * 72) * Math.PI) / 180)
        );
        ctx.lineTo(
          x + (r / 2) * Math.cos(((54 + i * 72) * Math.PI) / 180),
          y - (r / 2) * Math.sin(((54 + i * 72) * Math.PI) / 180)
        );
      }
      ctx.closePath();
      ctx.fill();
    };

    drawStar(thickness * 2, thickness * 2, thickness);
    drawStar(width - thickness * 2, thickness * 2, thickness);
    drawStar(thickness * 2, height - thickness * 2, thickness);
    drawStar(width - thickness * 2, height - thickness * 2, thickness);
  } else if (frameId === "pastel-hearts") {
    // Pastel Hearts: Light pink frame with custom heart decorations
    const thickness = Math.round(width * 0.04);
    ctx.strokeStyle = "#fda4af"; // Rose-300
    ctx.lineWidth = thickness;
    ctx.strokeRect(thickness / 2, thickness / 2, width - thickness, height - thickness);

    // Draw little hearts around
    ctx.fillStyle = "#ec4899"; // Pink-500
    const drawHeart = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -size / 4);
      // Left curve
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, -size / 10, 0, size / 2);
      // Right curve
      ctx.bezierCurveTo(size, -size / 10, size / 2, -size / 2, 0, -size / 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const heartSize = Math.round(width * 0.035);
    drawHeart(thickness * 2, thickness * 2, heartSize);
    drawHeart(width - thickness * 2, thickness * 2, heartSize);
    drawHeart(width / 2, thickness * 0.5, heartSize * 0.8);
    drawHeart(thickness * 0.5, height / 2, heartSize * 0.8);
    drawHeart(width - thickness * 0.5, height / 2, heartSize * 0.8);
    drawHeart(thickness * 2, height - thickness * 2, heartSize);
    drawHeart(width - thickness * 2, height - thickness * 2, heartSize);
  } else if (frameId === "y2k-glitch") {
    // Y2K Glitch style purple-green borders
    const thickness = Math.round(width * 0.045);
    
    // Draw offset borders for 3D/Glitch effect
    ctx.strokeStyle = "#22c55e"; // Green-500
    ctx.lineWidth = thickness;
    ctx.strokeRect(thickness / 2 + 2, thickness / 2 - 2, width - thickness, height - thickness);

    ctx.strokeStyle = "#d8b4fe"; // Purple-300
    ctx.lineWidth = thickness;
    ctx.strokeRect(thickness / 2 - 2, thickness / 2 + 2, width - thickness, height - thickness);

    // Draw some playful text/symbols
    ctx.fillStyle = "#000000";
    ctx.font = `900 ${Math.round(height * 0.045)}px Courier New, monospace`;
    ctx.fillText("★ Y2K ★", thickness * 1.5, height - thickness * 0.8);
    ctx.fillText("CAMERA 01", width - thickness * 4, thickness * 0.8);
  }

  ctx.restore();
}
