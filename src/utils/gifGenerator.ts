import GIF from "gif.js";

/**
 * Generates an animated GIF from a list of Canvas elements.
 * Uses gif.js which loads a Web Worker from public/gif.worker.js.
 */
export function generateGIF(
  canvasList: HTMLCanvasElement[],
  delayMs: number = 800,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (canvasList.length === 0) {
        throw new Error("Tidak ada gambar untuk membuat GIF.");
      }

      // Initialize GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: "/gif.worker.js",
        width: canvasList[0].width,
        height: canvasList[0].height,
      });

      // Add each canvas to GIF frames
      canvasList.forEach((canvas) => {
        gif.addFrame(canvas, { delay: delayMs, copy: true });
      });

      // Track progress (value between 0 and 1)
      if (onProgress) {
        gif.on("progress", (p: number) => {
          onProgress(p);
        });
      }

      // On complete, resolve with URL
      gif.on("finished", (blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        resolve(blobUrl);
      });

      // Handle rendering failure
      (gif as any).on("error", (err: any) => {
        reject(err);
      });

      // Start rendering
      gif.render();
    } catch (error) {
      reject(error);
    }
  });
}
