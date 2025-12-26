/**
 * Particle.js
 * Individual particle object with physics and rendering
 */

class Particle {
  /**
   * Create a new particle
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {Object} options - Particle options
   */
  constructor(x, y, options = {}) {
    // Position
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;

    // Velocity
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;

    // Acceleration
    this.ax = 0;
    this.ay = 0;

    // Appearance
    this.size = options.size || 3;
    this.color = options.color || '#ffffff';
    this.alpha = options.alpha || 1;
    this.glow = options.glow || 0;

    // Physics properties
    this.mass = options.mass || 1;
    this.friction = options.friction || 0.99;
    this.bounce = options.bounce || 0.8;

    // Life cycle
    this.life = options.life || 1;
    this.maxLife = options.maxLife || 1;
    this.decay = options.decay || 0;

    // Trail effect
    this.trail = options.trail || [];
    this.maxTrailLength = options.maxTrailLength || 10;

    // Interaction properties
    this.interactive = options.interactive !== false;
    this.attractionRadius = options.attractionRadius || 50;
    this.attractionStrength = options.attractionStrength || 0.1;

    // Animation properties
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0;
    this.scale = options.scale || 1;
    this.scaleSpeed = options.scaleSpeed || 0;

    // Custom properties
    this.userData = options.userData || {};

    // State
    this.active = true;
    this.visible = true;
  }

  /**
   * Update particle physics and animation
   * @param {number} deltaTime - Time since last update
   * @param {Object} bounds - Canvas bounds {width, height}
   * @param {Array} forces - Array of force objects to apply
   */
  update(deltaTime, bounds, forces = []) {
    if (!this.active) return;

    // Store previous position for trail
    this.prevX = this.x;
    this.prevY = this.y;

    // Apply forces
    forces.forEach(force => {
      this.applyForce(force);
    });

    // Apply physics
    this.updatePhysics(deltaTime);

    // Handle boundaries
    this.handleBoundaries(bounds);

    // Update trail
    this.updateTrail();

    // Update animation
    this.updateAnimation(deltaTime);

    // Update life cycle
    this.updateLifeCycle(deltaTime);

    // Update appearance
    this.updateAppearance(deltaTime);
  }

  /**
   * Apply a force to the particle
   * @param {Object} force - Force object {x, y, type, strength, radius}
   */
  applyForce(force) {
    const dx = force.x - this.x;
    const dy = force.y - this.y;
    const distance = MathUtils.magnitude(dx, dy);

    if (distance === 0) return;

    let forceX = 0;
    let forceY = 0;

    switch (force.type) {
      case 'gravity':
        forceX = 0;
        forceY = force.strength;
        break;

      case 'wind':
        forceX = force.strength;
        forceY = 0;
        break;

      case 'attraction':
        if (distance < force.radius) {
          const normalized = MathUtils.normalize(dx, dy);
          const strength = force.strength * (1 - distance / force.radius);
          forceX = normalized.x * strength;
          forceY = normalized.y * strength;
        }
        break;

      case 'repulsion':
        if (distance < force.radius) {
          const normalized = MathUtils.normalize(dx, dy);
          const strength = force.strength * (1 - distance / force.radius);
          forceX = -normalized.x * strength;
          forceY = -normalized.y * strength;
        }
        break;

      case 'vortex':
        if (distance < force.radius) {
          const angle = MathUtils.angle(0, 0, dx, dy);
          const strength = force.strength * (1 - distance / force.radius);
          forceX = Math.cos(angle + Math.PI / 2) * strength;
          forceY = Math.sin(angle + Math.PI / 2) * strength;
        }
        break;

      case 'noise':
        const noiseX = MathUtils.noise(this.x * 0.01, this.y * 0.01) * force.strength;
        const noiseY = MathUtils.noise(this.x * 0.01 + 100, this.y * 0.01 + 100) * force.strength;
        forceX = noiseX;
        forceY = noiseY;
        break;
    }

    // Apply force to acceleration
    this.ax += forceX / this.mass;
    this.ay += forceY / this.mass;
  }

  /**
   * Update particle physics
   * @param {number} deltaTime - Time since last update
   */
  updatePhysics(deltaTime) {
    // Update velocity with acceleration
    this.vx += this.ax * deltaTime;
    this.vy += this.ay * deltaTime;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Update position with velocity
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Reset acceleration
    this.ax = 0;
    this.ay = 0;
  }

  /**
   * Handle boundary collisions
   * @param {Object} bounds - Canvas bounds {width, height}
   */
  handleBoundaries(bounds) {
    // Left and right boundaries
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -this.bounce;
    } else if (this.x > bounds.width) {
      this.x = bounds.width;
      this.vx *= -this.bounce;
    }

