
import React from 'react';

const GoogleMap = () => {
  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDPgttFbKx3V_mzD-UMAV0fWHDyU-QBk3c&q=Nakuru,Kenya&zoom=12`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <h3 className="font-semibold text-green-800 text-sm">AgriSenti Office</h3>
        <p className="text-xs text-green-600">Nakuru, Kenya</p>
      </div>
    </div>
  );
};

export default GoogleMap;
