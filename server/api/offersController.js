// FarmMitra Backend — AWS Lambda Offer & Deal State Engine Controller

const offersController = {
  // POST /api/offers - Create new buyer offer
  createOffer: async (offerData) => {
    const { listingId, buyerId, buyerName, farmerId, offerPrice, quantity, message } = offerData;

    if (!listingId || !buyerId || !farmerId || !offerPrice || !quantity) {
      return { success: false, error: 'Missing required offer fields' };
    }

    const newOffer = {
      offerId: 'off_' + Math.random().toString(36).substring(2, 9),
      listingId,
      buyerId,
      buyerName: buyerName || 'Commercial Buyer',
      farmerId,
      offerPrice: Number(offerPrice),
      quantity: Number(quantity),
      message: message || '',
      status: 'PENDING', // 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { success: true, data: newOffer };
  },

  // POST /api/offers/:id/accept - Accept buyer offer and generate Deal
  acceptOffer: async (offerItem, listingItem) => {
    const newDeal = {
      dealId: 'dl_' + Math.random().toString(36).substring(2, 9),
      listingId: offerItem.listingId,
      offerId: offerItem.offerId,
      farmerId: offerItem.farmerId,
      farmerName: listingItem ? listingItem.farmerName : 'Ramesh Kumar',
      buyerId: offerItem.buyerId,
      buyerName: offerItem.buyerName || 'Commercial Buyer',
      cropName: listingItem ? listingItem.cropName : 'Tomato',
      agreedPrice: Number(offerItem.offerPrice),
      quantity: Number(offerItem.quantity),
      unit: listingItem ? listingItem.unit : 'kg',
      totalValue: Number(offerItem.offerPrice) * Number(offerItem.quantity),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      updatedOfferStatus: 'ACCEPTED',
      deal: newDeal
    };
  }
};

module.exports = offersController;

