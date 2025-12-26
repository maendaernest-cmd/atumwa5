/**
 * Physics.js
 * Physics engine for particle interactions and forces
 */

class Physics {
  /**
   * Create a physics engine instance
   * @param {Object} options - Physics options
   */
  constructor(options = {}) {
    this.gravity = options.gravity || { x: 0, y: 9.8 };
    this.wind = options.wind || { x: 0, y: 0 };
    this.friction = options.friction || 0.99;
    this.bounce = options.bounce || 0.8;
    this.timeScale = options.timeScale || 1;

    // Force fields
    this.forceFields = [];

    // Collision detection
    this.collisionDetection = options.collisionDetection !== false;
    this.collisionResponse = options.collisionResponse || 'bounce';

    // Spatial partitioning for performance
    this.spatialGrid = null;
    this.gridSize = options.gridSize || 50;
    this.useSpatialPartitioning = options.useSpatialPartitioning !== false;
  }

  /**
   * Update physics for all particles
   * @param {Array} particles - Array of particles
   * @param {number} deltaTime - Time since last update
   * @param {Object} bounds - Canvas bounds {width, height}
   */
  update(particles, deltaTime, bounds) {
    const scaledDeltaTime = deltaTime * this.timeScale;

    // Build spatial grid if enabled
    if (this.useSpatialPartitioning && particles.length > 100) {
      this.buildSpatialGrid(particles, bounds);
    }

    // Apply global forces
    const globalForces = this.getGlobalForces();

    // Update each particle
    particles.forEach((particle, index) => {
      if (!particle.active) return;

      // Apply global forces
      globalForces.forEach(force => {
        particle.applyForce(force);
      });

      // Apply force fields
      this.applyForceFields(particle);

      // Handle particle-particle collisions if enabled
      if (this.collisionDetection) {
        this.handleParticleCollisions(particle, particles, index);
      }

      // Update particle physics
      particle.update(scaledDeltaTime, bounds, []);
    });
  }

  /**
   * Get global forces (gravity, wind, etc.)
   * @returns {Array} Array of force objects
   */
  getGlobalForces() {
    const forces = [];

    // Gravity
    if (this.gravity.x !== 0 || this.gravity.y !== 0) {
      forces.push({
        x: 0, y: 0,
        type: 'gravity',
        strength: this.gravity.y,
        radius: Infinity
      });
    }

    // Wind
    if (this.wind.x !== 0 || this.wind.y !== 0) {
      forces.push({
        x: 0, y: 0,
        type: 'wind',
        strength: this.wind.x,
        radius: Infinity
      });
    }

    return forces;
  }

  /**
   * Add a force field
   * @param {Object} field - Force field object
   */
  addForceField(field) {
    this.forceFields.push(field);
  }

  /**
   * Remove a force field
   * @param {Object} field - Force field to remove
   */
  removeForceField(field) {
    const index = this.forceFields.indexOf(field);
    if (index > -1) {
      this.forceFields.splice(index, 1);
    }
  }

  /**
   * Clear all force fields
   */
  clearForceFields() {
    this.forceFields = [];
  }

  /**
   * Apply force fields to a particle
   * @param {Particle} particle - Particle to apply forces to
   */
  applyForceFields(particle) {
    this.forceFields.forEach(field => {
      const distance = MathUtils.distance(particle.x, particle.y, field.x, field.y);

      if (distance < field.radius) {
        particle.applyForce(field);
      }
    });
  }

  /**
   * Create a gravity force field
   * @param {number} x - Center X
   * @param {number} y - Center Y
   * @param {number} strength - Gravity strength
   * @param {number} radius - Effect radius
   * @returns {Object} Force field object
   */
  createGravityField(x, y, strength = 100, radius = 100) {
    return {
      x, y,
      type: 'attraction',
      strength,
      radius
    };
  }

  /**
   * Create a repulsion force field
   * @param {number} x - Center X
   * @param {number} y - Center Y
   * @param {number} strength - Repulsion strength
   * @param {number} radius - Effect radius
   * @returns {Object} Force field object
   */
  createRepulsionField(x, y, strength = 100, radius = 100) {
    return {
      x, y,
      type: 'repulsion',
      strength,
      radius
    };
  }

