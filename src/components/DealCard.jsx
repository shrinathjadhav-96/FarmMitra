import React from 'react';
import { Handshake, Calendar, ShieldCheck, MapPin, IndianRupee } from 'lucide-react';

export const DealCard = ({ deal, userRole }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-md p-6 space-y-4 relative overflow-hidden">
      {/* Background Icon */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
        <Handshake className="w-48 h-48 text-emerald-900" />
      </div>

      {/* Deal Header */}
      <div className="flex justify-between items-start border-b border-gray-100 pb-3">
        <div>
          <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-1">
            <Handshake className="w-3.5 h-3.5" /> Binding Deal Confirmed
          </span>
          <h3 className="text-2xl font-black text-gray-900">{deal.cropName} Harvest</h3>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 font-bold uppercase block">Total Agreed Deal Value</span>
          <span className="text-2xl font-black text-emerald-700">₹{deal.totalValue?.toLocaleString()}</span>
        </div>
      </div>

      {/* Deal Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/50 p-4 rounded-2xl text-xs border border-emerald-100">
        <div>
          <span className="text-gray-500 font-bold block">Agreed Price</span>
          <span className="text-base font-black text-emerald-950">₹{deal.agreedPrice} /{deal.unit || 'kg'}</span>
        </div>

        <div>
          <span className="text-gray-500 font-bold block">Agreed Quantity</span>
          <span className="text-base font-black text-emerald-950">{deal.quantity?.toLocaleString()} {deal.unit || 'kg'}</span>
        </div>

        <div>
          <span className="text-gray-500 font-bold block">Buyer</span>
          <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
            {deal.buyerName || 'Commercial Buyer'}
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          </span>
        </div>

        <div>
          <span className="text-gray-500 font-bold block">Farmer Seller</span>
          <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
            {deal.farmerName || 'Verified Farmer'}
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
        <span>Deal Reference ID: <strong className="font-mono text-gray-700">{deal.dealId}</strong></span>
        <span>Date: {new Date(deal.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

