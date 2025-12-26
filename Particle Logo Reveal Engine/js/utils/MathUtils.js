/**
 * MathUtils.js
 * Mathematical utilities for particle physics and animations
 */

class MathUtils {
  /**
   * Linear interpolation between two values
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} factor - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  static lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  /**
   * Clamp a value between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Map a value from one range to another
   * @param {number} value - Value to map
   * @param {number} inMin - Input range minimum
   * @param {number} inMax - Input range maximum
   * @param {number} outMin - Output range minimum
   * @param {number} outMax - Output range maximum
   * @returns {number} Mapped value
   */
  static map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Generate a random number between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Generate a random integer between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer
   */
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculate distance between two points
   * @param {number} x1 - Point 1 x coordinate
   * @param {number} y1 - Point 1 y coordinate
   * @param {number} x2 - Point 2 x coordinate
   * @param {number} y2 - Point 2 y coordinate
   * @returns {number} Distance
   */
  static distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate angle between two points
   * @param {number} x1 - Point 1 x coordinate
   * @param {number} y1 - Point 1 y coordinate
   * @param {number} x2 - Point 2 x coordinate
   * @param {number} y2 - Point 2 y coordinate
   * @returns {number} Angle in radians
   */
  static angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   */
  static degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Convert radians to degrees
   * @param {number} radians - Angle in radians
   * @returns {number} Angle in degrees
   */
  static radToDeg(radians) {
    return radians * 180 / Math.PI;
  }

  /**
   * Normalize an angle to be between 0 and 2π
   * @param {number} angle - Angle in radians
   * @returns {number} Normalized angle
   */
  static normalizeAngle(angle) {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
  }

  /**
   * Calculate the shortest angle difference
   * @param {number} from - Start angle in radians
   * @param {number} to - Target angle in radians
   * @returns {number} Shortest angle difference
   */
  static angleDifference(from, to) {
    let diff = to - from;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return diff;
  }

  /**
   * Ease in function (quadratic)
   * @param {number} t - Time (0-1)
   * @returns {number} Eased value
   */
  static easeIn(t) {
    return t * t;
  }

  /**
   * Ease out function (quadratic)
   * @param {number} t - Time (0-1)
   * @returns {number} Eased value
   */
  static easeOut(t) {
    return t * (2 - t);
  }

  /**
   * Ease in-out function (quadratic)
   * @param {number} t - Time (0-1)
   * @returns {number} Eased value
   */
  static easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Cubic bezier curve approximation
   * @param {number} t - Time (0-1)
   * @param {number} p0 - Control point 0
   * @param {number} p1 - Control point 1
   * @param {number} p2 - Control point 2
   * @param {number} p3 - Control point 3
   * @returns {number} Bezier value
   */
  static cubicBezier(t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
  }

  /**
   * Smooth step function
   * @param {number} edge0 - Lower edge
   * @param {number} edge1 - Upper edge
   * @param {number} x - Input value
   * @returns {number} Smoothed value
   */
  static smoothstep(edge0, edge1, x) {
    x = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return x * x * (3 - 2 * x);
  }

  /**
   * Smoother step function
   * @param {number} edge0 - Lower edge
   * @param {number} edge1 - Upper edge
   * @param {number} x - Input value
   * @returns {number} Smoothed value
   */
  static smootherstep(edge0, edge1, x) {
    x = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  /**
   * Perlin noise approximation (simplified)
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {number} Noise value (-1 to 1)
   */
  static noise(x, y = 0) {
    // Simple pseudo-random noise function
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }

  /**
   * Calculate the magnitude of a vector
   * @param {number} x - X component
   * @param {number} y - Y component
   * @returns {number} Magnitude
   */
  static magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Normalize a vector
   * @param {number} x - X component
   * @param {number} y - Y component
   * @returns {Object} Normalized vector {x, y}
   */
  static normalize(x, y) {
    const mag = MathUtils.magnitude(x, y);
    if (mag === 0) return { x: 0, y: 0 };
    return { x: x / mag, y: y / mag };
  }

  /**
   * Calculate dot product of two vectors
   * @param {number} x1 - Vector 1 x
   * @param {number} y1 - Vector 1 y
   * @param {number} x2 - Vector 2 x
   * @param {number} y2 - Vector 2 y
   * @returns {number} Dot product
   */
  static dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
  }

  /**
   * Rotate a point around origin
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} angle - Rotation angle in radians
   * @returns {Object} Rotated point {x, y}
   */
  static rotate(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos
    };
  }

  /**
   * Check if a point is inside a rectangle
   * @param {number} px - Point x
   * @param {number} py - Point y
   * @param {number} rx - Rectangle x
   * @param {number} ry - Rectangle y
   * @param {number} rw - Rectangle width
   * @param {number} rh - Rectangle height
   * @returns {boolean} True if point is inside rectangle
   */
  static pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  /**
   * Check if a point is inside a circle
   * @param {number} px - Point x
   * @param {number} py - Point y
   * @param {number} cx - Circle center x
   * @param {number} cy - Circle center y
   * @param {number} radius - Circle radius
   * @returns {boolean} True if point is inside circle
   */
  static pointInCircle(px, py, cx, cy, radius) {
    return MathUtils.distance(px, py, cx, cy) <= radius;
  }
}

// Export for use in other modules
window.MathUtils = MathUtils;