  /**
   * Create a vortex force field
   * @param {number} x - Center X
   * @param {number} y - Center Y
   * @param {number} strength - Vortex strength
   * @param {number} radius - Effect radius
   * @returns {Object} Force field object
   */
  createVortexField(x, y, strength = 50, radius = 100) {
    return {
      x, y,
      type: 'vortex',
      strength,
      radius
    };
  }

  /**
   * Create a noise force field
   * @param {number} x - Center X
   * @param {number} y - Center Y
   * @param {number} strength - Noise strength
   * @param {number} radius - Effect radius
   * @returns {Object} Force field object
   */
  createNoiseField(x, y, strength = 10, radius = 100) {
    return {
      x, y,
      type: 'noise',
      strength,
      radius
    };
  }

  /**
   * Handle particle-particle collisions
   * @param {Particle} particle - Current particle
   * @param {Array} particles - All particles
   * @param {number} currentIndex - Current particle index
   */
  handleParticleCollisions(particle, particles, currentIndex) {
    if (!this.useSpatialPartitioning) {
      // Brute force collision detection
      this.bruteForceCollisions(particle, particles, currentIndex);
    } else {
      // Spatial partitioning collision detection
      this.spatialCollisions(particle, particles, currentIndex);
    }
  }

  /**
   * Brute force collision detection
   * @param {Particle} particle - Current particle
   * @param {Array} particles - All particles
   * @param {number} currentIndex - Current particle index
   */
  bruteForceCollisions(particle, particles, currentIndex) {
    for (let i = currentIndex + 1; i < particles.length; i++) {
      const other = particles[i];

      if (!other.active) continue;

      const dx = other.x - particle.x;
      const dy = other.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = particle.size + other.size;

      if (distance < minDistance) {
        this.resolveCollision(particle, other, dx, dy, distance, minDistance);
      }
    }
  }

