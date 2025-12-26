/**
 * TextGenerator.js
 * Converts text to particle positions using canvas text rendering
 */

class TextGenerator {
  /**
   * Create a text generator instance
   * @param {Object} options - Text generation options
   */
  constructor(options = {}) {
    this.fontSize = options.fontSize || 120;
    this.fontFamily = options.fontFamily || 'Arial';
    this.fontWeight = options.fontWeight || 'bold';
    this.spacing = options.spacing || 1;
    this.quality = options.quality || 1; // 1 = high quality, higher = more particles
  }

  /**
   * Generate particles from text
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle position objects
   */
  generate(text, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Configure canvas size based on text
    const fontSize = options.fontSize || this.fontSize;
    const fontFamily = options.fontFamily || this.fontFamily;
    const fontWeight = options.fontWeight || this.fontWeight;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);

    // Set canvas size with padding
    const padding = fontSize * 0.5;
    canvas.width = metrics.width + padding * 2;
    canvas.height = fontSize * 1.5 + padding * 2;

    // Clear and setup context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Draw text
    ctx.fillText(text, padding, padding);

    // Extract particle positions from text outline
    return this.extractParticlesFromCanvas(canvas, ctx, options);
  }

  /**
   * Extract particle positions from canvas text rendering
   * @param {HTMLCanvasElement} canvas - Canvas with rendered text
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractParticlesFromCanvas(canvas, ctx, options) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const particles = [];

    const spacing = options.spacing || this.spacing;
    const quality = options.quality || this.quality;

    // Sample pixels based on quality and spacing
    for (let y = 0; y < canvas.height; y += spacing) {
      for (let x = 0; x < canvas.width; x += spacing) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3]; // Alpha channel

        // If pixel is not transparent, create particle
        if (alpha > 128) { // Semi-transparent threshold
          // For higher quality, add multiple particles per pixel
          if (quality > 1) {
            for (let q = 0; q < quality; q++) {
              const offsetX = MathUtils.random(-spacing/2, spacing/2);
              const offsetY = MathUtils.random(-spacing/2, spacing/2);

              particles.push({
                x: x + offsetX,
                y: y + offsetY,
                alpha: alpha / 255,
                originalX: x,
                originalY: y
              });
            }
          } else {
            particles.push({
              x: x,
              y: y,
              alpha: alpha / 255,
              originalX: x,
              originalY: y
            });
          }
        }
      }
    }

    return particles;
  }

  /**
   * Generate particles along text outline (more advanced method)
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions
   */
  generateOutline(text, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const fontSize = options.fontSize || this.fontSize;
    const fontFamily = options.fontFamily || this.fontFamily;
    const fontWeight = options.fontWeight || this.fontWeight;

    // Setup font
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);

    // Set canvas size
    const padding = fontSize * 0.5;
    canvas.width = metrics.width + padding * 2;
    canvas.height = fontSize * 1.5 + padding * 2;

    // Draw text with stroke for outline effect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(2, fontSize / 20);
    ctx.strokeText(text, padding, padding);

    // Extract particles from stroke
    return this.extractParticlesFromCanvas(canvas, ctx, {
      ...options,
      spacing: Math.max(1, options.spacing || this.spacing)
    });
  }

  /**
   * Generate particles with gradient density based on text darkness
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions with density
   */
  generateWithDensity(text, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const fontSize = options.fontSize || this.fontSize;
    const fontFamily = options.fontFamily || this.fontFamily;
    const fontWeight = options.fontWeight || this.fontWeight;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);

    const padding = fontSize * 0.5;
    canvas.width = metrics.width + padding * 2;
    canvas.height = fontSize * 1.5 + padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = '#000000';
    ctx.fillText(text, padding, padding);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const particles = [];

    const spacing = options.spacing || this.spacing;

    for (let y = 0; y < canvas.height; y += spacing) {
      for (let x = 0; x < canvas.width; x += spacing) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 50) { // Lower threshold for density
          // Create particles based on darkness (more particles for darker areas)
          const density = Math.floor((alpha / 255) * 5) + 1; // 1-6 particles based on darkness

          for (let i = 0; i < density; i++) {
            particles.push({
              x: x + MathUtils.random(-spacing/2, spacing/2),
              y: y + MathUtils.random(-spacing/2, spacing/2),
              alpha: alpha / 255,
              density: density,
              originalX: x,
              originalY: y
            });
          }
        }
      }
    }

    return particles;
  }

  /**
   * Generate particles in a wave pattern for animated reveals
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions with wave data
   */
  generateWave(text, options = {}) {
    const particles = this.generate(text, options);

    // Add wave animation data
    particles.forEach((particle, index) => {
      particle.waveOffset = MathUtils.random(0, Math.PI * 2);
      particle.waveSpeed = options.waveSpeed || 2;
      particle.waveAmplitude = options.waveAmplitude || 20;
      particle.delay = index * (options.delay || 0.01);
    });

    return particles;
  }

  /**
   * Generate particles in a spiral pattern
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions with spiral data
   */
  generateSpiral(text, options = {}) {
    const particles = this.generate(text, options);
    const centerX = options.centerX || particles.reduce((sum, p) => sum + p.x, 0) / particles.length;
    const centerY = options.centerY || particles.reduce((sum, p) => sum + p.y, 0) / particles.length;

    particles.forEach((particle, index) => {
      const angle = MathUtils.angle(centerX, centerY, particle.x, particle.y);
      const distance = MathUtils.distance(centerX, centerY, particle.x, particle.y);

      particle.spiralAngle = angle;
      particle.spiralDistance = distance;
      particle.spiralSpeed = options.spiralSpeed || 1;
      particle.delay = index * (options.delay || 0.005);
    });

    return particles;
  }

  /**
   * Generate particles with explosion animation data
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions with explosion data
   */
  generateExplosion(text, options = {}) {
    const particles = this.generate(text, options);
    const centerX = options.centerX || particles.reduce((sum, p) => sum + p.x, 0) / particles.length;
    const centerY = options.centerY || particles.reduce((sum, p) => sum + p.y, 0) / particles.length;

    particles.forEach((particle, index) => {
      const angle = MathUtils.angle(centerX, centerY, particle.x, particle.y);
      const distance = MathUtils.distance(centerX, centerY, particle.x, particle.y);

      particle.explosionAngle = angle;
      particle.explosionDistance = distance;
      particle.explosionSpeed = MathUtils.random(100, 300);
      particle.delay = MathUtils.random(0, options.delay || 0.5);
    });

    return particles;
  }

  /**
   * Generate particles with firework animation data
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions with firework data
   */
  generateFireworks(text, options = {}) {
    const particles = this.generate(text, options);

    particles.forEach((particle, index) => {
      particle.fireworkGroup = Math.floor(index / 20); // Group particles into fireworks
      particle.launchDelay = particle.fireworkGroup * 0.5;
      particle.explosionDelay = particle.launchDelay + 1.5;
      particle.gravity = 9.8;
      particle.trail = [];
    });

    return particles;
  }

  /**
   * Generate particles with galaxy/spiral animation data
   * @param {string} text - Text to convert
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions with galaxy data
   */
  generateGalaxy(text, options = {}) {
    const particles = this.generate(text, options);
    const centerX = options.centerX || particles.reduce((sum, p) => sum + p.x, 0) / particles.length;
    const centerY = options.centerY || particles.reduce((sum, p) => sum + p.y, 0) / particles.length;

    particles.forEach((particle, index) => {
      const angle = MathUtils.angle(centerX, centerY, particle.x, particle.y);
      const distance = MathUtils.distance(centerX, centerY, particle.x, particle.y);

      particle.galaxyAngle = angle;
      particle.galaxyDistance = distance;
      particle.orbitSpeed = options.orbitSpeed || 0.5;
      particle.verticalOscillation = Math.sin(angle * 3) * (options.oscillation || 20);
      particle.delay = (distance / 200) * 2; // Delay based on distance from center
    });

    return particles;
  }

  /**
   * Create particles with custom positioning logic
   * @param {string} text - Text to convert
   * @param {Function} positionFunction - Custom positioning function
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions
   */
  generateCustom(text, positionFunction, options = {}) {
    const baseParticles = this.generate(text, options);

    return baseParticles.map(particle => {
      const customPosition = positionFunction(particle, options);
      return {
        ...particle,
        ...customPosition
      };
    });
  }

  /**
   * Optimize particle count by merging nearby particles
   * @param {Array} particles - Raw particle array
   * @param {number} mergeDistance - Distance threshold for merging
   * @returns {Array} Optimized particle array
   */
  optimizeParticles(particles, mergeDistance = 3) {
    const optimized = [];
    const used = new Set();

    for (let i = 0; i < particles.length; i++) {
      if (used.has(i)) continue;

      const current = particles[i];
      let mergedCount = 1;
      let totalX = current.x;
      let totalY = current.y;
      let totalAlpha = current.alpha;

      // Find nearby particles to merge
      for (let j = i + 1; j < particles.length; j++) {
        if (used.has(j)) continue;

        const other = particles[j];
        const distance = MathUtils.distance(current.x, current.y, other.x, other.y);

        if (distance <= mergeDistance) {
          totalX += other.x;
          totalY += other.y;
          totalAlpha += other.alpha;
          mergedCount++;
          used.add(j);
        }
      }

      // Create merged particle
      optimized.push({
        ...current,
        x: totalX / mergedCount,
        y: totalY / mergedCount,
        alpha: totalAlpha / mergedCount,
        size: Math.sqrt(mergedCount) * (current.size || 3) // Larger size for merged particles
      });

      used.add(i);
    }

    return optimized;
  }

  /**
   * Get text metrics without generating particles
   * @param {string} text - Text to measure
   * @param {Object} options - Font options
   * @returns {Object} Text metrics
   */
  getTextMetrics(text, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const fontSize = options.fontSize || this.fontSize;
    const fontFamily = options.fontFamily || this.fontFamily;
    const fontWeight = options.fontWeight || this.fontWeight;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);

    return {
      width: metrics.width,
      height: fontSize * 1.2, // Approximate height
      actualBoundingBoxAscent: metrics.actualBoundingBoxAscent || fontSize * 0.8,
      actualBoundingBoxDescent: metrics.actualBoundingBoxDescent || fontSize * 0.2,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight
    };
  }

  /**
   * Update generator settings
   * @param {Object} settings - New settings
   */
  updateSettings(settings) {
    if (settings.fontSize !== undefined) this.fontSize = settings.fontSize;
    if (settings.fontFamily !== undefined) this.fontFamily = settings.fontFamily;
    if (settings.fontWeight !== undefined) this.fontWeight = settings.fontWeight;
    if (settings.spacing !== undefined) this.spacing = settings.spacing;
    if (settings.quality !== undefined) this.quality = settings.quality;
  }
}

// Export for use in other modules
window.TextGenerator = TextGenerator;
