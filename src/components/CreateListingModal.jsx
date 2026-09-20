import React, { useState, useEffect } from 'react';
import { X, Sprout, MapPin, Locate, Upload, CheckCircle2, AlertCircle, Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import { getCurrentLocation } from '../services/locationService';
import { getExactCropImage } from '../utils/cropImageRegistry';

const INITIAL_CROPS = ['Tomato', 'Potato', 'Onion', 'Wheat', 'Rice', 'Soyabean', 'Cotton', 'Chili', 'Sugarcane', 'Maize', 'Groundnut', 'Garlic'];
const UNITS = ['kg', 'quintal', 'ton', 'crate', 'bag'];

export const CreateListingModal = ({ isOpen, onClose, onSave, editingListing = null, userLocation = '' }) => {
  if (!isOpen) return null;

  const [availableCrops, setAvailableCrops] = useState(INITIAL_CROPS);
  const [cropName, setCropName] = useState('');
  const [customCropInput, setCustomCropInput] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [location, setLocation] = useState(userLocation || 'Bidar, Karnataka');
  const [availabilityDate, setAvailabilityDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [imageUrl, setImageUrl] = useState(getExactCropImage('Tomato'));
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auto-assign exact photo matching the crop name
  const selectCrop = (selectedName) => {
    setCropName(selectedName);
    const matchedImage = getExactCropImage(selectedName);
    setImageUrl(matchedImage);
  };

  // Add custom crop type dynamically
  const handleAddCustomCrop = () => {
    if (!customCropInput.trim()) return;
    const formatted = customCropInput.trim();
    
    if (!availableCrops.some(c => c.toLowerCase() === formatted.toLowerCase())) {
      setAvailableCrops(prev => [...prev, formatted]);
    }

    selectCrop(formatted);
    setCustomCropInput('');
    setShowAddCustom(false);
  };

  useEffect(() => {
    if (editingListing) {
      setCropName(editingListing.cropName || '');
      setQuantity(editingListing.quantity || '');
      setUnit(editingListing.unit || 'kg');
      setExpectedPrice(editingListing.expectedPrice || '');
      setLocation(editingListing.location || '');
      setAvailabilityDate(editingListing.availabilityDate || '');
      setImageUrl(editingListing.imageUrl || getExactCropImage(editingListing.cropName));
      setDescription(editingListing.description || '');

      if (editingListing.cropName && !availableCrops.includes(editingListing.cropName)) {
        setAvailableCrops(prev => [...prev, editingListing.cropName]);
      }
    } else {
      selectCrop('Tomato');
      setQuantity('1000');
      setUnit('kg');
      setExpectedPrice('18');
      setLocation(userLocation || 'Bidar, Karnataka');
      setAvailabilityDate(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
      setDescription('Fresh organic harvest ready for direct buyer pickup.');
    }
  }, [editingListing, userLocation]);

  // Handle Auto Location detection
  const handleAutoLocation = async () => {
    setLocating(true);
    setLocError('');
    try {
      const locString = await getCurrentLocation();
      setLocation(locString);
    } catch (err) {
      setLocError(err.message || 'Location access denied');
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const finalImage = customImageUrl.trim() || imageUrl || getExactCropImage(cropName);

    const formData = {
      cropName: cropName.trim(),
      quantity: Number(quantity),
      unit,
      expectedPrice: Number(expectedPrice),
      location,
      availabilityDate,
      imageUrl: finalImage,
      description
    };

    await onSave(formData);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-farm-800 to-farm-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">{editingListing ? 'Edit Crop Listing' : 'Sell My Crop'}</h2>
              <p className="text-xs text-farm-100 font-medium">List any crop harvest & connect directly with verified buyers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Question 1: What crop are you selling? */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-black text-gray-900">
                1. What crop are you selling? <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddCustom(!showAddCustom)}
                className="text-xs font-bold text-farm-700 hover:text-farm-900 bg-farm-50 hover:bg-farm-100 px-3 py-1.5 rounded-xl border border-farm-200 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Other Crop Type
              </button>
            </div>

            {/* Custom Crop Add Field */}
            {showAddCustom && (
              <div className="flex gap-2 p-3 bg-farm-50/80 rounded-2xl border border-farm-200 animate-in fade-in">
                <input
                  type="text"
                  value={customCropInput}
                  onChange={(e) => setCustomCropInput(e.target.value)}
                  placeholder="e.g. Soyabean, Groundnut, Mustard, Castor..."
                  className="flex-1 px-3 py-2 text-xs font-bold border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomCrop}
                  className="bg-farm-600 hover:bg-farm-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  Add Crop
                </button>
              </div>
            )}

            {/* Crop Chips Grid */}
            <div className="flex flex-wrap gap-2">
              {availableCrops.map(crop => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => selectCrop(crop)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    cropName.toLowerCase() === crop.toLowerCase()
                      ? 'bg-farm-600 text-white border-farm-600 shadow-md scale-105'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            {/* Selected Crop Input */}
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => selectCrop(e.target.value)}
              placeholder="Or type custom crop name e.g. Soyabean"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-farm-500 outline-none text-sm font-bold text-farm-950 bg-white"
            />
          </div>

          {/* Exact Crop Image Preview */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-farm-600" /> Matched Produce Photo for "{cropName || 'Crop'}"
            </label>
            
            <div className="flex items-center gap-4">
              <div className="w-28 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-200 shrink-0">
                <img
                  src={customImageUrl.trim() || imageUrl || getExactCropImage(cropName)}
                  alt={cropName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Exact Match Photo
                </p>
                <p className="text-[11px] text-gray-500">Auto-assigned based on "{cropName}". Or enter custom URL below:</p>
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Paste custom photo URL (Optional)"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-farm-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Question 2 & 3: Quantity & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">
                2. How much do you have? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-farm-500 outline-none text-sm font-bold"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-2xl bg-gray-50 font-bold text-sm text-gray-700 outline-none"
                >
                  {UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">
                3. Expected price per {unit}? <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  placeholder="18"
                  className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-farm-500 outline-none text-sm font-bold text-farm-900"
                />
              </div>
            </div>
          </div>

          {/* Question 4: Where is the crop located? */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-black text-gray-900">
                4. Where is the crop located? <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAutoLocation}
                disabled={locating}
                className="text-xs font-bold text-farm-700 hover:text-farm-900 bg-farm-50 hover:bg-farm-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border border-farm-200"
              >
                {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Locate className="w-3.5 h-3.5" />}
                <span>{locating ? 'Detecting Location...' : '📍 Auto-Detect Location'}</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="District, State (e.g. Bidar, Karnataka)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-farm-500 outline-none text-sm font-medium"
              />
            </div>
            {locError && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> {locError}
              </p>
            )}
          </div>

          {/* Question 5: Availability Date */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-900">
              5. Harvest / Availability Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-farm-500 outline-none text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-900">
              Description / Quality Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Grade A fresh harvest, organic, direct pickup ready."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-farm-500 outline-none text-sm"
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-farm-600 hover:bg-farm-700 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              {submitting ? (
                <span>Publishing Crop...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>{editingListing ? 'Update Crop Listing' : 'Publish Crop Listing'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
