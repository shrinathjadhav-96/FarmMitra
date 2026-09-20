import React, { useState, useEffect } from 'react';
import { X, Send, ShoppingBag, IndianRupee, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export const MakeOfferModal = ({ isOpen, onClose, listing, onSubmitOffer }) => {
  if (!isOpen || !listing) return null;

  const [offerPrice, setOfferPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (listing) {
      setOfferPrice(listing.expectedPrice || '');
      setQuantity(listing.quantity || '');
      setMessage('Can arrange transport and immediate payment upon loading.');
    }
  }, [listing]);

  const totalValue = (Number(offerPrice) || 0) * (Number(quantity) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      listingId: listing.listingId,
      cropName: listing.cropName,
      farmerId: listing.farmerId,
      offerPrice: Number(offerPrice),
      quantity: Number(quantity),
      unit: listing.unit || 'kg',
      message
    };

    await onSubmitOffer(payload);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">Make an Offer</h2>
              <p className="text-xs text-blue-100 font-medium">Crop: {listing.cropName} • Farmer Location: {listing.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Reference Banner */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 font-semibold block">Farmer Expected Price</span>
              <span className="text-sm font-black text-blue-900">₹{listing.expectedPrice} /{listing.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 font-semibold block">Total Available</span>
              <span className="text-sm font-black text-blue-900">{listing.quantity?.toLocaleString()} {listing.unit}</span>
            </div>
          </div>

          {/* Offer Price Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
              1. Your Offer Price per {listing.unit} (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                required
                min="1"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="21"
                className="w-full pl-9 pr-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-base font-black text-blue-950"
              />
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
              2. Quantity You Want ({listing.unit}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              max={listing.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="800"
              className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-base font-black text-gray-900"
            />
          </div>

          {/* Message / Terms Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
              3. Message / Delivery & Payment Note
            </label>
            <textarea
              rows="2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Can arrange immediate truck pickup from farm."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-xs text-gray-700"
            ></textarea>
          </div>

          {/* Live Total Calculation Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white flex items-center justify-between shadow-md">
            <div>
              <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">Total Calculated Offer</p>
              <p className="text-xs text-emerald-100">{quantity || 0} {listing.unit} × ₹{offerPrice || 0}</p>
            </div>
            <p className="text-2xl font-black text-white">₹{totalValue.toLocaleString()}</p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            {submitting ? (
              <span>Sending Offer...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>SEND OFFER TO FARMER</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

