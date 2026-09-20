// FarmMitra — 100% Verified Crop Photo Registry
// Verified high-definition produce photography matching exact crop names

export const EXACT_CROP_IMAGES = {
  // Soyabean / Soybean (Verified Soybeans & Soy Pods)
  'soybean': 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800',
  'soyabean': 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800',
  'soya': 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800',

  // Tomatoes (Fresh Ripe Tomatoes)
  'tomato': 'https://images.unsplash.com/photo-1546470427-f5b9c4706c88?auto=format&fit=crop&q=80&w=800',
  'tomatoes': 'https://images.unsplash.com/photo-1546470427-f5b9c4706c88?auto=format&fit=crop&q=80&w=800',

  // Potatoes (Fresh Raw Potatoes)
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',
  'potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',

  // Onions (Red Onions)
  'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800',
  'onions': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800',

  // Wheat (Golden Wheat Grains)
  'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',

  // Rice & Paddy (Rice Grains)
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
  'paddy': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',

  // Cotton (Raw Cotton Harvest)
  'cotton': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800',

  // Chili & Red Pepper
  'chili': 'https://images.unsplash.com/photo-1588252303782-7ccb80fae961?auto=format&fit=crop&q=80&w=800',
  'chilli': 'https://images.unsplash.com/photo-1588252303782-7ccb80fae961?auto=format&fit=crop&q=80&w=800',

  // Sugarcane (Green Sugarcane Stalks)
  'sugarcane': 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800',
  'sugar cane': 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800',

  // Maize & Corn
  'maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800',

  // Groundnut & Peanut
  'groundnut': 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=800',
  'peanut': 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=800',

  // Garlic
  'garlic': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',

  // Pulses
  'pulses': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=800',
  'dal': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=800'
};

const DEFAULT_AGRICULTURE_PHOTO = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800';

// Match exact crop name to verified high-res photo
export const getExactCropImage = (cropNameInput) => {
  if (!cropNameInput) return DEFAULT_AGRICULTURE_PHOTO;
  const clean = cropNameInput.toLowerCase().trim();

  // 1. Direct match
  if (EXACT_CROP_IMAGES[clean]) {
    return EXACT_CROP_IMAGES[clean];
  }

  // 2. Word search match
  const keys = Object.keys(EXACT_CROP_IMAGES);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (clean === key || clean.includes(key) || key.includes(clean)) {
      return EXACT_CROP_IMAGES[key];
    }
  }

  return DEFAULT_AGRICULTURE_PHOTO;
};
