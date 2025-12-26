/**
 * ColorUtils.js
 * Color manipulation utilities for particles
 */

class ColorUtils {
  /**
   * Create an RGBA color string
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @param {number} a - Alpha (0-1)
   * @returns {string} RGBA color string
   */
  static rgba(r, g, b, a = 1) {
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
  }

  /**
   * Create an HSLA color string
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-100)
   * @param {number} l - Lightness (0-100)
   * @param {number} a - Alpha (0-1)
   * @returns {string} HSLA color string
   */
  static hsla(h, s, l, a = 1) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  /**
   * Convert HSL to RGB
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-100)
   * @param {number} l - Lightness (0-100)
   * @returns {Object} RGB object {r, g, b}
   */
  static hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Convert RGB to HSL
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {Object} HSL object {h, s, l}
   */
  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Generate a rainbow color based on position
   * @param {number} position - Position (0-1)
   * @param {number} saturation - Saturation (0-100)
   * @param {number} lightness - Lightness (0-100)
   * @returns {string} HSLA color string
   */
  static rainbow(position, saturation = 100, lightness = 50) {
    const hue = (position * 360) % 360;
    return ColorUtils.hsla(hue, saturation, lightness);
  }

  /**
   * Generate a fire color gradient (red to yellow to white)
   * @param {number} intensity - Intensity (0-1)
   * @returns {string} RGBA color string
   */
  static fire(intensity) {
    if (intensity < 0.33) {
      // Red to orange
      const factor = intensity / 0.33;
      return ColorUtils.rgba(255, Math.round(165 * factor), 0);
    } else if (intensity < 0.66) {
      // Orange to yellow
      const factor = (intensity - 0.33) / 0.33;
      return ColorUtils.rgba(255, Math.round(165 + 90 * factor), 0);
    } else {
      // Yellow to white
      const factor = (intensity - 0.66) / 0.34;
      return ColorUtils.rgba(255, 255, Math.round(255 * factor));
    }
  }

  /**
   * Generate an ocean color gradient (blue to cyan)
   * @param {number} depth - Depth (0-1)
   * @returns {string} RGBA color string
   */
  static ocean(depth) {
    const r = Math.round(0 + depth * 0);
    const g = Math.round(100 + depth * 155);
    const b = Math.round(200 + depth * 55);
    return ColorUtils.rgba(r, g, b);
  }

  /**
   * Generate a gradient color between two colors
   * @param {number} factor - Interpolation factor (0-1)
   * @param {Array} color1 - Start color [r, g, b, a]
   * @param {Array} color2 - End color [r, g, b, a]
   * @returns {string} RGBA color string
   */
  static gradient(factor, color1, color2) {
    const r = MathUtils.lerp(color1[0], color2[0], factor);
    const g = MathUtils.lerp(color1[1], color2[1], factor);
    const b = MathUtils.lerp(color1[2], color2[2], factor);
    const a = color1[3] !== undefined && color2[3] !== undefined ?
              MathUtils.lerp(color1[3], color2[3], factor) : 1;
    return ColorUtils.rgba(r, g, b, a);
  }

