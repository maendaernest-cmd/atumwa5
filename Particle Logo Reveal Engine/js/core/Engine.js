/**
 * Engine.js
 * Main particle engine that coordinates all systems
 */

class Engine {
  /**
   * Create a particle engine instance
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} options - Engine options
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      maxParticles: options.maxParticles || 10000,
      targetFPS: options.targetFPS || 60,
      enablePhysics: options.enablePhysics !== false,
      enableInput: options.enableInput !== false,
      enableRendering: options.enableRendering !== false,
      autoStart: options.autoStart !== false,
      debug: options.debug || false,
      ...options
    };

    // Core systems
    this.renderer = null;
    this.physics = null;
    this.input = null;

    // Generators
    this.textGenerator = null;
    this.svgGenerator = null;

    // Particle management
    this.particles = [];
    this.particlePool = [];
    this.activeParticles = 0;

    // Animation state
    this.isRunning = false;
    this.isPaused = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.frameCount = 0;
    this.animationId = null;

    // Performance monitoring
    this.performanceStats = {
      fps: 0,
      frameTime: 0,
      particleCount: 0,
      renderTime: 0,
      physicsTime: 0,
      totalTime: 0
    };

    // Event callbacks
    this.callbacks = {
      onUpdate: null,
      onRender: null,
      onParticleCreated: null,
      onParticleDestroyed: null,
      onPerformanceUpdate: null
    };

    // Initialize systems
    this.initializeSystems();

    // Auto start if requested
    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Initialize all engine systems
   */
  initializeSystems() {
    // Initialize renderer
    if (this.options.enableRendering) {
      this.renderer = new Renderer(this.canvas, {
        clearColor: '#000000',
        showTrail: true,
        showGlow: true
      });
    }

    // Initialize physics
    if (this.options.enablePhysics) {
      this.physics = new Physics({
        gravity: { x: 0, y: 9.8 },
        friction: 0.99,
        bounce: 0.8,
        collisionDetection: true
      });
    }

    // Initialize input
    if (this.options.enableInput) {
      this.input = new Input(this.canvas, {
        attractionRadius: 100,
        attractionStrength: 0.5
      });
    }

    // Initialize generators
    this.textGenerator = new TextGenerator({
      fontSize: 120,
      fontFamily: 'Arial',
      spacing: 2
    });

    this.svgGenerator = new SVGGenerator({
      spacing: 5,
      quality: 1
    });
  }

  /**
   * Start the engine
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();

    this.animate();
  }

  /**
   * Stop the engine
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Pause the engine
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume the engine
   */
  resume() {
    if (this.isRunning) {
      this.isPaused = false;
      this.lastFrameTime = performance.now();
    }
  }

  /**
   * Main animation loop
   */
  animate = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;

    // Limit delta time to prevent large jumps
    this.deltaTime = Math.min(this.deltaTime, 1 / 30); // Max 30 FPS minimum

    if (!this.isPaused) {
      const frameStartTime = performance.now();

      // Update systems
      this.update(this.deltaTime);

      // Render frame
      this.render();

      // Update performance stats
      const frameTime = performance.now() - frameStartTime;
      this.updatePerformanceStats(frameTime);

      this.frameCount++;
    }

    // Schedule next frame
    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Update all systems
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    const updateStartTime = performance.now();

    // Update input
    if (this.input) {
      // Input is event-driven, no update needed
    }

    // Apply input forces to physics
    if (this.physics && this.input) {
      const inputForces = this.input.getForces();
      inputForces.forEach(force => {
        this.physics.addForceField(force);
      });
    }

    // Update physics
    if (this.physics) {
      const physicsStartTime = performance.now();
      this.physics.update(this.particles, deltaTime * 1000, {
        width: this.canvas.width,
        height: this.canvas.height
      });
      this.performanceStats.physicsTime = performance.now() - physicsStartTime;
    }

    // Update particles (additional custom updates)
    this.particles.forEach(particle => {
      if (particle.update && typeof particle.update === 'function') {
        particle.update(deltaTime);
      }
    });

    // Clean up dead particles
    this.cleanupParticles();

    // Call update callback
    if (this.callbacks.onUpdate) {
      this.callbacks.onUpdate(deltaTime, this.particles);
    }

