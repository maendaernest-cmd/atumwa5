/**
 * main.js
 * Main application entry point for Particle Logo Reveal Engine
 */

// Global variables
let engine = null;
let currentColorMode = 'rainbow';

// DOM elements
let canvas, fpsDisplay, particleCount, memoryDisplay;
let generateBtn, playPauseBtn, resetBtn, exportBtn;
let textInput, svgInput, fontSelect;
let gravitySlider, windSlider, frictionSlider;
let speedSlider, trailSlider, bounceSlider;
let colorModeSelect, particleSizeSlider, glowSlider;
let presetButtons;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Get DOM elements
  getDOMElements();

  // Setup canvas
  setupCanvas();

  // Initialize particle engine
  initializeEngine();

  // Setup event listeners
  setupEventListeners();

  // Setup UI updates
  setupUIUpdates();

  // Hide loading screen and show main content
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
  }, 1000);

  console.log('Particle Logo Reveal Engine initialized');
}

function getDOMElements() {
  // Canvas and performance
  canvas = document.getElementById('particle-canvas');
  fpsDisplay = document.getElementById('fps-display');
  particleCount = document.getElementById('particle-count');
  memoryDisplay = document.getElementById('memory-display');

  // Action buttons
  generateBtn = document.getElementById('generate-btn');
  playPauseBtn = document.getElementById('play-pause-btn');
  resetBtn = document.getElementById('reset-btn');
  exportBtn = document.getElementById('export-btn');

  // Input elements
  textInput = document.getElementById('text-input');
  svgInput = document.getElementById('svg-input');
  fontSelect = document.getElementById('font-select');

  // Physics controls
  gravitySlider = document.getElementById('gravity-slider');
  windSlider = document.getElementById('wind-slider');
  frictionSlider = document.getElementById('friction-slider');

  // Animation controls
  speedSlider = document.getElementById('speed-slider');
  trailSlider = document.getElementById('trail-slider');
  bounceSlider = document.getElementById('bounce-slider');

  // Appearance controls
  colorModeSelect = document.getElementById('color-mode');
  particleSizeSlider = document.getElementById('particle-size');
  glowSlider = document.getElementById('glow-intensity');

  // Preset buttons
  presetButtons = document.querySelectorAll('.preset-btn');
}

function setupCanvas() {
  // Setup canvas for high DPI displays
  DPI.setupCanvas(canvas, canvas.clientWidth, canvas.clientHeight);

  // Handle window resize
  window.addEventListener('resize', () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    DPI.resizeCanvas(canvas, rect.width, rect.height);
    if (engine) {
      engine.resize(canvas.width, canvas.height);
    }
  });
}

function initializeEngine() {
  engine = new Engine(canvas, {
    maxParticles: 10000,
    enablePhysics: true,
    enableInput: true,
    enableRendering: true,
    autoStart: false,
    debug: false
  });

  // Setup engine callbacks
  engine.on('onPerformanceUpdate', updatePerformanceDisplay);

  console.log('Particle engine initialized');
}