    // Top and bottom boundaries
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -this.bounce;
    } else if (this.y > bounds.height) {
      this.y = bounds.height;
      this.vy *= -this.bounce;
    }
  }

  /**
   * Update particle trail
   */
  updateTrail() {
    if (this.maxTrailLength > 0) {
      this.trail.push({ x: this.prevX, y: this.prevY, alpha: this.alpha });

      // Limit trail length
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }

      // Fade trail points
      this.trail.forEach((point, index) => {
        point.alpha = (index / this.trail.length) * this.alpha * 0.5;
      });
    }
  }

  /**
   * Update particle animation
   * @param {number} deltaTime - Time since last update
   */
  updateAnimation(deltaTime) {
    // Update rotation
    this.rotation += this.rotationSpeed * deltaTime;

    // Update scale
    this.scale += this.scaleSpeed * deltaTime;
    this.scale = MathUtils.clamp(this.scale, 0.1, 5);
  }

  /**
   * Update particle life cycle
   * @param {number} deltaTime - Time since last update
   */
  updateLifeCycle(deltaTime) {
    if (this.decay > 0) {
      this.life -= this.decay * deltaTime;
      if (this.life <= 0) {
        this.active = false;
      }
    }
  }

  /**
   * Update particle appearance
   * @param {number} deltaTime - Time since last update
   */
  updateAppearance(deltaTime) {
    // Update alpha based on life
    if (this.maxLife > 0) {
      this.alpha = this.life / this.maxLife;
    }

    // Update size based on life or scale
    this.size *= this.scale;
  }

  /**
   * Render the particle
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} options - Rendering options
   */
  render(ctx, options = {}) {
    if (!this.visible || !this.active || this.alpha <= 0) return;

    ctx.save();

    // Set global alpha
    ctx.globalAlpha = this.alpha;

    // Apply glow effect
    if (this.glow > 0) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.glow;
    }

    // Transform context for rotation and scaling
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    // Render trail
    if (options.showTrail && this.trail.length > 0) {
      this.renderTrail(ctx, options);
    }

    // Render particle
    this.renderParticle(ctx, options);

    ctx.restore();
  }

  /**
   * Render particle trail
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} options - Rendering options
   */
  renderTrail(ctx, options) {
    ctx.save();

    this.trail.forEach((point, index) => {
      const trailAlpha = point.alpha * 0.5;
      const trailSize = this.size * (index / this.trail.length) * 0.5;

      ctx.globalAlpha = trailAlpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(point.x - this.x, point.y - this.y, trailSize, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /**
   * Render the particle itself
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} options - Rendering options
   */
  renderParticle(ctx, options) {
    // Default circular particle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Add inner glow for better visibility
    if (this.glow > 0) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      gradient.addColorStop(0, ColorUtils.adjustBrightness(this.color, 0.5));
      gradient.addColorStop(1, this.color);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Check if particle is near a point
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Check radius
   * @returns {boolean} True if near point
   */
  isNear(x, y, radius = this.attractionRadius) {
    return MathUtils.distance(this.x, this.y, x, y) <= radius;
  }

  /**
   * Get particle bounds
   * @returns {Object} Bounds {x, y, width, height}
   */
  getBounds() {
    return {
      x: this.x - this.size,
      y: this.y - this.size,
      width: this.size * 2,
      height: this.size * 2
    };
  }

  /**
   * Clone the particle
   * @returns {Particle} Cloned particle
   */
  clone() {
    return new Particle(this.x, this.y, {
      vx: this.vx,
      vy: this.vy,
      size: this.size,
      color: this.color,
      alpha: this.alpha,
      glow: this.glow,
      mass: this.mass,
      friction: this.friction,
      bounce: this.bounce,
      life: this.life,
      maxLife: this.maxLife,
      decay: this.decay,
      maxTrailLength: this.maxTrailLength,
      interactive: this.interactive,
      attractionRadius: this.attractionRadius,
      attractionStrength: this.attractionStrength,
      rotation: this.rotation,
      rotationSpeed: this.rotationSpeed,
      scale: this.scale,
      scaleSpeed: this.scaleSpeed,
      userData: { ...this.userData }
    });
  }

  /**
   * Reset particle to initial state
   * @param {number} x - New X position
   * @param {number} y - New Y position
   */
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.life = this.maxLife;
    this.alpha = 1;
    this.scale = 1;
    this.rotation = 0;
    this.trail = [];
    this.active = true;
    this.visible = true;
  }

  /**
   * Destroy the particle (mark for cleanup)
   */
  destroy() {
    this.active = false;
    this.visible = false;
    this.trail = [];
  }
}

// Export for use in other modules
window.Particle = Particle;
