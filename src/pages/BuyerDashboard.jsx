import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import { offerService } from '../services/offerService';
import { BuyerListingCard } from '../components/BuyerListingCard';
import { CropDetailsModal } from '../components/CropDetailsModal';
import { DealCard } from '../components/DealCard';
import { Search, Filter, ShoppingBag, Handshake, Info, MapPin, Building, RotateCcw, CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react';

const BASE_CROPS = ['ALL', 'Tomato', 'Potato', 'Onion', 'Wheat', 'Rice', 'Soyabean', 'Cotton'];
const LOCATIONS_OPTIONS = ['ALL', 'Bidar', 'Mandya', 'Nashik', 'Karnataka'];

export const BuyerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'offers' | 'deals'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState('');
  const [minQuantity, setMinQuantity] = useState('');

  // Data States
  const [listings, setListings] = useState([]);
  const [allAvailableCropNames, setAllAvailableCropNames] = useState(BASE_CROPS);
  const [myOffers, setMyOffers] = useState([]);
  const [myDeals, setMyDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Toast States
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadBuyerData = async () => {
    setLoading(true);
    const [listingsRes, offersRes, dealsRes, unFilteredRes] = await Promise.all([
      apiClient.getListings({
        search: searchQuery,
        crop: selectedCrop,
        location: selectedLocation,
        maxPrice,
        minQuantity
      }),
      user ? offerService.getOffers({ buyerId: user.userId }) : Promise.resolve([]),
      user ? offerService.getDeals({ buyerId: user.userId }) : Promise.resolve([]),
      apiClient.getListings({}) // Fetch all to extract dynamic crop names
    ]);

    if (listingsRes.success) setListings(listingsRes.data);
    
    if (unFilteredRes.success && unFilteredRes.data) {
      const dynamicCrops = Array.from(new Set(unFilteredRes.data.map(item => item.cropName).filter(Boolean)));
      const combined = Array.from(new Set([...BASE_CROPS, ...dynamicCrops]));
      setAllAvailableCropNames(combined);
    }

    setMyOffers(offersRes);
    setMyDeals(dealsRes);
    setLoading(false);
  };

  useEffect(() => {
    loadBuyerData();
  }, [user, searchQuery, selectedCrop, selectedLocation, maxPrice, minQuantity]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCrop('ALL');
    setSelectedLocation('ALL');
    setMaxPrice('');
    setMinQuantity('');
  };

  const handleSubmitOffer = async (offerPayload) => {
    const fullPayload = {
      ...offerPayload,
      buyerId: user?.userId || 'usr_buyer_demo',
      buyerName: user?.name || 'Wholesale Agro Traders'
    };

    const res = await offerService.createOffer(fullPayload);
    if (res.success) {
      showToast('Offer Submitted Successfully to Farmer!');
      loadBuyerData();
      setActiveTab('offers');
    } else {
      alert(res.error || 'Failed to submit offer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Buyer Header Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 relative overflow-hidden border border-blue-800/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <ShoppingBag className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 backdrop-blur-md text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Verified Commercial Buyer
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Welcome, {user?.name || 'Buyer'}
              </h1>
              <p className="text-blue-200/80 text-xs sm:text-sm font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-blue-400" /> Location: {user?.location || 'Bengaluru, Karnataka'}
              </p>
            </div>
          </div>

          {/* Primary Action Button: FIND CROPS */}
          <div>
            <button
              onClick={() => setActiveTab('find')}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-lg px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3 active:scale-95 transform"
            >
              <Search className="w-6 h-6" />
              <span>FIND CROPS</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">Available Produce</p>
            <p className="text-xl font-black text-white mt-0.5">{listings.length} Active Crops</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">My Offers Sent</p>
            <p className="text-xl font-black text-white mt-0.5">{myOffers.length} Offers</p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <p className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">Deals Confirmed</p>
            <p className="text-xl font-black text-white mt-0.5">{myDeals.length} Deals</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-100/80 p-1.5 rounded-2xl flex max-w-md mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab('find')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'find'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Search className="w-4 h-4" />
          Find Crops ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          My Offers ({myOffers.length})
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'deals'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Handshake className="w-4 h-4" />
          Deals ({myDeals.length})
        </button>
      </div>

      {/* Find Crops Tab */}
      {activeTab === 'find' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crops or locations (e.g. Soyabean, Tomato, Bidar)..."
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Dynamic Crop Filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Crop Type</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold text-gray-800 outline-none"
                >
                  {allAvailableCropNames.map(c => (
                    <option key={c} value={c}>{c === 'ALL' ? 'All Crops' : c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold text-gray-800 outline-none"
                >
                  {LOCATIONS_OPTIONS.map(l => (
                    <option key={l} value={l}>{l === 'ALL' ? 'All Locations' : l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Min Quantity (kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-medium">Searching active farmer crop listings...</div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(item => (
                <BuyerListingCard
                  key={item.listingId}
                  listing={item}
                  onViewDetails={(listing) => {
                    setSelectedListing(listing);
                    setDetailsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-3">
              <Search className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900">No Crops Found</h3>
              <p className="text-xs text-gray-500">Try adjusting your filter search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* My Offers Tab */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          {myOffers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myOffers.map(offer => (
                <div key={offer.offerId} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">{offer.cropName} Harvest</h4>
                      <p className="text-xs text-gray-500">Sent on: {new Date(offer.createdAt).toLocaleDateString()}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      offer.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      offer.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl text-xs">
                    <div>
                      <span className="text-gray-400 font-bold block">Your Offer Price</span>
                      <span className="font-black text-blue-900 text-sm">₹{offer.offerPrice} /{offer.unit || 'kg'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">Requested Quantity</span>
                      <span className="font-black text-gray-900 text-sm">{offer.quantity?.toLocaleString()} {offer.unit || 'kg'}</span>
                    </div>
                  </div>

                  {offer.message && (
                    <p className="text-xs text-gray-600 italic bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                      "{offer.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <ShoppingBag className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">No Offers Placed Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                Go to <strong className="text-blue-700 font-bold">"Find Crops"</strong>, select a crop listing, and click <strong className="text-blue-700">"MAKE AN OFFER"</strong> to place a price bid.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          {myDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myDeals.map(deal => (
                <DealCard key={deal.dealId} deal={deal} userRole="BUYER" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <Handshake className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">No Confirmed Deals</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                When a farmer accepts your submitted offer, your binding deal record will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Crop Details Modal */}
      <CropDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        listing={selectedListing}
        onSubmitOffer={handleSubmitOffer}
      />
    </div>
  );
};
