import React from 'react';
import { MapPin, Calendar, Edit3, Trash2, Eye, ToggleLeft, ToggleRight, Sprout, CheckCircle2 } from 'lucide-react';
import { getExactCropImage } from '../utils/cropImageRegistry';

export const ListingCard = ({ listing, currentUserId, onEdit, onDelete, onToggleStatus }) => {
  const isOwner = listing.farmerId === currentUserId;

  // Resolve exact crop photo matching the crop name (overriding drawing/invalid old preset URLs)
  const displayImage = (listing.imageUrl && !listing.imageUrl.includes('photo-1592924357228'))
    ? listing.imageUrl
    : getExactCropImage(listing.cropName);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Image & Status Overlay */}
      <div className="relative h-48 sm:h-52 bg-gray-100 overflow-hidden">
        <img
          src={displayImage}
          alt={listing.cropName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 ${
            listing.status === 'ACTIVE'
              ? 'bg-emerald-500 text-white'
              : listing.status === 'UNAVAILABLE'
              ? 'bg-gray-700 text-white'
              : 'bg-blue-600 text-white'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {listing.status}
          </span>
        </div>

        {/* Quantity Chip */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl">
          {listing.quantity?.toLocaleString()} {listing.unit}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{listing.cropName}</h3>
            <div className="text-right">
              <span className="text-2xl font-black text-farm-700">₹{listing.expectedPrice}</span>
              <span className="text-xs text-gray-500 font-semibold">/{listing.unit}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-1.5 text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-farm-600" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Harvest: {listing.availabilityDate}</span>
            </div>
          </div>

          {listing.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 bg-gray-50 p-2 rounded-xl">
              "{listing.description}"
            </p>
          )}
        </div>

        {/* Action Controls for Farmer Owner */}
        {isOwner && (
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onToggleStatus(listing.listingId, listing.status === 'ACTIVE' ? 'UNAVAILABLE' : 'ACTIVE')}
              className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all flex items-center gap-1 ${
                listing.status === 'ACTIVE'
                  ? 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100'
                  : 'border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              {listing.status === 'ACTIVE' ? (
                <>
                  <ToggleLeft className="w-4 h-4 text-amber-600" />
                  <span>Mark Unavailable</span>
                </>
              ) : (
                <>
                  <ToggleRight className="w-4 h-4 text-emerald-600" />
                  <span>Mark Active</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(listing)}
                className="p-2 text-gray-600 hover:text-farm-700 hover:bg-farm-50 rounded-xl transition-colors"
                title="Edit Listing"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(listing.listingId)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
