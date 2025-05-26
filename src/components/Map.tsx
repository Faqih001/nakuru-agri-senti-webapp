
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmFraWlhaG1hZCIsImEiOiJjbTVzazM2ZXMxc3NxMnNvZmZrazFvMzd2In0.Ic7lbQR6L8C9WIm3CSnz8A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [36.0667, -0.3031], // Nakuru coordinates
      zoom: 12,
    });

    // Add marker for Nakuru office
    new mapboxgl.Marker({
      color: '#16a34a'
    })
    .setLngLat([36.0667, -0.3031])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        '<div class="p-2"><h3 class="font-semibold">AgriSenti Office</h3><p>Nakuru, Kenya</p></div>'
      )
    )
    .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
