/**
 * Generates a collage image using the Canvas API.
 * Supports layouts for 3, 4, or 6 frames.
 */
export async function createCollage(
  canvasList: HTMLCanvasElement[],
  frameCount: number,
  layoutType: "vertical" | "grid" = "grid",
  bgColor: string = "#ffffff"
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (canvasList.length === 0) {
        throw new Error("Tidak ada gambar untuk membuat kolase.");
      }

      // Dimensions of a single capture (640x480 as base)
      const baseWidth = canvasList[0].width;
      const baseHeight = canvasList[0].height;

      // Create a final canvas
      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");

      if (!ctx) {
        throw new Error("Gagal menginisialisasi Canvas Context.");
      }

      const padding = Math.round(baseWidth * 0.03); // dynamic spacing

      if (layoutType === "vertical") {
        // Layout: 1 Column, N Rows (Classic Photo Strip)
        const finalWidth = baseWidth + padding * 2;
        const finalHeight = baseHeight * frameCount + padding * (frameCount + 1) + Math.round(baseHeight * 0.15); // bottom branding space

        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;

        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, finalWidth, finalHeight);

        // Draw images
        for (let i = 0; i < frameCount; i++) {
          const imgCanvas = canvasList[i] || canvasList[0]; // fallback if not enough images
          const x = padding;
          const y = padding + i * (baseHeight + padding);
          ctx.drawImage(imgCanvas, x, y);
        }

        // Draw strip footer text
        ctx.fillStyle = bgColor === "#ffffff" ? "#4b5563" : "#f3f4f6";
        ctx.font = `italic bold ${Math.round(baseHeight * 0.06)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("✨ CaptureMoments ✨", finalWidth / 2, finalHeight - padding * 1.5);

      } else if (layoutType === "grid" && frameCount === 4) {
        // Layout: 2x2 Grid
        const finalWidth = baseWidth * 2 + padding * 3;
        const finalHeight = baseHeight * 2 + padding * 3 + Math.round(baseHeight * 0.15); // bottom branding space

        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;

        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, finalWidth, finalHeight);

        // Draw 4 images
        const positions = [
          { col: 0, row: 0 },
          { col: 1, row: 0 },
          { col: 0, row: 1 },
          { col: 1, row: 1 },
        ];

        for (let i = 0; i < 4; i++) {
          const imgCanvas = canvasList[i] || canvasList[0];
          const pos = positions[i];
          const x = padding + pos.col * (baseWidth + padding);
          const y = padding + pos.row * (baseHeight + padding);
          ctx.drawImage(imgCanvas, x, y);
        }

        // Draw footer text
        ctx.fillStyle = bgColor === "#ffffff" ? "#4b5563" : "#f3f4f6";
        ctx.font = `italic bold ${Math.round(baseHeight * 0.06)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("✨ CaptureMoments ✨", finalWidth / 2, finalHeight - padding * 1.5);

      } else if (layoutType === "grid" && frameCount === 6) {
        // Layout: 2 Columns, 3 Rows (3 left, 3 right)
        const finalWidth = baseWidth * 2 + padding * 3;
        const finalHeight = baseHeight * 3 + padding * 4 + Math.round(baseHeight * 0.15);

        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;

        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, finalWidth, finalHeight);

        // Draw 6 images
        const positions = [
          { col: 0, row: 0 },
          { col: 1, row: 0 },
          { col: 0, row: 1 },
          { col: 1, row: 1 },
          { col: 0, row: 2 },
          { col: 1, row: 2 },
        ];

        for (let i = 0; i < 6; i++) {
          const imgCanvas = canvasList[i] || canvasList[0];
          const pos = positions[i];
          const x = padding + pos.col * (baseWidth + padding);
          const y = padding + pos.row * (baseHeight + padding);
          ctx.drawImage(imgCanvas, x, y);
        }

        // Draw footer text
        ctx.fillStyle = bgColor === "#ffffff" ? "#4b5563" : "#f3f4f6";
        ctx.font = `italic bold ${Math.round(baseHeight * 0.06)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("✨ CaptureMoments ✨", finalWidth / 2, finalHeight - padding * 1.5);
      }

      // Export as base64 URL
      const dataUrl = finalCanvas.toDataURL("image/png");
      resolve(dataUrl);
    } catch (err) {
      reject(err);
    }
  });
}
