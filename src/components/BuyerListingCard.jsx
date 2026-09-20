import React from 'react';
import { MapPin, Calendar, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { getExactCropImage } from '../utils/cropImageRegistry';

export const BuyerListingCard = ({ listing, onViewDetails }) => {
  const displayImage = (listing.imageUrl && !listing.imageUrl.includes('photo-1592924357228'))
    ? listing.imageUrl
    : getExactCropImage(listing.cropName);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Image & Price Overlay */}
      <div className="relative h-48 sm:h-52 bg-gray-900 overflow-hidden">
        <img
          src={displayImage}
          alt={listing.cropName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Location Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{listing.location}</span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-emerald-500 text-white font-black px-3.5 py-1.5 rounded-2xl shadow-lg text-sm">
          ₹{listing.expectedPrice} <span className="text-[10px] font-semibold">/{listing.unit}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{listing.cropName}</h3>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {listing.quantity?.toLocaleString()} {listing.unit}
            </span>
          </div>

          <div className="space-y-1 text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seller: {listing.farmerName || 'Verified Farmer'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Available: {listing.availabilityDate}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onViewDetails(listing)}
            className="w-full bg-gray-900 hover:bg-blue-600 text-white text-xs font-bold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600"
          >
            <span>View Crop Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
