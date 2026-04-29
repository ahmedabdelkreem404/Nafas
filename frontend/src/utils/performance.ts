/**
 * Performance utilities for 3D rendering optimization
 */

export interface DeviceCapabilities {
  tier: number;
  isMobile: boolean;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  enableAdvanced3D: boolean;
  particleCount: number;
  shadowQuality: number;
  targetFPS: number;
}

/**
 * Detect device capabilities for 3D rendering
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const supportsWebGL2 = !!canvas.getContext('webgl2');

  let maxTextureSize = 2048;
  if (gl) {
    maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }

  // Determine tier based on device characteristics
  let tier = 1; // Low-end
  
  if (!isMobile && maxTextureSize >= 8192) {
    tier = 3; // High-end desktop
  } else if (!isMobile && maxTextureSize >= 4096) {
    tier = 2; // Mid-range desktop
  } else if (isMobile && maxTextureSize >= 4096) {
    tier = 2; // High-end mobile
  }

  // Configure based on tier
  const enableAdvanced3D = tier >= 2;
  const particleCount = tier === 3 ? 200 : tier === 2 ? 100 : 50;
  const shadowQuality = tier === 3 ? 2048 : tier === 2 ? 1024 : 512;
  const targetFPS = isMobile ? 30 : 60;

  return {
    tier,
    isMobile,
    supportsWebGL2,
    maxTextureSize,
    enableAdvanced3D,
    particleCount,
    shadowQuality,
    targetFPS,
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Measure current FPS
 */
export const measureFPS = (): Promise<number> => {
  return new Promise((resolve) => {
    const lastTime = performance.now();
    let frames = 0;
    const duration = 1000; // Measure for 1 second

    const measureFrame = (currentTime: number) => {
      frames++;
      const elapsed = currentTime - lastTime;

      if (elapsed >= duration) {
        const fps = Math.round((frames * 1000) / elapsed);
        resolve(fps);
      } else {
        requestAnimationFrame(measureFrame);
      }
    };

    requestAnimationFrame(measureFrame);
  });
};

/**
 * Check if device has good GPU
 */
export const hasGoodGPU = (): boolean => {
  const capabilities = detectDeviceCapabilities();
  return capabilities.tier >= 2 && !capabilities.isMobile;
};

/**
 * Get optimal canvas DPR based on device
 */
export const getOptimalDPR = (): [number, number] => {
  const capabilities = detectDeviceCapabilities();
  
  if (capabilities.tier === 3) {
    return [1, 2]; // High quality
  } else if (capabilities.tier === 2) {
    return [1, 1.5]; // Medium quality
  } else {
    return [1, 1]; // Low quality
  }
};

/**
 * Check if 3D should be enabled
 */
export const should3DBeEnabled = (): boolean => {
  if (prefersReducedMotion()) {
    return false;
  }

  const capabilities = detectDeviceCapabilities();
  
  // Enable 3D on desktop or high-end mobile
  return !capabilities.isMobile || capabilities.tier >= 2;
};

/**
 * Get performance config for 3D rendering
 */
export interface PerformanceConfig {
  enableShadows: boolean;
  enableParticles: boolean;
  enableAdvancedMaterials: boolean;
  particleCount: number;
  shadowMapSize: number;
  dpr: [number, number];
  antialias: boolean;
}

export const getPerformanceConfig = (): PerformanceConfig => {
  const capabilities = detectDeviceCapabilities();
  const reducedMotion = prefersReducedMotion();

  return {
    enableShadows: !capabilities.isMobile && !reducedMotion,
    enableParticles: !reducedMotion,
    enableAdvancedMaterials: capabilities.enableAdvanced3D && !reducedMotion,
    particleCount: reducedMotion ? 0 : capabilities.particleCount,
    shadowMapSize: capabilities.shadowQuality,
    dpr: getOptimalDPR(),
    antialias: capabilities.tier >= 2,
  };
};

/**
 * Log performance info to console
 */
export const logPerformanceInfo = async () => {
  const capabilities = detectDeviceCapabilities();
  const config = getPerformanceConfig();
  const fps = await measureFPS();

  console.group('🎨 3D Performance Info');
  console.log('Device Tier:', capabilities.tier);
  console.log('Is Mobile:', capabilities.isMobile);
  console.log('WebGL2 Support:', capabilities.supportsWebGL2);
  console.log('Max Texture Size:', capabilities.maxTextureSize);
  console.log('Current FPS:', fps);
  console.log('Config:', config);
  console.groupEnd();
};
