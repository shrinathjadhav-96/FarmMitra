import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, ArrowUpRight, MessageSquare, Handshake } from 'lucide-react';

export const OfferComparisonView = ({ offers, expectedPrice, onAccept, onReject }) => {
  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-900">Side-by-Side Offer Comparison</h3>
          <p className="text-xs text-gray-500">
            Compare price bids from verified buyers. Target expected price: <strong className="text-farm-700">₹{expectedPrice}/kg</strong>
          </p>
        </div>
        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
          {offers.length} Competing Offers
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer, index) => {
          const isHigher = offer.offerPrice > expectedPrice;
          const priceDiff = offer.offerPrice - expectedPrice;
          const totalVal = offer.offerPrice * offer.quantity;

          return (
            <div
              key={offer.offerId}
              className={`bg-white rounded-3xl border-2 p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                offer.status === 'ACCEPTED'
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : offer.status === 'REJECTED'
                  ? 'border-gray-200 opacity-60'
                  : 'border-amber-200 hover:border-amber-300'
              }`}
            >
              {/* Header: Buyer Info & Price */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      Buyer #{index + 1}
                    </span>
                    <h4 className="text-lg font-black text-gray-900 flex items-center gap-1.5">
                      {offer.buyerName || 'Commercial Buyer'}
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        ✓ Verified Buyer
                      </span>
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-farm-900">₹{offer.offerPrice}</span>
                    <span className="text-xs font-bold text-gray-500">/{offer.unit || 'kg'}</span>

                    {/* Price Difference Indicator */}
                    <div className="text-[11px] font-bold mt-0.5">
                      {isHigher ? (
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                          <ArrowUpRight className="w-3 h-3" /> +₹{priceDiff} above target
                        </span>
                      ) : (
                        <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          Target matching
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Offer Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 bg-gray-50 p-3 rounded-2xl text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold block">Requested Quantity</span>
                    <span className="font-black text-gray-900 text-sm">{offer.quantity?.toLocaleString()} {offer.unit || 'kg'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block">Total Deal Value</span>
                    <span className="font-black text-emerald-700 text-sm">₹{totalVal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Buyer Message */}
                {offer.message && (
                  <div className="mt-3 flex items-start gap-1.5 text-xs text-gray-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="italic">"{offer.message}"</span>
                  </div>
                )}
              </div>

              {/* Actions or Status Badge */}
              <div className="pt-2 border-t border-gray-100">
                {offer.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAccept(offer)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACCEPT OFFER</span>
                    </button>
                    <button
                      onClick={() => onReject(offer)}
                      className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
                      offer.status === 'ACCEPTED'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {offer.status === 'ACCEPTED' && <Handshake className="w-4 h-4" />}
                      <span>Offer Status: {offer.status}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

