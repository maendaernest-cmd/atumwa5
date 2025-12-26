/**
 * Input.js
 * Handles mouse and touch interactions for particle manipulation
 */

class Input {
  /**
   * Create an input handler instance
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} options - Input options
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      mouseInteraction: options.mouseInteraction !== false,
      touchInteraction: options.touchInteraction !== false,
      attractionRadius: options.attractionRadius || 100,
      attractionStrength: options.attractionStrength || 0.5,
      repulsionRadius: options.repulsionRadius || 80,
      repulsionStrength: options.repulsionStrength || 0.8,
      ...options
    };

    this.mouse = { x: 0, y: 0, down: false, button: -1 };
    this.touches = new Map();
    this.interactions = [];

    this.bindEvents();
  }

  /**
   * Bind input event listeners
   */
  bindEvents() {
    // Mouse events
    if (this.options.mouseInteraction) {
      this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
      this.canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    }

    // Touch events
    if (this.options.touchInteraction) {
      this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
      this.canvas.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
    }

    // Window events for mouse leave
    window.addEventListener('mouseout', this.handleMouseOut.bind(this));
  }

  /**
   * Handle mouse down event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseDown(event) {
    event.preventDefault();

    this.mouse.down = true;
    this.mouse.button = event.button;
    this.updateMousePosition(event);

    const interaction = {
      type: event.button === 0 ? 'attract' : 'repel',
      x: this.mouse.x,
      y: this.mouse.y,
      strength: event.button === 0 ? this.options.attractionStrength : this.options.repulsionStrength,
      radius: event.button === 0 ? this.options.attractionRadius : this.options.repulsionRadius,
      id: 'mouse'
    };

    this.addInteraction(interaction);
  }

  /**
   * Handle mouse move event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    this.updateMousePosition(event);

    if (this.mouse.down) {
      this.updateInteraction('mouse', {
        x: this.mouse.x,
        y: this.mouse.y
      });
    }
  }

  /**
   * Handle mouse up event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseUp(event) {
    this.mouse.down = false;
    this.mouse.button = -1;
    this.removeInteraction('mouse');
  }

  /**
   * Handle mouse wheel event
   * @param {WheelEvent} event - Wheel event
   */
  handleWheel(event) {
    event.preventDefault();

    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const interaction = {
      type: 'vortex',
      x: this.mouse.x,
      y: this.mouse.y,
      strength: delta * 20,
      radius: this.options.attractionRadius * 2,
      id: 'wheel'
    };

    this.addInteraction(interaction);

    // Remove after short delay
    setTimeout(() => {
      this.removeInteraction('wheel');
    }, 200);
  }

  /**
   * Handle context menu event
   * @param {MouseEvent} event - Context menu event
   */
  handleContextMenu(event) {
    event.preventDefault();
  }

  /**
   * Handle mouse out event
   * @param {MouseEvent} event - Mouse out event
   */
  handleMouseOut(event) {
    if (event.relatedTarget === null) {
      this.handleMouseUp(event);
    }
  }

