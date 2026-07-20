import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

/**
 * Initializes the MobileNet model if not already loaded.
 */
export const initializeModel = async () => {
  if (model) return model;
  
  try {
    // Ensure TF backend is ready (defaults to webgl in browser)
    await tf.ready();
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0
    });
    console.log('✅ AI Image Model Loaded');
    return model;
  } catch (err) {
    console.error('❌ Failed to load AI model:', err);
    throw err;
  }
};

/**
 * Whitelist of keywords that indicate an image is related to real estate/interiors.
 */
const PROPERTY_KEYWORDS = [
  'building', 'house', 'dwelling', 'home', 'residence', 'apartment', 'condo',
  'room', 'interior', 'living room', 'dining room', 'bedroom', 'kitchen', 'bathroom',
  'washbasin', 'toilet', 'tub', 'shower', 'furniture', 'cabinet', 'couch', 'sofa',
  'bed', 'desk', 'table', 'chair', 'patio', 'balcony', 'porch', 'pool', 'swimming pool',
  'hotel', 'suite', 'lobby', 'hallway', 'corridor', 'staircase', 'window', 'door',
  'curtain', 'rug', 'carpet', 'floor', 'ceiling', 'wall', 'brickwork', 'masonry',
  'garden', 'yard', 'lawn', 'garage', 'barn', 'shed', 'shelter', 'roof', 'facade',
  'skyscraper', 'palace', 'castle', 'estate', 'villa', 'cottage', 'bungalow',
  'attic', 'basement', 'loft', 'studio', 'penthouse', 'log cabin', 'mobile home',
  'warehouse', 'storefront', 'shop', 'store', 'shoppe', 'office', 'factory', 'plant', 
  'industrial', 'workshop', 'laboratory', 'clinic', 'retail', 'showroom', 
  'restaurant', 'cafe', 'bar', 'library', 'classroom', 'gym', 'theater', 'stadium'
];

/**
 * Analyzes an image file and returns true if it likely depicts a property or room.
 * @param {File} file - The image file to analyze.
 * @returns {Promise<{isValid: boolean, predictions: Array}>}
 */
export const analyzeImage = async (file) => {
  try {
    const net = await initializeModel();
    
    // Create an image element to feed into the model
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Run prediction
    const predictions = await net.classify(img);
    
    // Clean up
    URL.revokeObjectURL(url);

    // Check if any prediction matches our whitelist
    const isValid = predictions.some(p => {
      const className = p.className.toLowerCase();
      return PROPERTY_KEYWORDS.some(keyword => className.includes(keyword));
    });

    return {
      isValid,
      predictions
    };
  } catch (err) {
    console.error('AI Analysis Error:', err);
    // If AI fails, we default to true to not block the user, but log the error
    return { isValid: true, predictions: [] };
  }
};