  /**
   * Create a linear gradient
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x1 - Start x
   * @param {number} y1 - Start y
   * @param {number} x2 - End x
   * @param {number} y2 - End y
   * @param {Array} colors - Array of color stops [[position, color], ...]
   * @returns {CanvasGradient} Canvas gradient
   */
  static createLinearGradient(ctx, x1, y1, x2, y2, colors) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    colors.forEach(([position, color]) => {
      gradient.addColorStop(position, color);
    });
    return gradient;
  }

  /**
   * Create a radial gradient
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x1 - Center x
   * @param {number} y1 - Center y
   * @param {number} r1 - Start radius
   * @param {number} x2 - End center x
   * @param {number} y2 - End center y
   * @param {number} r2 - End radius
   * @param {Array} colors - Array of color stops [[position, color], ...]
   * @returns {CanvasGradient} Canvas gradient
   */
  static createRadialGradient(ctx, x1, y1, r1, x2, y2, r2, colors) {
    const gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
    colors.forEach(([position, color]) => {
      gradient.addColorStop(position, color);
    });
    return gradient;
  }

  /**
   * Generate random color within ranges
   * @param {Object} options - Color generation options
   * @param {Array} options.hueRange - Hue range [min, max]
   * @param {Array} options.satRange - Saturation range [min, max]
   * @param {Array} options.lightRange - Lightness range [min, max]
   * @param {number} options.alpha - Alpha value (0-1)
   * @returns {string} HSLA color string
   */
  static randomColor(options = {}) {
    const {
      hueRange = [0, 360],
      satRange = [50, 100],
      lightRange = [30, 70],
      alpha = 1
    } = options;

    const h = MathUtils.random(hueRange[0], hueRange[1]);
    const s = MathUtils.random(satRange[0], satRange[1]);
    const l = MathUtils.random(lightRange[0], lightRange[1]);

    return ColorUtils.hsla(h, s, l, alpha);
  }

  /**
   * Adjust color brightness
   * @param {string} color - Color string (hex, rgb, hsl)
   * @param {number} factor - Brightness factor (-1 to 1)
   * @returns {string} Adjusted color
   */
  static adjustBrightness(color, factor) {
    // Simple brightness adjustment for RGBA colors
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) {
        const r = MathUtils.clamp(parseInt(match[1]) * (1 + factor), 0, 255);
        const g = MathUtils.clamp(parseInt(match[2]) * (1 + factor), 0, 255);
        const b = MathUtils.clamp(parseInt(match[3]) * (1 + factor), 0, 255);
        const a = parseFloat(match[4]);
        return ColorUtils.rgba(r, g, b, a);
      }
    }
    return color;
  }

  /**
   * Adjust color saturation
   * @param {number} h - Hue
   * @param {number} s - Saturation
   * @param {number} l - Lightness
   * @param {number} factor - Saturation factor
   * @returns {string} Adjusted HSLA color
   */
  static adjustSaturation(h, s, l, factor) {
    const newSat = MathUtils.clamp(s + factor * 100, 0, 100);
    return ColorUtils.hsla(h, newSat, l);
  }

  /**
   * Get complementary color
   * @param {number} h - Hue
   * @param {number} s - Saturation
   * @param {number} l - Lightness
   * @returns {string} Complementary HSLA color
   */
  static complementary(h, s, l) {
    return ColorUtils.hsla((h + 180) % 360, s, l);
  }

  /**
   * Get analogous colors
   * @param {number} h - Hue
   * @param {number} s - Saturation
   * @param {number} l - Lightness
   * @param {number} count - Number of colors to generate
   * @returns {Array} Array of HSLA color strings
   */
  static analogous(h, s, l, count = 3) {
    const colors = [];
    const angle = 30; // 30 degrees apart

    for (let i = 0; i < count; i++) {
      const newHue = (h + (i - Math.floor(count / 2)) * angle + 360) % 360;
      colors.push(ColorUtils.hsla(newHue, s, l));
    }

    return colors;
  }

  /**
   * Get triadic colors
   * @param {number} h - Hue
   * @param {number} s - Saturation
   * @param {number} l - Lightness
   * @returns {Array} Array of 3 HSLA color strings
   */
  static triadic(h, s, l) {
    return [
      ColorUtils.hsla(h, s, l),
      ColorUtils.hsla((h + 120) % 360, s, l),
      ColorUtils.hsla((h + 240) % 360, s, l)
    ];
  }

  /**
   * Parse hex color to RGB
   * @param {string} hex - Hex color string (#RRGGBB or #RGB)
   * @returns {Object} RGB object {r, g, b}
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert RGB to hex
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {string} Hex color string
   */
  static rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

// Export for use in other modules
window.ColorUtils = ColorUtils;
