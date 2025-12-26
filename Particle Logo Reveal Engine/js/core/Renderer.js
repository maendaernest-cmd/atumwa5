/**
 * Renderer.js
 * High-performance canvas renderer for particles and effects
 */

class Renderer {
  /**
   * Create a renderer instance
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} options - Rendering options
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = {
      clearColor: options.clearColor || '#000000',
      showTrail: options.showTrail !== false,
      showGlow: options.showGlow !== false,
      particleBlending: options.particleBlending || 'source-over',
      backgroundBlending: options.backgroundBlending || 'source-over',
      enableShadows: options.enableShadows !== false,
      antialiasing: options.antialiasing !== false,
      ...options
    };

    // Performance tracking
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.renderTime = 0;

    // Rendering buffers for advanced effects
    this.backBuffer = null;
    this.createBackBuffer();

    // Initialize canvas settings
    this.setupCanvas();
  }

  /**
   * Setup canvas rendering settings
   */
  setupCanvas() {
    const ctx = this.ctx;

    // Set global composite operation
    ctx.globalCompositeOperation = this.options.particleBlending;

    // Enable/disable image smoothing
    ctx.imageSmoothingEnabled = this.options.antialiasing;

    // Set image smoothing quality
    if (ctx.imageSmoothingEnabled) {
      ctx.imageSmoothingQuality = 'high';
    }

    // Set font for text rendering
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  /**
   * Create back buffer for advanced rendering techniques
   */
  createBackBuffer() {
    this.backBuffer = document.createElement('canvas');
    this.backBuffer.width = this.canvas.width;
    this.backBuffer.height = this.canvas.height;
    this.backBufferCtx = this.backBuffer.getContext('2d');
  }

  /**
   * Update back buffer size when canvas resizes
   */
  updateBackBufferSize() {
    if (this.backBuffer) {
      this.backBuffer.width = this.canvas.width;
      this.backBuffer.height = this.canvas.height;
    }
  }

  /**
   * Clear the canvas
   */
  clear() {
    const ctx = this.ctx;

    // Save current composite operation
    const currentComposite = ctx.globalCompositeOperation;

    // Set background blending mode
    ctx.globalCompositeOperation = this.options.backgroundBlending;

    // Clear with background color
    if (this.options.clearColor === 'transparent') {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      ctx.fillStyle = this.options.clearColor;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Restore composite operation
    ctx.globalCompositeOperation = currentComposite;
  }

  /**
   * Render particles with high performance
   * @param {Array} particles - Array of particle objects
   * @param {Object} options - Rendering options
   */
  renderParticles(particles, options = {}) {
    const startTime = performance.now();
    const ctx = this.ctx;

    // Sort particles by depth (alpha) for better blending
    if (options.sortByDepth) {
      particles.sort((a, b) => a.alpha - b.alpha);
    }

    // Group particles by render style for batching
    const renderGroups = this.groupParticlesByStyle(particles);

    // Render each group
    Object.keys(renderGroups).forEach(groupKey => {
      const group = renderGroups[groupKey];
      this.renderParticleGroup(group, options);
    });

    // Update performance metrics
    this.renderTime = performance.now() - startTime;
    this.updatePerformanceMetrics();
  }

  /**
   * Group particles by rendering style for optimization
   * @param {Array} particles - Array of particles
   * @returns {Object} Grouped particles
   */
  groupParticlesByStyle(particles) {
    const groups = {};

    particles.forEach(particle => {
      if (!particle.visible || particle.alpha <= 0) return;

      // Create group key based on rendering properties
      const key = `${particle.color}_${particle.glow || 0}_${particle.size}`;

      if (!groups[key]) {
        groups[key] = {
          color: particle.color,
          glow: particle.glow,
          size: particle.size,
          particles: []
        };
      }

      groups[key].particles.push(particle);
    });

    return groups;
  }

  /**
   * Render a group of particles with the same style
   * @param {Object} group - Particle group
   * @param {Object} options - Rendering options
   */
  renderParticleGroup(group, options) {
    const ctx = this.ctx;
    const { particles, color, glow, size } = group;

    // Set common properties for the group
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    // Set glow effect
    if (glow > 0 && this.options.showGlow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = glow;
    } else {
      ctx.shadowBlur = 0;
    }

    // Batch render particles
    particles.forEach(particle => {
      this.renderSingleParticle(particle, options);
    });

    // Clear shadow after group
    if (glow > 0) {
      ctx.shadowBlur = 0;
    }
  }

  /**
   * Render a single particle
   * @param {Particle} particle - Particle to render
   * @param {Object} options - Rendering options
   */
  renderSingleParticle(particle, options) {
    const ctx = this.ctx;

    // Skip invisible particles
    if (!particle.visible || particle.alpha <= 0) return;

    ctx.save();

    // Set global alpha
    ctx.globalAlpha = particle.alpha;

    // Transform context for particle
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.scale(particle.scale, particle.scale);

    // Render trail if enabled
    if (this.options.showTrail && particle.trail && particle.trail.length > 0) {
      this.renderParticleTrail(particle, options);
    }

    // Render particle based on size and style
    this.renderParticleShape(particle, options);

    ctx.restore();
  }

  /**
   * Render particle trail
   * @param {Particle} particle - Particle with trail
   * @param {Object} options - Rendering options
   */
  renderParticleTrail(particle, options) {
    const ctx = this.ctx;

    ctx.save();

    particle.trail.forEach((point, index) => {
      const trailAlpha = point.alpha * 0.3;
      const trailSize = particle.size * (index / particle.trail.length) * 0.5;

      ctx.globalAlpha = trailAlpha;
      ctx.beginPath();
      ctx.arc(point.x - particle.x, point.y - particle.y, trailSize, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /**
   * Render particle shape based on properties
   * @param {Particle} particle - Particle to render
   * @param {Object} options - Rendering options
   */
  renderParticleShape(particle, options) {
    const ctx = this.ctx;
    const size = particle.size;

    // Choose rendering method based on particle properties
    if (size < 2) {
      // Tiny particles - use single pixels for performance
      this.renderPixel(particle);
    } else if (particle.glow > 5) {
      // Glowing particles - use radial gradient
      this.renderGlowingParticle(particle);
    } else {
      // Standard particles - use circles
      this.renderCircleParticle(particle);
    }
  }

  /**
   * Render particle as a single pixel
   * @param {Particle} particle - Particle to render
   */
  renderPixel(particle) {
    const ctx = this.ctx;
    ctx.fillRect(-0.5, -0.5, 1, 1);
  }

  /**
   * Render particle as a circle
   * @param {Particle} particle - Particle to render
   */
  renderCircleParticle(particle) {
    const ctx = this.ctx;
    const size = particle.size;

    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render particle with glow effect
   * @param {Particle} particle - Particle to render
   */
  renderGlowingParticle(particle) {
    const ctx = this.ctx;
    const size = particle.size;
    const glow = particle.glow;

    // Create radial gradient for glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size + glow);
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(0.7, particle.color);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size + glow, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render background effects
   * @param {Object} options - Background options
   */
  renderBackground(options = {}) {
    const ctx = this.ctx;

    if (options.gradient) {
      this.renderGradientBackground(options.gradient);
    }

    if (options.particles) {
      this.renderBackgroundParticles(options.particles);
    }
  }

  /**
   * Render gradient background
   * @param {Object} gradientOptions - Gradient configuration
   */
  renderGradientBackground(gradientOptions) {
    const ctx = this.ctx;
    const { type, colors, angle } = gradientOptions;

    let gradient;

    if (type === 'linear') {
      const radians = (angle || 0) * Math.PI / 180;
      const x1 = Math.cos(radians) * this.canvas.width;
      const y1 = Math.sin(radians) * this.canvas.height;
      const x2 = Math.cos(radians + Math.PI) * this.canvas.width;
      const y2 = Math.sin(radians + Math.PI) * this.canvas.height;

      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    } else {
      // Radial gradient
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const radius = Math.max(this.canvas.width, this.canvas.height) / 2;

      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    }

    // Add color stops
    colors.forEach(([position, color]) => {
      gradient.addColorStop(position, color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render background particles (subtle effects)
   * @param {Array} particles - Background particles
   */
  renderBackgroundParticles(particles) {
    const ctx = this.ctx;

    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /**
   * Render text overlay
   * @param {string} text - Text to render
   * @param {Object} options - Text rendering options
   */
  renderText(text, options = {}) {
    const ctx = this.ctx;

    ctx.save();

    // Set text properties
    ctx.font = options.font || '16px Arial';
    ctx.fillStyle = options.color || '#ffffff';
    ctx.strokeStyle = options.strokeColor || '#000000';
    ctx.lineWidth = options.strokeWidth || 0;
    ctx.textAlign = options.align || 'left';
    ctx.textBaseline = options.baseline || 'top';
    ctx.globalAlpha = options.alpha || 1;

    // Position
    const x = options.x || 0;
    const y = options.y || 0;

    // Render stroke first (if specified)
    if (options.strokeWidth > 0) {
      ctx.strokeText(text, x, y);
    }

    // Render fill
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  /**
   * Render debug information
   * @param {Object} debugInfo - Debug information
   */
  renderDebugInfo(debugInfo) {
    if (!debugInfo.enabled) return;

    const ctx = this.ctx;
    const lineHeight = 20;
    let y = 30;

    ctx.save();
    ctx.font = '12px monospace';
    ctx.fillStyle = '#00ff00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    Object.entries(debugInfo).forEach(([key, value]) => {
      if (key === 'enabled') return;

      const text = `${key}: ${value}`;
      ctx.strokeText(text, 10, y);
      ctx.fillText(text, 10, y);
      y += lineHeight;
    });

    ctx.restore();
  }

  /**
   * Render performance statistics
   * @param {Object} stats - Performance statistics
   */
  renderPerformanceStats(stats) {
    const ctx = this.ctx;

    ctx.save();
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffff00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    let y = this.canvas.height - 60;

    // Render FPS
    const fps = this.fps.toFixed(1);
    const fpsColor = this.fps > 50 ? '#00ff00' : this.fps > 30 ? '#ffff00' : '#ff0000';
    ctx.fillStyle = fpsColor;
    ctx.strokeText(`FPS: ${fps}`, 10, y);
    ctx.fillText(`FPS: ${fps}`, 10, y);
    y += 15;

    // Render particle count
    ctx.fillStyle = '#00ffff';
    const particleCount = stats.particleCount || 0;
    ctx.strokeText(`Particles: ${particleCount}`, 10, y);
    ctx.fillText(`Particles: ${particleCount}`, 10, y);
    y += 15;

    // Render render time
    ctx.fillStyle = '#ff00ff';
    const renderTime = this.renderTime.toFixed(2);
    ctx.strokeText(`Render: ${renderTime}ms`, 10, y);
    ctx.fillText(`Render: ${renderTime}ms`, 10, y);

    ctx.restore();
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics() {
    this.frameCount++;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) {
      this.fps = (this.frameCount * 1000) / deltaTime;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  /**
   * Get current FPS
   * @returns {number} Current FPS
   */
  getFPS() {
    return this.fps;
  }

  /**
   * Get render time for last frame
   * @returns {number} Render time in milliseconds
   */
  getRenderTime() {
    return this.renderTime;
  }

  /**
   * Resize canvas and update rendering context
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.updateBackBufferSize();
    this.setupCanvas();
  }

  /**
   * Take screenshot of current canvas
   * @param {string} format - Image format ('png', 'jpg', 'webp')
   * @param {number} quality - Image quality (0-1)
   * @returns {string} Data URL of the image
   */
  screenshot(format = 'png', quality = 1) {
    return this.canvas.toDataURL(`image/${format}`, quality);
  }

  /**
   * Export canvas as blob
   * @param {string} format - Image format
   * @param {number} quality - Image quality
   * @returns {Promise<Blob>} Image blob
   */
  exportAsBlob(format = 'png', quality = 1) {
    return new Promise((resolve) => {
      this.canvas.toBlob(resolve, `image/${format}`, quality);
    });
  }

  /**
   * Enable/disable high DPI rendering
   * @param {boolean} enabled - Whether to enable high DPI
   */
  setHighDPI(enabled) {
    const dpr = enabled ? (window.devicePixelRatio || 1) : 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);
    this.updateBackBufferSize();
  }

  /**
   * Set rendering quality
   * @param {string} quality - Quality level ('low', 'medium', 'high')
   */
  setQuality(quality) {
    switch (quality) {
      case 'low':
        this.ctx.imageSmoothingEnabled = false;
        this.options.showGlow = false;
        this.options.showTrail = false;
        break;
      case 'medium':
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'medium';
        this.options.showGlow = true;
        this.options.showTrail = false;
        break;
      case 'high':
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.options.showGlow = true;
        this.options.showTrail = true;
        break;
    }
  }

  /**
   * Get rendering statistics
   * @returns {Object} Render statistics
   */
  getStats() {
    return {
      fps: this.fps,
      renderTime: this.renderTime,
      canvasSize: {
        width: this.canvas.width,
        height: this.canvas.height
      },
      pixelCount: this.canvas.width * this.canvas.height,
      dpr: window.devicePixelRatio || 1
    };
  }

  /**
   * Destroy renderer and clean up resources
   */
  destroy() {
    // Clear canvas
    this.clear();

    // Clear back buffer
    if (this.backBuffer) {
      this.backBuffer.width = 1;
      this.backBuffer.height = 1;
      this.backBuffer = null;
      this.backBufferCtx = null;
    }

    // Reset performance tracking
    this.frameCount = 0;
    this.renderTime = 0;
  }
}

// Export for use in other modules
window.Renderer = Renderer;
