import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

/**
 * Initialize MediaPipe FaceMesh
 * @param {Function} onResults - Callback function when face mesh results are available
 * @returns {FaceMesh} FaceMesh instance
 */
// Global instance to prevent multiple initializations
let faceMeshInstance = null;

export function initFaceMesh(onResults) {
  // Return existing instance if available
  if (faceMeshInstance) {
    // Update the callback
    faceMeshInstance.onResults(onResults);
    return faceMeshInstance;
  }

  faceMeshInstance = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMeshInstance.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  faceMeshInstance.onResults(onResults);
  return faceMeshInstance;
}

// Function to close and reset the instance
export function closeFaceMesh() {
  if (faceMeshInstance) {
    faceMeshInstance.close();
    faceMeshInstance = null;
  }
}

/**
 * Process image with FaceMesh
 * @param {FaceMesh} faceMesh - FaceMesh instance
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} image - Image element to process
 */
export function processImage(faceMesh, image) {
  faceMesh.send({ image });
}

/**
 * Get landmark coordinates for earrings
 * Uses direct ear landmarks: 234 (left ear) and 454 (right ear)
 * @param {Array} landmarks - Face mesh landmarks array
 * @returns {Object} Object with leftEar and rightEar coordinates
 */
export function getEarringLandmarks(landmarks) {
  if (!landmarks || landmarks.length === 0) {
    return null;
  }

  // Use direct ear landmarks from MediaPipe FaceMesh
  const leftEar = landmarks[234]; // Left ear landmark
  const rightEar = landmarks[454]; // Right ear landmark

  if (!leftEar || !rightEar) {
    return null;
  }

  return {
    leftEar: {
      x: leftEar.x,
      y: leftEar.y,
      z: leftEar.z || 0
    },
    rightEar: {
      x: rightEar.x,
      y: rightEar.y,
      z: rightEar.z || 0
    }
  };
}

/**
 * Get landmark coordinates for glasses
 * @param {Array} landmarks - Face mesh landmarks array
 * @returns {Object} Object with eye and nose bridge coordinates
 */
export function getGlassesLandmarks(landmarks) {
  if (!landmarks || landmarks.length === 0) {
    return null;
  }

  // MediaPipe FaceMesh landmark indices
  // Left eye: landmark 33
  // Right eye: landmark 263
  // Nose bridge: landmark 168
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const noseBridge = landmarks[168];

  if (!leftEye || !rightEye || !noseBridge) {
    return null;
  }

  return {
    leftEye: {
      x: leftEye.x,
      y: leftEye.y,
      z: leftEye.z || 0
    },
    rightEye: {
      x: rightEye.x,
      y: rightEye.y,
      z: rightEye.z || 0
    },
    noseBridge: {
      x: noseBridge.x,
      y: noseBridge.y,
      z: noseBridge.z || 0
    }
  };
}

/**
 * Draw product overlay on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {HTMLImageElement} productImage - Product image to overlay (single PNG, no splitting)
 * @param {Array} landmarks - Face mesh landmarks
 * @param {String} category - Product category ('earrings' or 'glasses')
 * @param {Number} imageWidth - Original image width
 * @param {Number} imageHeight - Original image height
 */
