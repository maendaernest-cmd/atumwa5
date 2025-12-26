/**
 * SVGGenerator.js
 * Converts SVG files to particle positions by sampling vector paths
 */

class SVGGenerator {
  /**
   * Create an SVG generator instance
   * @param {Object} options - SVG generation options
   */
  constructor(options = {}) {
    this.spacing = options.spacing || 5; // Distance between particles on paths
    this.quality = options.quality || 1; // Quality multiplier
    this.scale = options.scale || 1; // Scale factor for SVG
    this.optimizePaths = options.optimizePaths !== false; // Simplify paths
  }

  /**
   * Generate particles from SVG file
   * @param {File} svgFile - SVG file object
   * @param {Object} options - Generation options
   * @returns {Promise<Array>} Promise resolving to array of particle positions
   */
  async generateFromFile(svgFile, options = {}) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const svgContent = e.target.result;
        try {
          const particles = this.parseSVG(svgContent, options);
          resolve(particles);
        } catch (error) {
          reject(new Error(`Failed to parse SVG: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read SVG file'));
      };

      reader.readAsText(svgFile);
    });
  }

  /**
   * Generate particles from SVG string
   * @param {string} svgString - SVG content as string
   * @param {Object} options - Generation options
   * @returns {Array} Array of particle positions
   */
  generateFromString(svgString, options = {}) {
    return this.parseSVG(svgString, options);
  }

  /**
   * Parse SVG content and extract particle positions
   * @param {string} svgContent - SVG content
   * @param {Object} options - Parsing options
   * @returns {Array} Array of particle positions
   */
  parseSVG(svgContent, options = {}) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

    // Check for parser errors
    const parserError = svgDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid SVG format');
    }

    const svgElement = svgDoc.documentElement;
    const viewBox = svgElement.getAttribute('viewBox');

    // Get SVG dimensions
    let svgWidth = parseFloat(svgElement.getAttribute('width')) || 100;
    let svgHeight = parseFloat(svgElement.getAttribute('height')) || 100;

    if (viewBox) {
      const viewBoxValues = viewBox.split(' ').map(parseFloat);
      svgWidth = viewBoxValues[2];
      svgHeight = viewBoxValues[3];
    }

    // Scale factor
    const scale = options.scale || this.scale;

    // Find all path elements
    const paths = svgElement.querySelectorAll('path, circle, ellipse, rect, line, polyline, polygon');

    const allParticles = [];

    paths.forEach((element, pathIndex) => {
      const particles = this.extractParticlesFromElement(element, {
        scale,
        spacing: options.spacing || this.spacing,
        quality: options.quality || this.quality,
        svgWidth,
        svgHeight,
        pathIndex
      });

      allParticles.push(...particles);
    });

    return this.optimizeParticles(allParticles, options);
  }

  /**
   * Extract particles from a single SVG element
   * @param {Element} element - SVG element
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractParticlesFromElement(element, options) {
    const { scale, spacing, quality, svgWidth, svgHeight, pathIndex } = options;
    const particles = [];

    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'path':
        return this.extractFromPath(element, options);

      case 'circle':
        return this.extractFromCircle(element, options);

      case 'ellipse':
        return this.extractFromEllipse(element, options);

      case 'rect':
        return this.extractFromRect(element, options);

      case 'line':
        return this.extractFromLine(element, options);

      case 'polyline':
      case 'polygon':
        return this.extractFromPolyline(element, options);

      default:
        return particles;
    }
  }

  /**
   * Extract particles from path element
   * @param {Element} pathElement - Path element
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractFromPath(pathElement, options) {
    const { scale, spacing, quality } = options;
    const particles = [];

    const d = pathElement.getAttribute('d');
    if (!d) return particles;

    // Parse path data (simplified implementation)
    const commands = this.parsePathData(d);

    let currentPoint = { x: 0, y: 0 };
    let pathParticles = [];

    commands.forEach(command => {
      const newParticles = this.processPathCommand(command, currentPoint, spacing, scale);
      pathParticles.push(...newParticles);

      if (command.x !== undefined) currentPoint.x = command.x * scale;
      if (command.y !== undefined) currentPoint.y = command.y * scale;
    });

    // Add quality multiplier
    for (let i = 0; i < quality; i++) {
      const offset = i * 0.5;
      pathParticles.forEach(particle => {
        particles.push({
          x: particle.x + MathUtils.random(-offset, offset),
          y: particle.y + MathUtils.random(-offset, offset),
          alpha: particle.alpha || 1,
          originalX: particle.x,
          originalY: particle.y,
          pathIndex: options.pathIndex
        });
      });
    }

    return particles;
  }

  /**
   * Extract particles from circle element
   * @param {Element} circleElement - Circle element
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractFromCircle(circleElement, options) {
    const { scale, spacing, quality } = options;
    const particles = [];

    const cx = parseFloat(circleElement.getAttribute('cx') || '0') * scale;
    const cy = parseFloat(circleElement.getAttribute('cy') || '0') * scale;
    const r = parseFloat(circleElement.getAttribute('r') || '0') * scale;

    if (r <= 0) return particles;

    // Calculate circumference and number of particles
    const circumference = 2 * Math.PI * r;
    const numParticles = Math.max(8, Math.floor(circumference / spacing));

    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      // Add quality multiplier
      for (let q = 0; q < quality; q++) {
        const offset = q * 0.5;
        particles.push({
          x: x + MathUtils.random(-offset, offset),
          y: y + MathUtils.random(-offset, offset),
          alpha: 1,
          originalX: x,
          originalY: y,
          pathIndex: options.pathIndex
        });
      }
    }

    return particles;
  }

  /**
   * Extract particles from ellipse element
   * @param {Element} ellipseElement - Ellipse element
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractFromEllipse(ellipseElement, options) {
    const { scale, spacing, quality } = options;
    const particles = [];

    const cx = parseFloat(ellipseElement.getAttribute('cx') || '0') * scale;
    const cy = parseFloat(ellipseElement.getAttribute('cy') || '0') * scale;
    const rx = parseFloat(ellipseElement.getAttribute('rx') || '0') * scale;
    const ry = parseFloat(ellipseElement.getAttribute('ry') || '0') * scale;

    if (rx <= 0 || ry <= 0) return particles;

    // Approximate ellipse circumference
    const circumference = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    const numParticles = Math.max(8, Math.floor(circumference / spacing));

    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;

      // Add quality multiplier
      for (let q = 0; q < quality; q++) {
        const offset = q * 0.5;
        particles.push({
          x: x + MathUtils.random(-offset, offset),
          y: y + MathUtils.random(-offset, offset),
          alpha: 1,
          originalX: x,
          originalY: y,
          pathIndex: options.pathIndex
        });
      }
    }

    return particles;
  }

  /**
   * Extract particles from rectangle element
   * @param {Element} rectElement - Rectangle element
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractFromRect(rectElement, options) {
    const { scale, spacing, quality } = options;
    const particles = [];

    const x = parseFloat(rectElement.getAttribute('x') || '0') * scale;
    const y = parseFloat(rectElement.getAttribute('y') || '0') * scale;
    const width = parseFloat(rectElement.getAttribute('width') || '0') * scale;
    const height = parseFloat(rectElement.getAttribute('height') || '0') * scale;

    if (width <= 0 || height <= 0) return particles;

    // Sample perimeter
    const perimeter = 2 * (width + height);
    const numParticles = Math.max(8, Math.floor(perimeter / spacing));

    for (let i = 0; i < numParticles; i++) {
      let px, py;

      if (i < width / spacing) {
        // Top edge
        px = x + i * spacing;
        py = y;
      } else if (i < (width + height) / spacing) {
        // Right edge
        px = x + width;
        py = y + (i - width / spacing) * spacing;
      } else if (i < (width * 2 + height) / spacing) {
        // Bottom edge
        px = x + width - (i - (width + height) / spacing) * spacing;
        py = y + height;
      } else {
        // Left edge
        px = x;
        py = y + height - (i - (width * 2 + height) / spacing) * spacing;
      }

      // Add quality multiplier
      for (let q = 0; q < quality; q++) {
        const offset = q * 0.5;
        particles.push({
          x: px + MathUtils.random(-offset, offset),
          y: py + MathUtils.random(-offset, offset),
          alpha: 1,
          originalX: px,
          originalY: py,
          pathIndex: options.pathIndex
        });
      }
    }

    return particles;
  }

  /**
   * Extract particles from line element
   * @param {Element} lineElement - Line element
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractFromLine(lineElement, options) {
    const { scale, spacing, quality } = options;
    const particles = [];

    const x1 = parseFloat(lineElement.getAttribute('x1') || '0') * scale;
    const y1 = parseFloat(lineElement.getAttribute('y1') || '0') * scale;
    const x2 = parseFloat(lineElement.getAttribute('x2') || '0') * scale;
    const y2 = parseFloat(lineElement.getAttribute('y2') || '0') * scale;

    const distance = MathUtils.distance(x1, y1, x2, y2);
    const numParticles = Math.max(2, Math.floor(distance / spacing));

    for (let i = 0; i <= numParticles; i++) {
      const t = i / numParticles;
      const x = MathUtils.lerp(x1, x2, t);
      const y = MathUtils.lerp(y1, y2, t);

      // Add quality multiplier
      for (let q = 0; q < quality; q++) {
        const offset = q * 0.5;
        particles.push({
          x: x + MathUtils.random(-offset, offset),
          y: y + MathUtils.random(-offset, offset),
          alpha: 1,
          originalX: x,
          originalY: y,
          pathIndex: options.pathIndex
        });
      }
    }

    return particles;
  }

  /**
   * Extract particles from polyline/polygon element
   * @param {Element} polyElement - Polyline/polygon element
   * @param {Object} options - Extraction options
   * @returns {Array} Array of particle positions
   */
  extractFromPolyline(polyElement, options) {
    const { scale, spacing, quality } = options;
    const particles = [];

    const points = polyElement.getAttribute('points');
    if (!points) return particles;

    const coords = points.trim().split(/\s+/).map(pair => {
      const [x, y] = pair.split(',').map(parseFloat);
      return { x: x * scale, y: y * scale };
    });

    // Connect points with lines
    for (let i = 0; i < coords.length - 1; i++) {
      const start = coords[i];
      const end = coords[i + 1];

      const distance = MathUtils.distance(start.x, start.y, end.x, end.y);
      const numParticles = Math.max(2, Math.floor(distance / spacing));

      for (let j = 0; j <= numParticles; j++) {
        const t = j / numParticles;
        const x = MathUtils.lerp(start.x, end.x, t);
        const y = MathUtils.lerp(start.y, end.y, t);

        // Add quality multiplier
        for (let q = 0; q < quality; q++) {
          const offset = q * 0.5;
          particles.push({
            x: x + MathUtils.random(-offset, offset),
            y: y + MathUtils.random(-offset, offset),
            alpha: 1,
            originalX: x,
            originalY: y,
            pathIndex: options.pathIndex
          });
        }
      }
    }

    // Close polygon if it's a polygon element
    if (polyElement.tagName.toLowerCase() === 'polygon' && coords.length > 2) {
      const start = coords[coords.length - 1];
      const end = coords[0];

      const distance = MathUtils.distance(start.x, start.y, end.x, end.y);
      const numParticles = Math.max(2, Math.floor(distance / spacing));

      for (let j = 0; j <= numParticles; j++) {
        const t = j / numParticles;
        const x = MathUtils.lerp(start.x, end.x, t);
        const y = MathUtils.lerp(start.y, end.y, t);

        for (let q = 0; q < quality; q++) {
          const offset = q * 0.5;
          particles.push({
            x: x + MathUtils.random(-offset, offset),
            y: y + MathUtils.random(-offset, offset),
            alpha: 1,
            originalX: x,
            originalY: y,
            pathIndex: options.pathIndex
          });
        }
      }
    }

    return particles;
  }

  /**
   * Parse SVG path data (simplified implementation)
   * @param {string} d - Path data string
   * @returns {Array} Array of path commands
   */
  parsePathData(d) {
    // This is a simplified path parser
    // A full implementation would handle all SVG path commands
    const commands = [];
    const tokens = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

    tokens.forEach(token => {
      const command = token[0];
      const params = token.slice(1).trim().split(/[\s,]+/).map(parseFloat);

      switch (command.toLowerCase()) {
        case 'm':
        case 'l':
          if (params.length >= 2) {
            commands.push({
              type: command.toLowerCase(),
              x: params[0],
              y: params[1]
            });
          }
          break;
        case 'h':
          commands.push({
            type: 'h',
            x: params[0]
          });
          break;
        case 'v':
          commands.push({
            type: 'v',
            y: params[0]
          });
          break;
        case 'z':
          commands.push({
            type: 'z'
          });
          break;
        // Add more path commands as needed
      }
    });

    return commands;
  }

  /**
   * Process a path command and generate particles
   * @param {Object} command - Path command
   * @param {Object} currentPoint - Current position
   * @param {number} spacing - Particle spacing
   * @param {number} scale - Scale factor
   * @returns {Array} Array of particle positions
   */
  processPathCommand(command, currentPoint, spacing, scale) {
    const particles = [];

    switch (command.type) {
      case 'm':
      case 'l':
        // Line to command
        const targetX = command.x * scale;
        const targetY = command.y * scale;
        const distance = MathUtils.distance(currentPoint.x, currentPoint.y, targetX, targetY);
        const steps = Math.max(1, Math.floor(distance / spacing));

        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          particles.push({
            x: MathUtils.lerp(currentPoint.x, targetX, t),
            y: MathUtils.lerp(currentPoint.y, targetY, t),
            alpha: 1
          });
        }
        break;

      case 'h':
        // Horizontal line
        const hTargetX = command.x * scale;
        const hDistance = Math.abs(hTargetX - currentPoint.x);
        const hSteps = Math.max(1, Math.floor(hDistance / spacing));

        for (let i = 1; i <= hSteps; i++) {
          const t = i / hSteps;
          particles.push({
            x: MathUtils.lerp(currentPoint.x, hTargetX, t),
            y: currentPoint.y,
            alpha: 1
          });
        }
        break;

      case 'v':
        // Vertical line
        const vTargetY = command.y * scale;
        const vDistance = Math.abs(vTargetY - currentPoint.y);
        const vSteps = Math.max(1, Math.floor(vDistance / spacing));

        for (let i = 1; i <= vSteps; i++) {
          const t = i / vSteps;
          particles.push({
            x: currentPoint.x,
            y: MathUtils.lerp(currentPoint.y, vTargetY, t),
            alpha: 1
          });
        }
        break;
    }

    return particles;
  }

  /**
   * Optimize particle count by merging nearby particles
   * @param {Array} particles - Raw particle array
   * @param {Object} options - Optimization options
   * @returns {Array} Optimized particle array
   */
  optimizeParticles(particles, options = {}) {
    if (!options.optimizePaths || particles.length < 100) {
      return particles;
    }

    const mergeDistance = options.mergeDistance || 3;
    const optimized = [];
    const used = new Set();

    for (let i = 0; i < particles.length; i++) {
      if (used.has(i)) continue;

      const current = particles[i];
      let mergedCount = 1;
      let totalX = current.x;
      let totalY = current.y;
      let totalAlpha = current.alpha || 1;

      // Find nearby particles to merge
      for (let j = i + 1; j < particles.length; j++) {
        if (used.has(j)) continue;

        const other = particles[j];
        const distance = MathUtils.distance(current.x, current.y, other.x, other.y);

        if (distance <= mergeDistance) {
          totalX += other.x;
          totalY += other.y;
          totalAlpha += other.alpha || 1;
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
        size: Math.sqrt(mergedCount) * 2 // Larger size for merged particles
      });

      used.add(i);
    }

    return optimized;
  }

  /**
   * Generate particles with animation data for SVG reveals
   * @param {string} svgString - SVG content
   * @param {string} animationType - Type of animation ('sequential', 'simultaneous', 'wave')
   * @param {Object} options - Animation options
   * @returns {Array} Array of particle positions with animation data
   */
  generateWithAnimation(svgString, animationType = 'sequential', options = {}) {
    const particles = this.parseSVG(svgString, options);

    particles.forEach((particle, index) => {
      switch (animationType) {
        case 'sequential':
          particle.delay = index * (options.delay || 0.01);
          break;

        case 'simultaneous':
          particle.delay = MathUtils.random(0, options.maxDelay || 1);
          break;

        case 'wave':
          const waveX = particle.x / (options.waveWidth || 100);
          particle.delay = Math.sin(waveX) * (options.waveDelay || 0.5);
          break;

        case 'radial':
          const centerX = options.centerX || particles.reduce((sum, p) => sum + p.x, 0) / particles.length;
          const centerY = options.centerY || particles.reduce((sum, p) => sum + p.y, 0) / particles.length;
          const distance = MathUtils.distance(particle.x, particle.y, centerX, centerY);
          particle.delay = distance / (options.radialSpeed || 200);
          break;
      }
    });

    return particles;
  }

  /**
   * Get SVG bounds and metadata
   * @param {string} svgString - SVG content
   * @returns {Object} SVG metadata
   */
  getSVGMetadata(svgString) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    const viewBox = svgElement.getAttribute('viewBox');
    let bounds = { x: 0, y: 0, width: 100, height: 100 };

    if (viewBox) {
      const values = viewBox.split(' ').map(parseFloat);
      bounds = { x: values[0], y: values[1], width: values[2], height: values[3] };
    }

    const paths = svgElement.querySelectorAll('path, circle, ellipse, rect, line, polyline, polygon');

    return {
      bounds,
      pathCount: paths.length,
      hasViewBox: !!viewBox,
      width: parseFloat(svgElement.getAttribute('width')) || bounds.width,
      height: parseFloat(svgElement.getAttribute('height')) || bounds.height
    };
  }

  /**
   * Update generator settings
   * @param {Object} settings - New settings
   */
  updateSettings(settings) {
    if (settings.spacing !== undefined) this.spacing = settings.spacing;
    if (settings.quality !== undefined) this.quality = settings.quality;
    if (settings.scale !== undefined) this.scale = settings.scale;
    if (settings.optimizePaths !== undefined) this.optimizePaths = settings.optimizePaths;
  }
}

// Export for use in other modules
window.SVGGenerator = SVGGenerator;
