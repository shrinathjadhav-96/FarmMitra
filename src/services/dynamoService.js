// FARMITRA - AWS API Service
// React → API Gateway → Lambda → DynamoDB

import { getExactCropImage } from "../utils/cropImageRegistry";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://v18jax5429.execute-api.ap-south-1.amazonaws.com";

const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("FARMITRA API Error:", error);
    throw error;
  }
};

export const dynamoService = {

  // Get all listings with verified exact crop photo matching
  getListings: async (filter = {}) => {
    try {
      const data = await apiRequest(`${API_URL}/listings`);

      let listings = data.listings || [];

      // Ensure exact crop photo matching for every listing
      listings = listings.map(item => {
        const exactPhoto = getExactCropImage(item.cropName);
        const imageUrl = (!item.imageUrl || item.imageUrl.includes('photo-1592924357228'))
          ? exactPhoto
          : item.imageUrl;

        return {
          ...item,
          imageUrl
        };
      });

      if (filter.farmerId) {
        listings = listings.filter(
          item => item.farmerId === filter.farmerId
        );
      }

      if (filter.status) {
        listings = listings.filter(
          item => item.status === filter.status
        );
      }

      if (filter.search) {
        const search = filter.search.toLowerCase();

        listings = listings.filter(item =>
          (item.cropName || "").toLowerCase().includes(search) ||
          (item.location || "").toLowerCase().includes(search)
        );
      }

      return listings.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

    } catch (error) {
      console.error("Failed to fetch listings:", error);
      return [];
    }
  },

  // Create listing
  createListing: async (listingData) => {
    try {
      const exactPhoto = listingData.imageUrl || getExactCropImage(listingData.cropName);

      const data = await apiRequest(`${API_URL}/listings`, {
        method: "POST",
        body: JSON.stringify({
          ...listingData,
          imageUrl: exactPhoto,
          quantity: Number(listingData.quantity || 0),
          expectedPrice: Number(listingData.expectedPrice || 0)
        })
      });

      return {
        success: true,
        listing: data.listing
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete listing
  deleteListing: async (listingId) => {
    try {
      const data = await apiRequest(
        `${API_URL}/listings/${encodeURIComponent(listingId)}`,
        {
          method: "DELETE"
        }
      );

      return {
        success: true,
        ...data
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update listing
  updateListing: async (listingId, farmerId, updates) => {
    try {
      const exactPhoto = updates.imageUrl || (updates.cropName ? getExactCropImage(updates.cropName) : undefined);

      const data = await apiRequest(
        `${API_URL}/listings/${encodeURIComponent(listingId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...updates,
            farmerId,
            ...(exactPhoto ? { imageUrl: exactPhoto } : {})
          })
        }
      );

      return {
        success: true,
        listing: data.listing
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};