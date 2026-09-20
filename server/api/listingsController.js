// FarmMitra — Serverless Backend Controller: Listings
// Amazon API Gateway & AWS Lambda Endpoint Logic

const { dynamoService } = require('./dynamoBackendStore');

const listingsController = {
  // GET /api/listings - Retrieve active crop listings with optional search & filters
  getAllListings: async (req, res) => {
    try {
      const { search, crop, location, minPrice, maxPrice, minQuantity } = req.query;

      // Fetch active listings from database layer
      let listings = await dynamoService.getListings({ status: 'ACTIVE' });

      // Apply Search (Crop Name or Location)
      if (search && search.trim() !== '') {
        const query = search.toLowerCase().trim();
        listings = listings.filter(item => 
          item.cropName.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        );
      }

      // Apply Filters
      if (crop && crop !== 'ALL') {
        listings = listings.filter(item => item.cropName.toLowerCase() === crop.toLowerCase());
      }

      if (location && location !== 'ALL') {
        listings = listings.filter(item => item.location.toLowerCase().includes(location.toLowerCase()));
      }

      if (minPrice) {
        listings = listings.filter(item => item.expectedPrice >= Number(minPrice));
      }

      if (maxPrice) {
        listings = listings.filter(item => item.expectedPrice <= Number(maxPrice));
      }

      if (minQuantity) {
        listings = listings.filter(item => item.quantity >= Number(minQuantity));
      }

      // Security: Sanitize output to prevent exposing private user credentials
      const sanitizedListings = listings.map(item => ({
        listingId: item.listingId,
        farmerId: item.farmerId,
        farmerName: item.farmerName || 'Verified Farmer',
        cropName: item.cropName,
        quantity: item.quantity,
        unit: item.unit,
        expectedPrice: item.expectedPrice,
        location: item.location,
        availabilityDate: item.availabilityDate,
        imageUrl: item.imageUrl,
        description: item.description,
        status: item.status,
        createdAt: item.createdAt
      }));

      return res.status(200).json({
        success: true,
        count: sanitizedListings.length,
        data: sanitizedListings
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/listings/:id - Retrieve single listing by ID
  getListingById: async (req, res) => {
    try {
      const { id } = req.params;
      const listings = await dynamoService.getListings({});
      const item = listings.find(l => l.listingId === id);

      if (!item) {
        return res.status(404).json({ success: false, error: 'Crop listing not found' });
      }

      // Security check: Only active listings visible to public buyers
      if (item.status !== 'ACTIVE') {
        return res.status(403).json({ success: false, error: 'This listing is no longer active' });
      }

      const sanitizedItem = {
        listingId: item.listingId,
        farmerId: item.farmerId,
        farmerName: item.farmerName || 'Verified Farmer',
        cropName: item.cropName,
        quantity: item.quantity,
        unit: item.unit,
        expectedPrice: item.expectedPrice,
        location: item.location,
        availabilityDate: item.availabilityDate,
        imageUrl: item.imageUrl,
        description: item.description,
        status: item.status,
        createdAt: item.createdAt
      };

      return res.status(200).json({ success: true, data: sanitizedItem });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

module.exports = listingsController;

