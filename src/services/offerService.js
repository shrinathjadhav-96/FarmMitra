// FarmMitra — Offers & Deals Storage Service with Amazon SNS Notifications Integration

import { notificationService } from './notificationService';

const OFFERS_KEY = 'farmmitra_offers';
const DEALS_KEY = 'farmmitra_deals';

const DEMO_OFFERS = [
  {
    offerId: 'off_buyer_a_001',
    listingId: 'lst_tomato_bidar_001',
    cropName: 'Tomato',
    buyerId: 'usr_buyer_demo',
    buyerName: 'Wholesale Agro Traders',
    farmerId: 'usr_farmer_demo',
    offerPrice: 19,
    quantity: 500,
    unit: 'kg',
    message: 'Can arrange truck pickup from Bidar market tomorrow morning.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    offerId: 'off_buyer_b_002',
    listingId: 'lst_tomato_bidar_001',
    cropName: 'Tomato',
    buyerId: 'usr_buyer_supermarket',
    buyerName: 'FreshSupermarket Ltd',
    farmerId: 'usr_farmer_demo',
    offerPrice: 21,
    quantity: 800,
    unit: 'kg',
    message: 'Immediate digital payment upon loading at Bidar farm.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

export const offerService = {
  getOffers: async (filter = {}) => {
    try {
      const raw = localStorage.getItem(OFFERS_KEY);
      let offers = raw ? JSON.parse(raw) : DEMO_OFFERS;
      if (!raw) {
        localStorage.setItem(OFFERS_KEY, JSON.stringify(DEMO_OFFERS));
      }

      if (filter.farmerId) {
        offers = offers.filter(o => o.farmerId === filter.farmerId);
      }
      if (filter.buyerId) {
        offers = offers.filter(o => o.buyerId === filter.buyerId);
      }
      if (filter.listingId) {
        offers = offers.filter(o => o.listingId === filter.listingId);
      }

      return offers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      return [];
    }
  },

  // Event 1: Buyer sends offer -> Triggers Amazon SNS notification to Farmer
  createOffer: async (offerData) => {
    try {
      const raw = localStorage.getItem(OFFERS_KEY);
      const offers = raw ? JSON.parse(raw) : DEMO_OFFERS;

      const newOffer = {
        offerId: 'off_' + Math.random().toString(36).substring(2, 9),
        listingId: offerData.listingId,
        cropName: offerData.cropName || 'Crop',
        buyerId: offerData.buyerId,
        buyerName: offerData.buyerName || 'Commercial Buyer',
        farmerId: offerData.farmerId,
        offerPrice: Number(offerData.offerPrice),
        quantity: Number(offerData.quantity),
        unit: offerData.unit || 'kg',
        message: offerData.message || '',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      offers.unshift(newOffer);
      localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));

      // Trigger Amazon SNS Notification to Farmer
      await notificationService.createNotification({
        recipientUserId: offerData.farmerId,
        eventType: 'OFFER_RECEIVED',
        message: `New offer received! ${offerData.buyerName || 'A buyer'} offered ₹${offerData.offerPrice}/${offerData.unit || 'kg'} for your ${offerData.cropName || 'crop'} (${offerData.quantity} ${offerData.unit || 'kg'}).`,
        metadata: { offerId: newOffer.offerId, listingId: offerData.listingId }
      });

      return { success: true, offer: newOffer };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Event 2: Farmer accepts offer -> Triggers Amazon SNS notification to Buyer
  acceptOffer: async (offerId, farmerId, listingDetails = {}) => {
    try {
      const rawOffers = localStorage.getItem(OFFERS_KEY);
      let offers = rawOffers ? JSON.parse(rawOffers) : DEMO_OFFERS;

      const offerIndex = offers.findIndex(o => o.offerId === offerId);
      if (offerIndex === -1) throw new Error('Offer not found');

      const targetOffer = offers[offerIndex];
      if (targetOffer.farmerId !== farmerId) throw new Error('Unauthorized');

      targetOffer.status = 'ACCEPTED';
      targetOffer.updatedAt = new Date().toISOString();
      offers[offerIndex] = targetOffer;
      localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));

      // Create Deal record
      const rawDeals = localStorage.getItem(DEALS_KEY);
      const deals = rawDeals ? JSON.parse(rawDeals) : [];

      const newDeal = {
        dealId: 'dl_' + Math.random().toString(36).substring(2, 9),
        listingId: targetOffer.listingId,
        offerId: targetOffer.offerId,
        farmerId: targetOffer.farmerId,
        farmerName: listingDetails.farmerName || 'Ramesh Kumar',
        buyerId: targetOffer.buyerId,
        buyerName: targetOffer.buyerName,
        cropName: targetOffer.cropName || listingDetails.cropName || 'Tomato',
        agreedPrice: targetOffer.offerPrice,
        quantity: targetOffer.quantity,
        unit: targetOffer.unit || 'kg',
        totalValue: Number(targetOffer.offerPrice) * Number(targetOffer.quantity),
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      };

      deals.unshift(newDeal);
      localStorage.setItem(DEALS_KEY, JSON.stringify(deals));

      // Trigger Amazon SNS Notification to Buyer
      await notificationService.createNotification({
        recipientUserId: targetOffer.buyerId,
        eventType: 'OFFER_ACCEPTED',
        message: `Your offer of ₹${targetOffer.offerPrice}/${targetOffer.unit || 'kg'} for ${targetOffer.cropName} has been ACCEPTED! Direct deal confirmed.`,
        metadata: { dealId: newDeal.dealId, offerId: targetOffer.offerId }
      });

      return { success: true, deal: newDeal, offer: targetOffer };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Event 3: Farmer rejects offer -> Triggers Amazon SNS notification to Buyer
  rejectOffer: async (offerId, farmerId) => {
    try {
      const rawOffers = localStorage.getItem(OFFERS_KEY);
      let offers = rawOffers ? JSON.parse(rawOffers) : DEMO_OFFERS;

      const offerIndex = offers.findIndex(o => o.offerId === offerId);
      if (offerIndex === -1) throw new Error('Offer not found');

      const targetOffer = offers[offerIndex];
      if (targetOffer.farmerId !== farmerId) throw new Error('Unauthorized');

      targetOffer.status = 'REJECTED';
      targetOffer.updatedAt = new Date().toISOString();
      offers[offerIndex] = targetOffer;
      localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));

      // Trigger Amazon SNS Notification to Buyer
      await notificationService.createNotification({
        recipientUserId: targetOffer.buyerId,
        eventType: 'OFFER_REJECTED',
        message: `Your offer of ₹${targetOffer.offerPrice}/${targetOffer.unit || 'kg'} for ${targetOffer.cropName} was rejected by the farmer.`,
        metadata: { offerId: targetOffer.offerId }
      });

      return { success: true, offer: targetOffer };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  getDeals: async (filter = {}) => {
    try {
      const raw = localStorage.getItem(DEALS_KEY);
      let deals = raw ? JSON.parse(raw) : [];

      if (filter.farmerId) {
        deals = deals.filter(d => d.farmerId === filter.farmerId);
      }
      if (filter.buyerId) {
        deals = deals.filter(d => d.buyerId === filter.buyerId);
      }

      return deals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      return [];
    }
  }
};