export function drawProductOverlay(canvas, productImage, landmarks, category, imageWidth, imageHeight) {
  const ctx = canvas.getContext('2d');
  
  if (!landmarks || landmarks.length === 0) {
    console.log('No landmarks detected');
    return;
  }

  if (category === 'earrings') {
    // Ensure product image is loaded
    if (!productImage || !productImage.complete) {
      console.log('Earring image not loaded');
      return;
    }

    const earringLandmarks = getEarringLandmarks(landmarks);
    if (!earringLandmarks) {
      console.log('Earring landmarks not found');
      return;
    }

    // Get face width using distance between eye landmarks 33 (left) and 263 (right)
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    
    if (!leftEye || !rightEye) {
      console.log('Eye landmarks not found for scaling');
      return;
    }

    // Calculate face width (distance between eyes in pixels)
    const faceWidth = Math.sqrt(
      Math.pow((rightEye.x - leftEye.x) * canvas.width, 2) +
      Math.pow((rightEye.y - leftEye.y) * canvas.height, 2)
    );

    // Earring size = faceWidth × 0.25 (increased from 0.15 for larger earrings)
    const earringWidth = faceWidth * 0.50;

    // Get PNG image dimensions to preserve aspect ratio
    const imgWidth = productImage.naturalWidth || productImage.width || 1;
    const imgHeight = productImage.naturalHeight || productImage.height || 1;
    const aspectRatio = imgHeight / imgWidth;
    const earringHeight = earringWidth * aspectRatio;

    // Get ear positions (landmarks 234 and 454)
    const leftEarX = earringLandmarks.leftEar.x * canvas.width;
    const leftEarY = earringLandmarks.leftEar.y * canvas.height;
    const rightEarX = earringLandmarks.rightEar.x * canvas.width;
    const rightEarY = earringLandmarks.rightEar.y * canvas.height;

    // Slight vertical offset downward
    const verticalOffset = earringHeight * 0.1;

    // Draw left earring (use the same PNG image)
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(
      productImage,
      leftEarX - earringWidth / 2,
      leftEarY - earringHeight / 2 + verticalOffset,
      earringWidth,
      earringHeight
    );
    ctx.restore();

    // Draw right earring (use the same PNG image)
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(
      productImage,
      rightEarX - earringWidth / 2,
      rightEarY - earringHeight / 2 + verticalOffset,
      earringWidth,
      earringHeight
    );
    ctx.restore();
  } else if (category === 'glasses') {
    // Ensure product image is loaded
    if (!productImage || !productImage.complete) {
      console.log('Product image not loaded');
      return;
    }

    const glassesLandmarks = getGlassesLandmarks(landmarks);
    if (!glassesLandmarks) {
      console.log('Glasses landmarks not found');
      return;
    }

    // Calculate glasses position and rotation
    const leftEyeX = glassesLandmarks.leftEye.x * canvas.width;
    const leftEyeY = glassesLandmarks.leftEye.y * canvas.height;
    const rightEyeX = glassesLandmarks.rightEye.x * canvas.width;
    const rightEyeY = glassesLandmarks.rightEye.y * canvas.height;
    const noseBridgeX = glassesLandmarks.noseBridge.x * canvas.width;
    const noseBridgeY = glassesLandmarks.noseBridge.y * canvas.height;

    // Calculate eye distance for scaling
    const eyeDistance = Math.sqrt(
      Math.pow(rightEyeX - leftEyeX, 2) + Math.pow(rightEyeY - leftEyeY, 2)
    );
    
    // Glasses width = eye distance × 1.4
    const glassesWidth = eyeDistance * 1.4;
    
    // Preserve original PNG aspect ratio
    const imgWidth = productImage.naturalWidth || productImage.width || 1;
    const imgHeight = productImage.naturalHeight || productImage.height || 1;
    const originalAspectRatio = imgHeight / imgWidth;
    const glassesHeight = glassesWidth * originalAspectRatio;

    // Calculate angle for rotation (based on eye line)
    const angle = Math.atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX);
    
    // Center at nose bridge with slight vertical offset downward
    const verticalOffset = glassesHeight * 0.05;
    const centerX = noseBridgeX;
    const centerY = noseBridgeY + verticalOffset;

    // Draw glasses with full transparency support
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(
      productImage,
      -glassesWidth / 2,
      -glassesHeight / 2,
      glassesWidth,
      glassesHeight
    );
    ctx.restore();
  }
}

/**
 * Create a camera instance for video processing
 * @param {HTMLVideoElement} videoElement - Video element
 * @param {Object} options - Camera options
 * @returns {Camera} Camera instance
 */
export function createCamera(videoElement, options = {}) {
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      // This will be set by the caller
    },
    width: options.width || 640,
    height: options.height || 480
  });
  return camera;
}