    this.performanceStats.totalTime = performance.now() - updateStartTime;
  }

  /**
   * Render the current frame
   */
  render() {
    if (!this.renderer) return;

    const renderStartTime = performance.now();

    // Clear canvas
    this.renderer.clear();

    // Render particles
    const renderOptions = {
      sortByDepth: this.options.sortParticlesByDepth,
      showTrail: true,
      showGlow: true
    };

    this.renderer.renderParticles(this.particles, renderOptions);

    // Render additional effects
    this.renderEffects();

    // Render debug information
    if (this.options.debug) {
      this.renderDebugInfo();
    }

    // Render performance stats
    if (this.options.showPerformanceStats) {
      this.renderer.renderPerformanceStats({
        particleCount: this.activeParticles
      });
    }

    // Call render callback
    if (this.callbacks.onRender) {
      this.callbacks.onRender(this.renderer.ctx, this.particles);
    }

    this.performanceStats.renderTime = performance.now() - renderStartTime;
  }

  /**
   * Render additional visual effects
   */
  renderEffects() {
    // Add custom effect rendering here
    // This could include particle trails, glow effects, etc.
  }

  /**
   * Render debug information
   */
  renderDebugInfo() {
    const debugInfo = {
      enabled: true,
      particles: this.activeParticles,
      fps: this.performanceStats.fps.toFixed(1),
      frameTime: `${this.performanceStats.totalTime.toFixed(2)}ms`,
      physicsTime: `${this.performanceStats.physicsTime.toFixed(2)}ms`,
      renderTime: `${this.performanceStats.renderTime.toFixed(2)}ms`,
      deltaTime: `${(this.deltaTime * 1000).toFixed(2)}ms`,
      memory: this.getMemoryUsage()
    };

    this.renderer.renderDebugInfo(debugInfo);
  }

  /**
   * Update performance statistics
   * @param {number} frameTime - Time taken for this frame
   */
  updatePerformanceStats(frameTime) {
    // Update FPS calculation
    if (this.frameCount % 60 === 0) { // Update every 60 frames
      this.performanceStats.fps = 1000 / (frameTime || 16.67);
    }

    this.performanceStats.frameTime = frameTime;
    this.performanceStats.particleCount = this.activeParticles;

    // Call performance callback
    if (this.callbacks.onPerformanceUpdate) {
      this.callbacks.onPerformanceUpdate(this.performanceStats);
    }
  }

  /**
   * Get memory usage (if available)
   * @returns {string} Memory usage string
   */
  getMemoryUsage() {
    if (performance.memory) {
      const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
      const total = (performance.memory.totalJSHeapSize / 1048576).toFixed(1);
      return `${used}/${total}MB`;
    }
    return 'N/A';
  }

  /**
   * Create particles from text
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Created particles
   */
  createTextParticles(text, options = {}) {
    if (!this.textGenerator) return [];

    const particleData = this.textGenerator.generate(text, options);
    const particles = this.createParticlesFromData(particleData, options);

    // Center particles on canvas
    this.centerParticles(particles);

    return particles;
  }

  /**
   * Create particles from SVG
   * @param {File|string} svgInput - SVG file or string
   * @param {Object} options - Generation options
   * @returns {Promise<Array>} Promise resolving to created particles
   */
  async createSVGParticles(svgInput, options = {}) {
    if (!this.svgGenerator) return [];

    let particleData;

    if (typeof svgInput === 'string') {
      particleData = this.svgGenerator.generateFromString(svgInput, options);
    } else {
      particleData = await this.svgGenerator.generateFromFile(svgInput, options);
    }

    const particles = this.createParticlesFromData(particleData, options);

    // Center particles on canvas
    this.centerParticles(particles);

    return particles;
  }

  /**
   * Create particles from data array
   * @param {Array} particleData - Array of particle position data
   * @param {Object} options - Particle options
   * @returns {Array} Created particles
   */
  createParticlesFromData(particleData, options = {}) {
    const particles = [];

    particleData.forEach(data => {
      const particle = this.createParticle(data.x, data.y, {
        size: options.size || 3,
        color: options.color || this.getRandomColor(),
        alpha: data.alpha || 1,
        life: options.life,
        mass: options.mass || 1,
        friction: options.friction || 0.99,
        bounce: options.bounce || 0.8,
        glow: options.glow || 0,
        maxTrailLength: options.trailLength || 10,
        userData: {
          originalX: data.originalX || data.x,
          originalY: data.originalY || data.y,
          ...data
        }
      });

      if (particle) {
        particles.push(particle);

        // Call creation callback
        if (this.callbacks.onParticleCreated) {
          this.callbacks.onParticleCreated(particle);
        }
      }
    });

    return particles;
  }

  /**
   * Create a single particle
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} options - Particle options
   * @returns {Particle|null} Created particle or null if limit reached
   */
  createParticle(x, y, options = {}) {
    // Check particle limit
    if (this.activeParticles >= this.options.maxParticles) {
      return null;
    }

    // Get particle from pool or create new one
    let particle = this.particlePool.pop();
    if (!particle) {
      particle = new Particle(x, y, options);
    } else {
      particle.reset(x, y);
      Object.assign(particle, options);
    }

    // Add to active particles
    this.particles.push(particle);
    this.activeParticles++;

    return particle;
  }

  /**
   * Remove a particle
   * @param {Particle} particle - Particle to remove
   */
  removeParticle(particle) {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
      this.particlePool.push(particle);
      this.activeParticles--;

      // Call destruction callback
      if (this.callbacks.onParticleDestroyed) {
        this.callbacks.onParticleDestroyed(particle);
      }
    }
  }

  /**
   * Remove all particles
   */
  removeAllParticles() {
    this.particles.forEach(particle => {
      this.particlePool.push(particle);

      if (this.callbacks.onParticleDestroyed) {
        this.callbacks.onParticleDestroyed(particle);
      }
    });

    this.particles = [];
    this.activeParticles = 0;
  }

  /**
   * Clean up dead particles
   */
  cleanupParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      if (!particle.active) {
        this.removeParticle(particle);
      }
    }
  }

  /**
   * Center particles on canvas
   * @param {Array} particles - Particles to center
   */
  centerParticles(particles) {
    if (particles.length === 0) return;

    // Calculate bounds
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    particles.forEach(particle => {
      minX = Math.min(minX, particle.x);
      minY = Math.min(minY, particle.y);
      maxX = Math.max(maxX, particle.x);
      maxY = Math.max(maxY, particle.y);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const offsetX = centerX - (minX + width / 2);
    const offsetY = centerY - (minY + height / 2);

    // Apply offset to all particles
    particles.forEach(particle => {
      particle.x += offsetX;
      particle.y += offsetY;
      if (particle.userData) {
        particle.userData.originalX += offsetX;
        particle.userData.originalY += offsetY;
      }
    });
  }

  /**
   * Get a random color based on current color mode
   * @returns {string} Random color
   */
  getRandomColor() {
    // This could be enhanced to use the current color mode from UI
    return ColorUtils.randomColor({
      hueRange: [0, 360],
      satRange: [60, 100],
      lightRange: [40, 80]
    });
  }

  /**
   * Apply a preset animation
   * @param {string} presetName - Name of the preset
   * @param {Object} options - Preset options
   */
  applyPreset(presetName, options = {}) {
    switch (presetName) {
      case 'explosion':
        this.applyExplosionPreset(options);
        break;
      case 'rain':
        this.applyRainPreset(options);
        break;
      case 'fireworks':
        this.applyFireworksPreset(options);
        break;
      case 'galaxy':
        this.applyGalaxyPreset(options);
        break;
      case 'wave':
        this.applyWavePreset(options);
        break;
      case 'spiral':
        this.applySpiralPreset(options);
        break;
    }
  }

  /**
   * Apply explosion preset
   * @param {Object} options - Explosion options
   */
  applyExplosionPreset(options) {
    if (!this.physics) return;

    // Remove existing forces
    this.physics.clearForceFields();

    // Add explosion forces from center
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Radial explosion force
    this.physics.addForceField({
      x: centerX,
      y: centerY,
      type: 'repulsion',
      strength: options.strength || 500,
      radius: Math.max(this.canvas.width, this.canvas.height) / 2
    });

    // Add some chaos
    this.physics.addForceField({
      x: centerX,
      y: centerY,
      type: 'noise',
      strength: options.chaos || 10,
      radius: Math.max(this.canvas.width, this.canvas.height)
    });
  }

  /**
   * Apply rain preset
   * @param {Object} options - Rain options
   */
  applyRainPreset(options) {
    if (!this.physics) return;

    this.physics.clearForceFields();
    this.physics.setParameters({
      gravity: { x: options.wind || 0, y: options.gravity || 9.8 },
      wind: { x: options.windStrength || 0, y: 0 }
    });
  }

  /**
   * Apply fireworks preset
   * @param {Object} options - Fireworks options
   */
  applyFireworksPreset(options) {
    if (!this.physics) return;

    this.physics.clearForceFields();
    this.physics.setParameters({
      gravity: { x: 0, y: options.gravity || 9.8 }
    });
  }

  /**
   * Apply galaxy preset
   * @param {Object} options - Galaxy options
   */
  applyGalaxyPreset(options) {
    if (!this.physics) return;

    this.physics.clearForceFields();

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Orbital attraction
    this.physics.addForceField({
      x: centerX,
      y: centerY,
      type: 'attraction',
      strength: options.attraction || 50,
      radius: Math.max(this.canvas.width, this.canvas.height) / 2
    });

    // Add some rotation
    this.physics.addForceField({
      x: centerX,
      y: centerY,
      type: 'vortex',
      strength: options.rotation || 20,
      radius: Math.max(this.canvas.width, this.canvas.height) / 2
    });
  }

  /**
   * Apply wave preset
   * @param {Object} options - Wave options
   */
  applyWavePreset(options) {
    // Wave animations are handled in particle generation
    // Could add wave-based forces here
  }

  /**
   * Apply spiral preset
   * @param {Object} options - Spiral options
   */
  applySpiralPreset(options) {
    if (!this.physics) return;

    this.physics.clearForceFields();

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Spiral forces
    this.physics.addForceField({
      x: centerX,
      y: centerY,
      type: 'vortex',
      strength: options.strength || 30,
      radius: Math.max(this.canvas.width, this.canvas.height) / 2
    });

    this.physics.addForceField({
      x: centerX,
      y: centerY,
      type: 'attraction',
      strength: options.attraction || 10,
      radius: Math.max(this.canvas.width, this.canvas.height) / 2
    });
  }

  /**
   * Export current animation as GIF
   * @param {Object} options - Export options
   * @returns {Promise<string>} Promise resolving to GIF data URL
   */
  async exportAsGIF(options = {}) {
    // This would require a GIF encoding library
    // For now, return a screenshot
    return this.renderer ? this.renderer.screenshot('png') : '';
  }

  /**
   * Resize canvas and update systems
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    if (this.renderer) {
      this.renderer.resize(width, height);
    }

    // Update canvas size in other systems if needed
  }

  /**
   * Set engine parameters
   * @param {Object} params - Engine parameters
   */
  setParameters(params) {
    if (params.maxParticles !== undefined) this.options.maxParticles = params.maxParticles;
    if (params.targetFPS !== undefined) this.options.targetFPS = params.targetFPS;

    // Update subsystems
    if (this.physics && params.physics) {
      this.physics.setParameters(params.physics);
    }

    if (this.renderer && params.rendering) {
      this.renderer.setQuality(params.rendering.quality);
      this.renderer.options.showGlow = params.rendering.showGlow;
      this.renderer.options.showTrail = params.rendering.showTrail;
    }
  }

  /**
   * Get current engine state
   * @returns {Object} Engine state
   */
  getState() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      particleCount: this.activeParticles,
      maxParticles: this.options.maxParticles,
      performance: { ...this.performanceStats },
      physics: this.physics ? this.physics.getState() : null,
      renderer: this.renderer ? this.renderer.getStats() : null
    };
  }

  /**
   * Add event callback
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
  }

  /**
   * Remove event callback
   * @param {string} event - Event name
   */
  off(event) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = null;
    }
  }

  /**
   * Destroy engine and clean up resources
   */
  destroy() {
    this.stop();
    this.removeAllParticles();

    if (this.renderer) {
      this.renderer.destroy();
    }

    if (this.input) {
      this.input.destroy();
    }

    // Clear callbacks
    Object.keys(this.callbacks).forEach(key => {
      this.callbacks[key] = null;
    });
  }
}

// Export for use in other modules
window.Engine = Engine;
