import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dynamoService } from '../services/dynamoService';
import { offerService } from '../services/offerService';
import { CreateListingModal } from '../components/CreateListingModal';
import { ListingCard } from '../components/ListingCard';
import { OfferComparisonView } from '../components/OfferComparisonView';
import { DealCard } from '../components/DealCard';
import { PlusCircle, Sprout, TrendingUp, Handshake, Info, MapPin, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'offers' | 'deals'

  // Data States
  const [listings, setListings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Toast States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Load farmer's listings, offers, and deals
  const loadFarmerData = async () => {
    if (!user) return;
    setLoading(true);

    const [userListings, userOffers, userDeals] = await Promise.all([
      dynamoService.getListings({ farmerId: user.userId }),
      offerService.getOffers({ farmerId: user.userId }),
      offerService.getDeals({ farmerId: user.userId })
    ]);

    setListings(userListings);
    setOffers(userOffers);
    setDeals(userDeals);
    setLoading(false);
  };

  useEffect(() => {
    loadFarmerData();
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Listing Handlers
  const handleSaveListing = async (formData) => {
    if (editingListing) {
      const res = await dynamoService.updateListing(editingListing.listingId, user.userId, formData);
      if (res.success) {
        showToast('Listing Updated Successfully');
        loadFarmerData();
      }
    } else {
      const res = await dynamoService.createListing({
        ...formData,
        farmerId: user.userId,
        farmerName: user.name,
        farmerPhone: user.phone
      });
      if (res.success) {
        showToast('Listing Created Successfully');
        loadFarmerData();
      }
    }
    setEditingListing(null);
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const res = await dynamoService.deleteListing(listingId, user.userId);
      if (res.success) {
        showToast('Listing Deleted');
        loadFarmerData();
      }
    }
  };

  const handleToggleStatus = async (listingId, newStatus) => {
    const res = await dynamoService.updateListing(listingId, user.userId, { status: newStatus });
    if (res.success) {
      showToast(`Listing status changed to ${newStatus}`);
      loadFarmerData();
    }
  };

  // Offer Decision Handlers
  const handleAcceptOffer = async (offerItem) => {
    const matchingListing = listings.find(l => l.listingId === offerItem.listingId);
    const res = await offerService.acceptOffer(offerItem.offerId, user.userId, matchingListing || {});

    if (res.success) {
      showToast('Offer Accepted! Direct Deal Created Successfully');
      loadFarmerData();
      setActiveTab('deals'); // Switch to deals tab to show confirmed deal!
    } else {
      alert(res.error || 'Failed to accept offer');
    }
  };

  const handleRejectOffer = async (offerItem) => {
    if (window.confirm('Are you sure you want to reject this buyer offer?')) {
      const res = await offerService.rejectOffer(offerItem.offerId, user.userId);
      if (res.success) {
        showToast('Offer Rejected');
        loadFarmerData();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Success Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Ronas IT Style Farmer Header Card */}
      <div className="bg-gradient-to-br from-farm-900 via-farm-800 to-farm-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-farm-950/20 relative overflow-hidden border border-farm-700/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sprout className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Farmer Account
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Welcome, {user?.name || 'Farmer'}
              </h1>
              <p className="text-farm-200/80 text-xs sm:text-sm font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-emerald-400" /> Location: {user?.location || 'Bidar, Karnataka'}
              </p>
            </div>
          </div>

          {/* Primary Action Button: SELL MY CROP */}
          <div>
            <button
              onClick={() => {
                setEditingListing(null);
                setModalOpen(true);
              }}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-farm-950 font-black text-lg px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-3 active:scale-95 transform"
            >
              <PlusCircle className="w-6 h-6" />
              <span>SELL MY CROP</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <p className="text-[11px] font-semibold text-farm-300 uppercase tracking-wider">My Active Listings</p>
            <p className="text-xl font-black text-white mt-0.5">
              {listings.filter(l => l.status === 'ACTIVE').length} Crops
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Buyer Offers Received</p>
            <p className="text-xl font-black text-white mt-0.5">
              {offers.length} Offers
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">Confirmed Deals</p>
            <p className="text-xl font-black text-white mt-0.5">
              {deals.length} Deals
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-100/80 p-1.5 rounded-2xl flex max-w-md mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'listings'
              ? 'bg-white text-farm-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sprout className="w-4 h-4" />
          My Listings ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-white text-farm-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Offers ({offers.length})
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'deals'
              ? 'bg-white text-farm-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Handshake className="w-4 h-4" />
          Deals ({deals.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'listings' && (
        <div>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading your listings...</div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(item => (
                <ListingCard
                  key={item.listingId}
                  listing={item}
                  currentUserId={user?.userId}
                  onEdit={(listing) => {
                    setEditingListing(listing);
                    setModalOpen(true);
                  }}
                  onDelete={handleDeleteListing}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <Sprout className="w-10 h-10 text-farm-600 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">No Crop Listings Published</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                Click <strong className="text-farm-700">"SELL MY CROP"</strong> above to publish your crop harvest.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Offers Received Tab (With Side-by-Side Comparison Engine) */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          {offers.length > 0 ? (
            <OfferComparisonView
              offers={offers}
              expectedPrice={18} // Benchmark target price for Tomato
              onAccept={handleAcceptOffer}
              onReject={handleRejectOffer}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <TrendingUp className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">No Buyer Offers Received Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                When commercial buyers find your crop listings and submit price bids, they will appear here side-by-side for comparison.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          {deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deals.map(deal => (
                <DealCard key={deal.dealId} deal={deal} userRole="FARMER" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <Handshake className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">No Confirmed Deals Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                When you accept a buyer's offer under the Offers tab, the binding deal record will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Listing Modal */}
      <CreateListingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveListing}
        editingListing={editingListing}
        userLocation={user?.location}
      />
    </div>
  );
};
