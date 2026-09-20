// FarmMitra Backend — DynamoDB Database Store Interface

const STORAGE_KEY = 'farmmitra_crop_listings';

const INITIAL_DEMO_LISTINGS = [
  {
    listingId: 'lst_tomato_bidar_001',
    farmerId: 'usr_farmer_demo',
    farmerName: 'Ramesh Kumar',
    cropName: 'Tomato',
    quantity: 1000,
    unit: 'kg',
    expectedPrice: 18,
    location: 'Bidar, Karnataka',
    availabilityDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    description: 'Fresh A-grade farm tomatoes harvested from Bidar farm. Direct pickup available.',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    listingId: 'lst_potato_mandya_002',
    farmerId: 'usr_farmer_demo_2',
    farmerName: 'Suresh Gowda',
    cropName: 'Potato',
    quantity: 2500,
    unit: 'kg',
    expectedPrice: 22,
    location: 'Mandya, Karnataka',
    availabilityDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',
    description: 'Organic grade Kufri Jyoti potatoes available in bulk.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    listingId: 'lst_onion_nashik_003',
    farmerId: 'usr_farmer_demo_3',
    farmerName: 'Anil Patil',
    cropName: 'Onion',
    quantity: 5000,
    unit: 'kg',
    expectedPrice: 28,
    location: 'Nashik, Maharashtra',
    availabilityDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800',
    description: 'Red onion harvest ready for wholesale buyers.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const dynamoService = {
  getListings: async (filter = {}) => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      let listings = raw ? JSON.parse(raw) : INITIAL_DEMO_LISTINGS;
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LISTINGS));
      }
      if (filter.status) {
        listings = listings.filter(item => item.status === filter.status);
      }
      return listings;
    }
    return INITIAL_DEMO_LISTINGS;
  }
};

module.exports = { dynamoService };