  /**
   * Handle touch start event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchStart(event) {
    event.preventDefault();

    Array.from(event.changedTouches).forEach(touch => {
      const touchId = touch.identifier;
      const coords = this.getTouchCoordinates(touch);

      this.touches.set(touchId, {
        x: coords.x,
        y: coords.y,
        startX: coords.x,
        startY: coords.y
      });

      const interaction = {
        type: 'attract',
        x: coords.x,
        y: coords.y,
        strength: this.options.attractionStrength,
        radius: this.options.attractionRadius,
        id: `touch_${touchId}`
      };

      this.addInteraction(interaction);
    });
  }

  /**
   * Handle touch move event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchMove(event) {
    event.preventDefault();

    Array.from(event.changedTouches).forEach(touch => {
      const touchId = touch.identifier;
      const coords = this.getTouchCoordinates(touch);

      if (this.touches.has(touchId)) {
        this.touches.set(touchId, {
          ...this.touches.get(touchId),
          x: coords.x,
          y: coords.y
        });

        this.updateInteraction(`touch_${touchId}`, {
          x: coords.x,
          y: coords.y
        });
      }
    });
  }

  /**
   * Handle touch end event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchEnd(event) {
    Array.from(event.changedTouches).forEach(touch => {
      const touchId = touch.identifier;
      this.touches.delete(touchId);
      this.removeInteraction(`touch_${touchId}`);
    });
  }

  /**
   * Handle touch cancel event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchCancel(event) {
    this.handleTouchEnd(event);
  }

  /**
   * Update mouse position from event
   * @param {MouseEvent} event - Mouse event
   */
  updateMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.mouse.x = (event.clientX - rect.left) * (this.canvas.width / rect.width) / dpr;
    this.mouse.y = (event.clientY - rect.top) * (this.canvas.height / rect.height) / dpr;
  }

  /**
   * Get touch coordinates
   * @param {Touch} touch - Touch object
   * @returns {Object} Coordinates {x, y}
   */
  getTouchCoordinates(touch) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    return {
      x: (touch.clientX - rect.left) * (this.canvas.width / rect.width) / dpr,
      y: (touch.clientY - rect.top) * (this.canvas.height / rect.height) / dpr
    };
  }

  /**
   * Add an interaction
   * @param {Object} interaction - Interaction object
   */
  addInteraction(interaction) {
    // Remove existing interaction with same ID
    this.removeInteraction(interaction.id);
    this.interactions.push(interaction);
  }

  /**
   * Update an existing interaction
   * @param {string} id - Interaction ID
   * @param {Object} updates - Updates to apply
   */
  updateInteraction(id, updates) {
    const interaction = this.interactions.find(i => i.id === id);
    if (interaction) {
      Object.assign(interaction, updates);
    }
  }

  /**
   * Remove an interaction
   * @param {string} id - Interaction ID
   */
  removeInteraction(id) {
    this.interactions = this.interactions.filter(i => i.id !== id);
  }

  /**
   * Get all active interactions
   * @returns {Array} Array of interaction objects
   */
  getInteractions() {
    return [...this.interactions];
  }

  /**
   * Convert interactions to physics forces
   * @returns {Array} Array of force objects
   */
  getForces() {
    return this.interactions.map(interaction => ({
      x: interaction.x,
      y: interaction.y,
      type: interaction.type,
      strength: interaction.strength,
      radius: interaction.radius
    }));
  }

  /**
   * Create a custom interaction at specified position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} type - Interaction type
   * @param {Object} options - Interaction options
   * @returns {string} Interaction ID
   */
  createInteraction(x, y, type = 'attract', options = {}) {
    const id = `custom_${Date.now()}_${Math.random()}`;

    const interaction = {
      id,
      type,
      x,
      y,
      strength: options.strength || this.options.attractionStrength,
      radius: options.radius || this.options.attractionRadius,
      duration: options.duration || 1000
    };

    this.addInteraction(interaction);

    // Auto-remove after duration if specified
    if (options.duration) {
      setTimeout(() => {
        this.removeInteraction(id);
      }, options.duration);
    }

    return id;
  }

  /**
   * Create a pulse interaction (temporary attraction/repulsion)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} type - Interaction type
   * @param {number} strength - Interaction strength
   * @param {number} duration - Duration in milliseconds
   */
  createPulse(x, y, type = 'attract', strength = 2, duration = 500) {
    const id = `pulse_${Date.now()}`;

    const interaction = {
      id,
      type,
      x,
      y,
      strength,
      radius: this.options.attractionRadius * 2,
      startTime: Date.now(),
      duration
    };

    this.addInteraction(interaction);

    // Animate the pulse
    const animate = () => {
      const elapsed = Date.now() - interaction.startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        this.removeInteraction(id);
        return;
      }

      // Fade out the strength
      interaction.strength = strength * (1 - progress);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  /**
   * Create a drag interaction (follows mouse/finger movement)
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {Function} callback - Callback function called on move
   * @returns {string} Interaction ID
   */
  createDrag(x, y, callback) {
    const id = `drag_${Date.now()}`;

    const interaction = {
      id,
      type: 'attract',
      x,
      y,
      strength: this.options.attractionStrength * 0.5,
      radius: this.options.attractionRadius * 0.5,
      isDrag: true,
      callback
    };

    this.addInteraction(interaction);

    return id;
  }

  /**
   * Get current mouse state
   * @returns {Object} Mouse state
   */
  getMouseState() {
    return { ...this.mouse };
  }

  /**
   * Get current touch states
   * @returns {Map} Touch states
   */
  getTouchStates() {
    return new Map(this.touches);
  }

  /**
   * Check if mouse is currently interacting
   * @returns {boolean} True if mouse is interacting
   */
  isMouseInteracting() {
    return this.mouse.down;
  }

  /**
   * Check if any touch is currently interacting
   * @returns {boolean} True if touch is interacting
   */
  isTouchInteracting() {
    return this.touches.size > 0;
  }

  /**
   * Check if any interaction is active
   * @returns {boolean} True if any interaction is active
   */
  isInteracting() {
    return this.isMouseInteracting() || this.isTouchInteracting();
  }

  /**
   * Get interaction statistics
   * @returns {Object} Interaction statistics
   */
  getStats() {
    return {
      mouseDown: this.mouse.down,
      touchCount: this.touches.size,
      interactionCount: this.interactions.length,
      mousePosition: { x: this.mouse.x, y: this.mouse.y }
    };
  }

  /**
   * Clear all interactions
   */
  clearInteractions() {
    this.interactions = [];
  }

  /**
   * Destroy the input handler and remove event listeners
   */
  destroy() {
    // Remove mouse events
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('wheel', this.handleWheel);
    this.canvas.removeEventListener('contextmenu', this.handleContextMenu);

    // Remove touch events
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('touchcancel', this.handleTouchCancel);

    // Remove window events
    window.removeEventListener('mouseout', this.handleMouseOut);

    // Clear state
    this.clearInteractions();
    this.touches.clear();
  }
}

// Export for use in other modules
window.Input = Input;