  /**
   * Spatial partitioning collision detection
   * @param {Particle} particle - Current particle
   * @param {Array} particles - All particles
   * @param {number} currentIndex - Current particle index
   */
  spatialCollisions(particle, particles, currentIndex) {
    if (!this.spatialGrid) return;

    const cellX = Math.floor(particle.x / this.gridSize);
    const cellY = Math.floor(particle.y / this.gridSize);

    // Check neighboring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const checkX = cellX + dx;
        const checkY = cellY + dy;

        if (checkX >= 0 && checkY >= 0 &&
            checkX < this.spatialGrid.length &&
            checkY < this.spatialGrid[0].length) {

          const cellParticles = this.spatialGrid[checkX][checkY];
          cellParticles.forEach(otherIndex => {
            if (otherIndex <= currentIndex) return; // Avoid double checking

            const other = particles[otherIndex];
            if (!other.active) return;

            const distance = MathUtils.distance(particle.x, particle.y, other.x, other.y);
            const minDistance = particle.size + other.size;

            if (distance < minDistance) {
              this.resolveCollision(particle, other,
                other.x - particle.x, other.y - particle.y,
                distance, minDistance);
            }
          });
        }
      }
    }
  }

  /**
   * Resolve collision between two particles
   * @param {Particle} p1 - First particle
   * @param {Particle} p2 - Second particle
   * @param {number} dx - X distance
   * @param {number} dy - Y distance
   * @param {number} distance - Actual distance
   * @param {number} minDistance - Minimum required distance
   */
  resolveCollision(p1, p2, dx, dy, distance, minDistance) {
    if (distance === 0) return; // Avoid division by zero

    // Separate particles
    const overlap = minDistance - distance;
    const separationX = (dx / distance) * overlap * 0.5;
    const separationY = (dy / distance) * overlap * 0.5;

    p1.x -= separationX;
    p1.y -= separationY;
    p2.x += separationX;
    p2.y += separationY;

    // Collision response
    if (this.collisionResponse === 'bounce') {
      // Calculate relative velocity
      const relativeVx = p2.vx - p1.vx;
      const relativeVy = p2.vy - p1.vy;

      // Calculate relative velocity along collision normal
      const normalX = dx / distance;
      const normalY = dy / distance;
      const velocityAlongNormal = relativeVx * normalX + relativeVy * normalY;

      // Don't resolve if velocities are separating
      if (velocityAlongNormal > 0) return;

      // Calculate restitution
      const restitution = Math.min(p1.bounce, p2.bounce);

      // Calculate impulse scalar
      const impulse = -(1 + restitution) * velocityAlongNormal;
      const totalMass = p1.mass + p2.mass;

      // Apply impulse
      const impulseX = impulse * normalX;
      const impulseY = impulse * normalY;

      p1.vx -= (impulseX * p2.mass) / totalMass;
      p1.vy -= (impulseY * p2.mass) / totalMass;
      p2.vx += (impulseX * p1.mass) / totalMass;
      p2.vy += (impulseY * p1.mass) / totalMass;
    }
  }

  /**
   * Build spatial partitioning grid
   * @param {Array} particles - All particles
   * @param {Object} bounds - Canvas bounds
   */
  buildSpatialGrid(particles, bounds) {
    const gridWidth = Math.ceil(bounds.width / this.gridSize);
    const gridHeight = Math.ceil(bounds.height / this.gridSize);

    // Initialize grid
    this.spatialGrid = Array(gridWidth).fill().map(() =>
      Array(gridHeight).fill().map(() => [])
    );

    // Assign particles to grid cells
    particles.forEach((particle, index) => {
      if (!particle.active) return;

      const cellX = Math.floor(particle.x / this.gridSize);
      const cellY = Math.floor(particle.y / this.gridSize);

      if (cellX >= 0 && cellX < gridWidth && cellY >= 0 && cellY < gridHeight) {
        this.spatialGrid[cellX][cellY].push(index);
      }
    });
  }

  /**
   * Check if a point is affected by any force field
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Object|null} Force field or null
   */
  getForceAtPoint(x, y) {
    for (const field of this.forceFields) {
      const distance = MathUtils.distance(x, y, field.x, field.y);
      if (distance < field.radius) {
        return field;
      }
    }
    return null;
  }

  /**
   * Calculate trajectory prediction
   * @param {Particle} particle - Particle to predict
   * @param {number} steps - Number of prediction steps
   * @param {number} timeStep - Time step for prediction
   * @returns {Array} Array of predicted positions
   */
  predictTrajectory(particle, steps = 10, timeStep = 0.016) {
    const trajectory = [];
    const tempParticle = particle.clone();

    for (let i = 0; i < steps; i++) {
      // Apply forces to temporary particle
      const globalForces = this.getGlobalForces();
      globalForces.forEach(force => {
        tempParticle.applyForce(force);
      });
      this.applyForceFields(tempParticle);

      // Update physics
      tempParticle.updatePhysics(timeStep);

      // Store position
      trajectory.push({ x: tempParticle.x, y: tempParticle.y });
    }

    return trajectory;
  }

  /**
   * Set physics parameters
   * @param {Object} params - Physics parameters
   */
  setParameters(params) {
    if (params.gravity !== undefined) this.gravity = params.gravity;
    if (params.wind !== undefined) this.wind = params.wind;
    if (params.friction !== undefined) this.friction = params.friction;
    if (params.bounce !== undefined) this.bounce = params.bounce;
    if (params.timeScale !== undefined) this.timeScale = params.timeScale;
  }

  /**
   * Get current physics state
   * @returns {Object} Physics state
   */
  getState() {
    return {
      gravity: this.gravity,
      wind: this.wind,
      friction: this.friction,
      bounce: this.bounce,
      timeScale: this.timeScale,
      forceFields: this.forceFields.length,
      collisionDetection: this.collisionDetection,
      spatialPartitioning: this.useSpatialPartitioning
    };
  }

  /**
   * Reset physics to default state
   */
  reset() {
    this.gravity = { x: 0, y: 9.8 };
    this.wind = { x: 0, y: 0 };
    this.friction = 0.99;
    this.bounce = 0.8;
    this.timeScale = 1;
    this.forceFields = [];
    this.collisionDetection = true;
    this.collisionResponse = 'bounce';
    this.spatialGrid = null;
  }
}

// Export for use in other modules
window.Physics = Physics;
