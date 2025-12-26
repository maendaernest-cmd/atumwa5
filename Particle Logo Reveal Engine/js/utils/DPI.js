/**
 * DPI.js
 * High-DPI display utilities for crisp canvas rendering
 */

class DPI {
  /**
   * Get device pixel ratio, clamped to reasonable values
   * @returns {number} Device pixel ratio
   */
  static getDevicePixelRatio() {
    return Math.min(window.devicePixelRatio || 1, 3); // Cap at 3x for performance
  }

  /**
   * Setup canvas for high-DPI displays
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {number} width - Desired width in CSS pixels
   * @param {number} height - Desired height in CSS pixels
   * @returns {Object} Canvas context and scale factor
   */
  static setupCanvas(canvas, width, height) {
    const ctx = canvas.getContext('2d');
    const dpr = this.getDevicePixelRatio();

    // Set actual size in memory (scaled for retina)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Scale the drawing context so everything draws at the correct size
    ctx.scale(dpr, dpr);

    // Set CSS size (what the canvas appears as on screen)
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    return {
      ctx: ctx,
      scale: dpr,
      width: width,
      height: height
    };
  }

  /**
   * Resize canvas while maintaining aspect ratio
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {number} containerWidth - Container width
   * @param {number} containerHeight - Container height
   * @param {number} aspectRatio - Desired aspect ratio (width/height)
   * @returns {Object} Canvas setup info
   */
  static resizeCanvas(canvas, containerWidth, containerHeight, aspectRatio = 16/9) {
    let width, height;

    if (containerWidth / containerHeight > aspectRatio) {
      // Container is wider than desired aspect ratio
      height = containerHeight;
      width = height * aspectRatio;
    } else {
      // Container is taller than desired aspect ratio
      width = containerWidth;
      height = width / aspectRatio;
    }

    return this.setupCanvas(canvas, width, height);
  }

  /**
   * Get canvas coordinates from mouse/touch event
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {MouseEvent|TouchEvent} event - Mouse or touch event
   * @returns {Object} Coordinates {x, y}
   */
  static getEventCoordinates(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const dpr = this.getDevicePixelRatio();

    let clientX, clientY;

    if (event.touches && event.touches.length > 0) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Convert screen coordinates to canvas coordinates
    const x = (clientX - rect.left) * (canvas.width / rect.width) / dpr;
    const y = (clientY - rect.top) * (canvas.height / rect.height) / dpr;

    return { x, y };
  }

  /**
   * Check if high-DPI display is detected
   * @returns {boolean} True if high-DPI display
   */
  static isHighDPI() {
    return this.getDevicePixelRatio() > 1;
  }

  /**
   * Get optimal canvas size for performance
   * @param {number} maxWidth - Maximum width
   * @param {number} maxHeight - Maximum height
   * @param {number} particleCount - Number of particles
   * @returns {Object} Optimal dimensions {width, height}
   */
  static getOptimalCanvasSize(maxWidth, maxHeight, particleCount) {
    // Reduce canvas size for very high particle counts to maintain performance
    let scaleFactor = 1;

    if (particleCount > 10000) {
      scaleFactor = 0.5;
    } else if (particleCount > 5000) {
      scaleFactor = 0.75;
    }

    return {
      width: Math.floor(maxWidth * scaleFactor),
      height: Math.floor(maxHeight * scaleFactor)
    };
  }

  /**
   * Setup canvas for export (removes DPI scaling for consistent output)
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {number} width - Export width
   * @param {number} height - Export height
   * @returns {CanvasRenderingContext2D} Canvas context
   */
  static setupCanvasForExport(canvas, width, height) {
    // For export, we want 1:1 pixel mapping
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    return ctx;
  }

  /**
   * Create a scaled copy of canvas for export
   * @param {HTMLCanvasElement} sourceCanvas - Source canvas
   * @param {number} scale - Scale factor
   * @returns {HTMLCanvasElement} Scaled canvas
   */
  static createScaledCanvas(sourceCanvas, scale = 2) {
    const scaledCanvas = document.createElement('canvas');
    const scaledCtx = scaledCanvas.getContext('2d');

    scaledCanvas.width = sourceCanvas.width * scale;
    scaledCanvas.height = sourceCanvas.height * scale;

    scaledCtx.imageSmoothingEnabled = true;
    scaledCtx.imageSmoothingQuality = 'high';
    scaledCtx.drawImage(sourceCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    return scaledCanvas;
  }

  /**
   * Detect if WebGL is supported and would be more performant
   * @returns {boolean} True if WebGL should be preferred
   */
  static shouldUseWebGL() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          // Check if it's a high-end GPU
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          return renderer && (
            renderer.includes('RTX') ||
            renderer.includes('GTX') ||
            renderer.includes('Radeon') ||
            renderer.includes('GeForce')
          );
        }
      }
    } catch (e) {
      // WebGL not supported
    }
    return false;
  }

  /**
   * Get browser and device capabilities
   * @returns {Object} Capabilities object
   */
  static getCapabilities() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return {
      dpr: this.getDevicePixelRatio(),
      webgl: !!canvas.getContext('webgl'),
      webgl2: !!canvas.getContext('webgl2'),
      hardwareAcceleration: this.shouldUseWebGL(),
      maxTextureSize: (() => {
        try {
          const gl = canvas.getContext('webgl');
          return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;
        } catch (e) {
          return 0;
        }
      })(),
      supportsHighDPICanvas: true, // All modern browsers support this
      supportsImageSmoothing: 'imageSmoothingEnabled' in ctx
    };
  }

  /**
   * Optimize canvas settings based on device capabilities
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} particleCount - Number of particles
   */
  static optimizeForPerformance(ctx, particleCount) {
    const capabilities = this.getCapabilities();

    // Adjust image smoothing based on particle count
    if (capabilities.supportsImageSmoothing) {
      ctx.imageSmoothingEnabled = particleCount < 5000;
      ctx.imageSmoothingQuality = particleCount < 1000 ? 'high' : 'medium';
    }

    // Set global composite operation for better performance
    ctx.globalCompositeOperation = 'source-over';

    // Disable shadow for high particle counts
    if (particleCount > 2000) {
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }
}

// Export for use in other modules
window.DPI = DPI;
