
import React from 'react';

const GoogleMap = () => {
  // Get Google Maps API key from environment variables
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Don't render the map if API key is not configured
  if (!googleMapsApiKey) {
    return (
      <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="font-semibold text-gray-600 mb-2">Map Unavailable</h3>
          <p className="text-sm text-gray-500">Google Maps API key not configured</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=Nakuru,Kenya&zoom=12`}
        title="AgriSenti Office Location in Nakuru, Kenya"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg w-full h-full border-0"
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <h3 className="font-semibold text-green-800 text-sm">AgriSenti Office</h3>
        <p className="text-xs text-green-600">Nakuru, Kenya</p>
      </div>
    </div>
  );
};

export default GoogleMap;
