import { useRef, useEffect, memo } from "react";
import { DITHER_CONFIG, BAYER_4X4 } from "../constants/dither.js";
import { quantizeColor, adjustBrightnessContrast } from "../utils/dither.js";

function DitherBackgroundComponent() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    x: -999,
    y: -999,
    targetX: -999,
    targetY: -999,
    radius: 0,
    targetRadius: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let ro;
    let lastTime = 0;
    const interval = 1000 / DITHER_CONFIG.TARGET_FPS;

    const mouse = mouseRef.current;

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inside) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouse.targetX = x;
        mouse.targetY = y;
        mouse.targetRadius = 30; // Diámetro 160px (círculo más contenido y nítido)
        if (mouse.radius < 1) {
          mouse.x = x;
          mouse.y = y;
        }
      } else {
        mouse.targetRadius = 0;
      }
    };

    const handlePointerLeave = () => {
      mouse.targetRadius = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });

    const img = new Image();
    img.src = DITHER_CONFIG.IMAGE_SRC;

    const initDither = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* ignore font loading error */
      }

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      // 1. Obtener píxeles de la imagen original
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = imgW;
      sampleCanvas.height = imgH;
      const sCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
      sCtx.drawImage(img, 0, 0);

      // Calcular posición inferior derecha dentro del área visible según aspect ratio
      const cw = canvas.offsetWidth || 500;
      const ch = canvas.offsetHeight || 900;
      const visibleImgW = (cw / ch) * imgH;
      const rightX = Math.min(
        imgW - 16,
        Math.floor(imgW / 2 + visibleImgW / 2 - 18),
      );
      const bottomY = imgH - 8;

      // Dibujar texto "UdeA" en cursiva integrado antes del dithering
      sCtx.save();
      sCtx.font =
        "italic 700 56px 'Dancing Script', 'Caveat', 'Brush Script MT', 'Segoe Script', cursive";
      sCtx.textAlign = "right";
      sCtx.textBaseline = "bottom";

      // Sombra oscura suave para contraste
      sCtx.fillStyle = "rgba(0, 0, 0, 0.85)";
      sCtx.fillText("UdeA", rightX + 2, bottomY + 2);

      // Letras blancas cursivas para que el Bayer 4x4 las cuantice en dither
      sCtx.fillStyle = "rgba(255, 255, 255, 0.96)";
      sCtx.fillText("UdeA", rightX, bottomY);
      sCtx.restore();

      const imgData = sCtx.getImageData(0, 0, imgW, imgH).data;

      // 2. Definir grid en bloques de BLOCK_SIZE px
      const blockSize = DITHER_CONFIG.BLOCK_SIZE;
      const gridW = Math.floor(imgW / blockSize);
      const gridH = Math.floor(imgH / blockSize);
      const numBlocks = gridW * gridH;

      // 3. Estructuras tipadas por bloque para rendimiento a 60 FPS
      const baseR = new Float32Array(numBlocks);
      const baseG = new Float32Array(numBlocks);
      const baseB = new Float32Array(numBlocks);
      const baseA = new Uint8Array(numBlocks);
      const bayerThreshold = new Float32Array(numBlocks);
      const isAnimated = new Uint8Array(numBlocks);
      const phases = new Float32Array(numBlocks);
      const speeds = new Float32Array(numBlocks);

      // Precalcular datos de cada bloque
      for (let gy = 0; gy < gridH; gy++) {
        for (let gx = 0; gx < gridW; gx++) {
          const bIdx = gy * gridW + gx;
          const srcX = gx * blockSize;
          const srcY = gy * blockSize;

          let rSum = 0;
          let gSum = 0;
          let bSum = 0;
          let aSum = 0;
          let count = 0;

          for (let dy = 0; dy < blockSize && srcY + dy < imgH; dy++) {
            for (let dx = 0; dx < blockSize && srcX + dx < imgW; dx++) {
              const pIdx = ((srcY + dy) * imgW + (srcX + dx)) * 4;
              rSum += imgData[pIdx];
              gSum += imgData[pIdx + 1];
              bSum += imgData[pIdx + 2];
              aSum += imgData[pIdx + 3];
              count++;
            }
          }

          let r = rSum / count / 255.0;
          let g = gSum / count / 255.0;
          let b = bSum / count / 255.0;
          const a = (aSum / count) | 0;

          // Ajustar brillo y contraste
          r = adjustBrightnessContrast(
            r,
            DITHER_CONFIG.BRIGHTNESS,
            DITHER_CONFIG.CONTRAST,
          );
          g = adjustBrightnessContrast(
            g,
            DITHER_CONFIG.BRIGHTNESS,
            DITHER_CONFIG.CONTRAST,
          );
          b = adjustBrightnessContrast(
            b,
            DITHER_CONFIG.BRIGHTNESS,
            DITHER_CONFIG.CONTRAST,
          );

          baseR[bIdx] = r;
          baseG[bIdx] = g;
          baseB[bIdx] = b;
          baseA[bIdx] = a;

          bayerThreshold[bIdx] = BAYER_4X4[gy % 4][gx % 4];

          const anim = Math.random() < DITHER_CONFIG.FLICKER_FRACTION;
          isAnimated[bIdx] = anim ? 1 : 0;
          phases[bIdx] = Math.random() * Math.PI * 2;
          speeds[bIdx] = DITHER_CONFIG.SPEED * (0.8 + Math.random() * 0.4);
        }
      }

      // 4. Canvas offscreen del tamaño del grid
      const offGrid = document.createElement("canvas");
      offGrid.width = gridW;
      offGrid.height = gridH;
      const offCtx = offGrid.getContext("2d");
      const gridImageData = offCtx.createImageData(gridW, gridH);
      const grid32 = new Uint32Array(gridImageData.data.buffer);

      const resize = () => {
        if (!canvas) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const quantSteps = DITHER_CONFIG.LEVELS - 1;
      const startTime = performance.now();

      const draw = (now) => {
        animId = requestAnimationFrame(draw);

        if (now - lastTime < interval) return;
        lastTime = now;

        const timeSec = (now - startTime) / 1000.0;

        // Física suave de interpolación del círculo hacia el cursor
        mouse.x += (mouse.targetX - mouse.x) * 0.22;
        mouse.y += (mouse.targetY - mouse.y) * 0.22;
        mouse.radius += (mouse.targetRadius - mouse.radius) * 0.15;

        for (let i = 0; i < numBlocks; i++) {
          if (baseA[i] < 20) {
            grid32[i] = 0;
            continue;
          }

          let threshold = bayerThreshold[i];

          if (isAnimated[i] === 1) {
            const osc = Math.sin(timeSec * speeds[i] + phases[i]);
            threshold += osc * DITHER_CONFIG.OSC_AMP;
          }

          const rQ = quantizeColor(baseR[i], threshold, quantSteps);
          const gQ = quantizeColor(baseG[i], threshold, quantSteps);
          const bQ = quantizeColor(baseB[i], threshold, quantSteps);

          if (rQ === 0 && gQ === 0 && bQ === 0) {
            grid32[i] = 0;
          } else {
            // Empaquetar píxel RGBA (Little Endian: AABBGGRR)
            grid32[i] = (255 << 24) | (bQ << 16) | (gQ << 8) | rQ;
          }
        }

        offCtx.putImageData(gridImageData, 0, 0);

        const currentCw = canvas.width;
        const currentCh = canvas.height;
        ctx.imageSmoothingEnabled = false;

        const hRatio = currentCw / imgW;
        const vRatio = currentCh / imgH;
        const ratio = Math.max(hRatio, vRatio);

        const renderW = imgW * ratio;
        const renderH = imgH * ratio;
        const offsetX = (currentCw - renderW) / 2;
        const offsetY = (currentCh - renderH) / 2;

        ctx.fillStyle = DITHER_CONFIG.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, currentCw, currentCh);
        ctx.drawImage(offGrid, offsetX, offsetY, renderW, renderH);

        // Revelar imagen normal original nítida dentro del círculo del mouse (sin dither)
        if (mouse.radius > 0.5) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
          ctx.clip();

          // Dibujar la imagen normal en alta calidad (suavizado activado)
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(sampleCanvas, offsetX, offsetY, renderW, renderH);
          ctx.restore();

          // Aro estético sutil que delimita la zona normal
          ctx.save();
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
          ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Anillo exterior tenue
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, mouse.radius + 1.5, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.shadowBlur = 0;
          ctx.stroke();
          ctx.restore();
        }
      };

      animId = requestAnimationFrame(draw);
    };

    img.onload = initDither;

    return () => {
      cancelAnimationFrame(animId);
      if (ro) ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#0b0b0c]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          imageRendering: "pixelated",
        }}
      />

      {/* Sombra de viñeta general */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(11,11,12,0.45) 0%, transparent 45%, rgba(11,11,12,0.15) 100%)",
        }}
      />
    </div>
  );
}

export const Background = memo(DitherBackgroundComponent);
export default Background;
