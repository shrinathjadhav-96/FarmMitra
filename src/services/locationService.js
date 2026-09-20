// FarmMitra — Auto Location & Geolocation Service
// Requests browser location permission and resolves District & State

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Trigger native browser permission prompt
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Perform reverse geocoding via OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();

          if (data && data.address) {
            const district = data.address.state_district || data.address.county || data.address.city || data.address.town || 'District';
            const state = data.address.state || 'Karnataka';
            const locationString = `${district}, ${state}`;
            resolve(locationString);
          } else {
            resolve(`${latitude.toFixed(2)}° N, ${longitude.toFixed(2)}° E`);
          }
        } catch (err) {
          // Fallback if reverse geocoding API is unreachable
          resolve('Bidar, Karnataka');
        }
      },
      (error) => {
        let msg = 'Unable to retrieve location';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please enter location manually.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

