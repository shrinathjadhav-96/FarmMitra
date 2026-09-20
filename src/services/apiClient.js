// FarmMitra — Frontend API Client
// Connects React frontend to AWS API Gateway

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://v18jax5429.execute-api.ap-south-1.amazonaws.com";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
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
};

export const apiClient = {

  // GET /listings
  getListings: async (params = {}) => {
    try {
      const result = await request("/listings");

      let listings = result.listings || [];

      // Search
      if (params.search && params.search.trim() !== "") {
        const query = params.search.toLowerCase().trim();

        listings = listings.filter(item =>
          (item.cropName || "").toLowerCase().includes(query) ||
          (item.location || "").toLowerCase().includes(query)
        );
      }

      // Crop filter
      if (params.crop && params.crop !== "ALL") {
        listings = listings.filter(
          item =>
            (item.cropName || "").toLowerCase() ===
            params.crop.toLowerCase()
        );
      }

      // Location filter
      if (params.location && params.location !== "ALL") {
        listings = listings.filter(item =>
          (item.location || "")
            .toLowerCase()
            .includes(params.location.toLowerCase())
        );
      }

      // Price filter
      if (params.minPrice) {
        listings = listings.filter(
          item => Number(item.price ?? item.expectedPrice) >= Number(params.minPrice)
        );
      }

      if (params.maxPrice) {
        listings = listings.filter(
          item => Number(item.price ?? item.expectedPrice) <= Number(params.maxPrice)
        );
      }

      // Quantity filter
      if (params.minQuantity) {
        listings = listings.filter(
          item => Number(item.quantity) >= Number(params.minQuantity)
        );
      }

      return {
        success: true,
        data: listings
      };

    } catch (err) {
      console.error("API Gateway Error:", err);

      return {
        success: false,
        data: [],
        error: err.message
      };
    }
  },

  // Get one listing
  getListingById: async (listingId) => {
    try {
      const result = await request("/listings");

      const listings = result.listings || [];

      const item = listings.find(
        listing => listing.listingId === listingId
      );

      if (!item) {
        return {
          success: false,
          error: "Listing not found"
        };
      }

      return {
        success: true,
        data: item
      };

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
};