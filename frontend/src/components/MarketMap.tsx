import { useEffect } from 'react';
import L from 'leaflet';
import { Market } from '../types/api';

interface MarketMapProps {
  markets: Market[];
  onMarkerClick: (market: Market) => void;
}

const MarketMap: React.FC<MarketMapProps> = ({ markets, onMarkerClick }) => {
  useEffect(() => {
    // Farmer location (MVP – Delhi)
    const farmerLat = 28.6139;
    const farmerLng = 77.2090;

    // Initialize map
    const map = L.map('market-map').setView([farmerLat, farmerLng], 6);

    // Base tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Farmer marker
    L.marker([farmerLat, farmerLng])
      .addTo(map)
      .bindPopup('Farmer Location');

    // Market markers + routes
    markets.forEach(async (market) => {
      if (!market.lat || !market.lng) return;

      const marker = L.marker([market.lat, market.lng])
        .addTo(map)
        .bindPopup(`<b>${market.name}</b><br/>Loading route...`)
        .on('click', () => onMarkerClick(market));

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${farmerLng},${farmerLat};${market.lng},${market.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        const route = data.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(1);

        // Update popup
        marker.setPopupContent(
          `<b>${market.name}</b><br/>Distance: ${distanceKm} km`
        );

        // Draw route polyline
        const routeCoords = route.geometry.coordinates.map(
          ([lng, lat]: number[]) => [lat, lng]
        );

        const polyline = L.polyline(routeCoords, {
          color: 'green',
          weight: 4,
          opacity: 0.7,
        }).addTo(map);

        // Zoom to route
        map.fitBounds(polyline.getBounds());
      } catch (error) {
        console.error('OSRM error:', error);
        marker.setPopupContent(
          `<b>${market.name}</b><br/>Route unavailable`
        );
      }
    });

    return () => {
      map.remove();
    };
  }, [markets, onMarkerClick]);

  return (
    <div
      id="market-map"
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default MarketMap;