function setupEventListeners() {
  // Generate button
  generateBtn.addEventListener('click', handleGenerate);

  // Play/pause button
  playPauseBtn.addEventListener('click', handlePlayPause);

  // Reset button
  resetBtn.addEventListener('click', handleReset);

  // Export button
  exportBtn.addEventListener('click', handleExport);

  // Input type change
  document.getElementById('input-type').addEventListener('change', handleInputTypeChange);

  // File input
  svgInput.addEventListener('change', handleSVGUpload);

  // Control sliders with real-time updates
  setupSliderListeners();

  // Color mode change
  colorModeSelect.addEventListener('change', handleColorModeChange);

  // Preset buttons
  presetButtons.forEach(button => {
    button.addEventListener('click', () => handlePresetClick(button.dataset.preset));
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown);
}

function setupSliderListeners() {
  const sliders = [
    { element: gravitySlider, display: 'gravity-value', property: 'gravity', subProperty: 'y' },
    { element: windSlider, display: 'wind-value', property: 'wind', subProperty: 'x' },
    { element: frictionSlider, display: 'friction-value', property: 'friction' },
    { element: speedSlider, display: 'speed-value', property: 'timeScale' },
    { element: trailSlider, display: 'trail-value', property: 'trail' },
    { element: bounceSlider, display: 'bounce-value', property: 'bounce' },
    { element: particleSizeSlider, display: 'size-value', property: 'size' },
    { element: glowSlider, display: 'glow-value', property: 'glow' }
  ];

  sliders.forEach(({ element, display, property, subProperty }) => {
    element.addEventListener('input', () => {
      const value = parseFloat(element.value);
      updateSliderDisplay(display, value);

      if (engine && engine.physics) {
        if (subProperty) {
          const currentValue = engine.physics[property] || {};
          currentValue[subProperty] = value;
          engine.physics.setParameters({ [property]: currentValue });
        } else {
          engine.physics.setParameters({ [property]: value });
        }
      }
    });
  });
}

function setupUIUpdates() {
  // Update performance display every second
  setInterval(updatePerformanceDisplay, 1000);
}

function handleGenerate() {
  if (!engine) return;

  generateBtn.classList.add('loading');
  generateBtn.disabled = true;

  const inputType = document.getElementById('input-type').value;

  try {
    if (inputType === 'text') {
      generateFromText();
    } else {
      generateFromSVG();
    }
  } catch (error) {
    console.error('Generation error:', error);
    showNotification('Error generating particles', 'error');
  } finally {
    generateBtn.classList.remove('loading');
    generateBtn.disabled = false;
  }
}

function generateFromText() {
  const text = textInput.value.trim();
  if (!text) {
    showNotification('Please enter some text', 'warning');
    return;
  }

  const options = {
    fontSize: 120,
    fontFamily: fontSelect.value,
    spacing: 2,
    quality: 1,
    size: parseFloat(particleSizeSlider.value),
    color: getCurrentColor(),
    glow: parseFloat(glowSlider.value),
    trailLength: Math.round(parseFloat(trailSlider.value) * 20)
  };

  const particles = engine.createTextParticles(text, options);
  showNotification(`Generated ${particles.length} particles from text`, 'success');

  if (!engine.isRunning) {
    engine.start();
  }
}

async function generateFromSVG() {
  const file = svgInput.files[0];
  if (!file) {
    showNotification('Please select an SVG file', 'warning');
    return;
  }

  try {
    const options = {
      scale: 1,
      spacing: 5,
      quality: 1,
      size: parseFloat(particleSizeSlider.value),
      color: getCurrentColor(),
      glow: parseFloat(glowSlider.value),
      trailLength: Math.round(parseFloat(trailSlider.value) * 20)
    };

    const particles = await engine.createSVGParticles(file, options);
    showNotification(`Generated ${particles.length} particles from SVG`, 'success');

    if (!engine.isRunning) {
      engine.start();
    }
  } catch (error) {
    console.error('SVG generation error:', error);
    showNotification('Error processing SVG file', 'error');
  }
}

function handlePlayPause() {
  if (!engine) return;

  if (engine.isRunning && !engine.isPaused) {
    engine.pause();
    playPauseBtn.innerHTML = '<span class="btn-icon">▶️</span><span id="play-text">Play</span>';
  } else {
    engine.resume();
    playPauseBtn.innerHTML = '<span class="btn-icon">⏸️</span><span id="play-text">Pause</span>';
  }
}

function handleReset() {
  if (!engine) return;

  engine.removeAllParticles();
  engine.physics.clearForceFields();
  resetControlsToDefaults();

  showNotification('Particles reset', 'info');
}

function handleExport() {
  if (!engine) return;

  exportBtn.classList.add('loading');
  exportBtn.disabled = true;

  try {
    // For now, export as PNG screenshot
    // GIF export would require additional libraries
    const dataURL = engine.renderer.screenshot('png');

    // Create download link
    const link = document.createElement('a');
    link.download = `particle-logo-${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    showNotification('Image exported successfully', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showNotification('Error exporting image', 'error');
  } finally {
    exportBtn.classList.remove('loading');
    exportBtn.disabled = false;
  }
}

function handleInputTypeChange(event) {
  const inputType = event.target.value;
  const textGroup = document.getElementById('text-input-group');
  const svgGroup = document.getElementById('svg-input-group');

  if (inputType === 'text') {
    textGroup.classList.remove('hidden');
    svgGroup.classList.add('hidden');
  } else {
    textGroup.classList.add('hidden');
    svgGroup.classList.remove('hidden');
  }
}

function handleSVGUpload(event) {
  const file = event.target.files[0];
  if (file && file.type === 'image/svg+xml') {
    // File is valid, ready for generation
  } else {
    showNotification('Please select a valid SVG file', 'error');
    event.target.value = '';
  }
}

function handleColorModeChange(event) {
  currentColorMode = event.target.value;
  // Color mode affects new particle generation
}

function handlePresetClick(presetName) {
  if (!engine) return;

  // Highlight selected preset
  presetButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');

  // Apply preset
  engine.applyPreset(presetName, getPresetOptions(presetName));
  showNotification(`Applied ${presetName} preset`, 'info');
}

function getPresetOptions(presetName) {
  const baseOptions = {
    gravity: parseFloat(gravitySlider.value),
    wind: parseFloat(windSlider.value),
    strength: 100,
    chaos: 5
  };

  switch (presetName) {
    case 'explosion':
      return { ...baseOptions, strength: 300, chaos: 20 };
    case 'rain':
      return { ...baseOptions, gravity: 15, windStrength: 20 };
    case 'fireworks':
      return { ...baseOptions, gravity: 12 };
    case 'galaxy':
      return { ...baseOptions, attraction: 80, rotation: 40 };
    case 'wave':
      return { ...baseOptions };
    case 'spiral':
      return { ...baseOptions, strength: 50, attraction: 20 };
    default:
      return baseOptions;
  }
}

function handleKeyDown(event) {
  // Keyboard shortcuts
  switch (event.key.toLowerCase()) {
    case ' ':
      event.preventDefault();
      handlePlayPause();
      break;
    case 'r':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleReset();
      }
      break;
    case 'g':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleGenerate();
      }
      break;
    case 'e':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleExport();
      }
      break;
  }
}

function getCurrentColor() {
  // Return color based on current mode
  switch (currentColorMode) {
    case 'gradient':
      return ColorUtils.rgba(0, 212, 255, 1);
    case 'rainbow':
      return ColorUtils.rainbow(Math.random());
    case 'mono':
      return '#ffffff';
    case 'fire':
      return ColorUtils.fire(Math.random());
    case 'ocean':
      return ColorUtils.ocean(Math.random());
    default:
      return '#00d4ff';
  }
}

function updateSliderDisplay(displayId, value) {
  const display = document.getElementById(displayId);
  if (display) {
    if (typeof value === 'number') {
      if (value < 1 && value > 0) {
        display.textContent = value.toFixed(2);
      } else if (value < 10 && value % 1 !== 0) {
        display.textContent = value.toFixed(1);
      } else {
        display.textContent = Math.round(value);
      }
    } else {
      display.textContent = value;
    }
  }
}

function updatePerformanceDisplay(stats) {
  if (stats) {
    fpsDisplay.textContent = Math.round(stats.fps || 0);
    particleCount.textContent = stats.particleCount || 0;
    memoryDisplay.textContent = engine ? engine.getMemoryUsage() : '0MB';
  }
}

function resetControlsToDefaults() {
  // Reset sliders to default values
  gravitySlider.value = '9.8';
  windSlider.value = '0';
  frictionSlider.value = '0.99';
  speedSlider.value = '1';
  trailSlider.value = '0.1';
  bounceSlider.value = '0.8';
  particleSizeSlider.value = '3';
  glowSlider.value = '10';

  // Update displays
  updateSliderDisplay('gravity-value', 9.8);
  updateSliderDisplay('wind-value', 0);
  updateSliderDisplay('friction-value', 0.99);
  updateSliderDisplay('speed-value', 1);
  updateSliderDisplay('trail-value', 0.1);
  updateSliderDisplay('bounce-value', 0.8);
  updateSliderDisplay('size-value', 3);
  updateSliderDisplay('glow-value', 10);

  // Reset color mode
  colorModeSelect.value = 'gradient';
  currentColorMode = 'gradient';

  // Clear preset highlights
  presetButtons.forEach(btn => btn.classList.remove('active'));
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add('show'), 10);

  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add notification styles dynamically
const notificationStyles = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  }

  .notification.show {
    transform: translateX(0);
  }

  .notification-info {
    background: #00d4ff;
  }

  .notification-success {
    background: #00ff88;
  }

  .notification-warning {
    background: #ffaa00;
  }

  .notification-error {
    background: #ff4444;
  }
`;

// Inject notification styles
const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

// Initialize with default text when page loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (textInput.value && engine) {
      handleGenerate();
    }
  }, 1500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (engine) {
    engine.destroy();
  }
});

console.log('Particle Logo Reveal Engine - Main application loaded');
