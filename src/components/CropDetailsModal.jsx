import React, { useState } from 'react';
import { X, MapPin, Calendar, Sprout, ShieldCheck, ShoppingBag, Send, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { MakeOfferModal } from './MakeOfferModal';

export const CropDetailsModal = ({ isOpen, onClose, listing, onSubmitOffer }) => {
  if (!isOpen || !listing) return null;

  const [makeOfferModalOpen, setMakeOfferModalOpen] = useState(false);

  const handleOfferSubmit = async (offerData) => {
    if (onSubmitOffer) {
      await onSubmitOffer(offerData);
    }
    setMakeOfferModalOpen(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
          {/* Header / Image Banner */}
          <div className="relative h-64 sm:h-72 bg-gray-900">
            <img
              src={listing.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'}
              alt={listing.cropName}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Status Badge on Image */}
            <div className="absolute bottom-4 left-6 right-6 text-white flex justify-between items-end">
              <div>
                <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  Active Crop Listing
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{listing.cropName}</h2>
                <p className="text-sm font-medium text-gray-200 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-400" /> {listing.location}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-emerald-300 font-bold uppercase">Expected Price</p>
                <p className="text-3xl font-black text-white">
                  ₹{listing.expectedPrice} <span className="text-xs font-semibold text-gray-300">/{listing.unit}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-farm-50/70 p-3.5 rounded-2xl border border-farm-100 text-center">
                <p className="text-[11px] font-bold text-farm-800 uppercase tracking-wider">Available Quantity</p>
                <p className="text-lg sm:text-xl font-black text-farm-950 mt-0.5">
                  {listing.quantity?.toLocaleString()} {listing.unit}
                </p>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 text-center">
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Total Value</p>
                <p className="text-lg sm:text-xl font-black text-amber-950 mt-0.5">
                  ₹{((listing.quantity || 0) * (listing.expectedPrice || 0)).toLocaleString()}
                </p>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Harvest Date</p>
                <p className="text-xs sm:text-sm font-black text-blue-950 mt-1">
                  {listing.availabilityDate}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">Crop Details & Quality Notes</h4>
              <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed border border-gray-100">
                {listing.description || 'Grade A produce harvested directly from local fields. Suitable for commercial wholesalers, processors, and retail chains.'}
              </div>
            </div>

            {/* Farmer Credential Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                  {listing.farmerName ? listing.farmerName.charAt(0) : 'F'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-gray-900">{listing.farmerName || 'Verified Farmer'}</h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-gray-500">{listing.location}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Verified Seller
              </span>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 font-semibold">Listing ID</p>
              <p className="text-xs font-mono font-bold text-gray-800">{listing.listingId}</p>
            </div>

            <button
              onClick={() => setMakeOfferModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-base sm:text-lg px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>MAKE AN OFFER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={makeOfferModalOpen}
        onClose={() => setMakeOfferModalOpen(false)}
        listing={listing}
        onSubmitOffer={handleOfferSubmit}
      />
    </>
  );
};
