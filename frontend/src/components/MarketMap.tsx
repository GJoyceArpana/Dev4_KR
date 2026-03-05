import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Market } from '../types/api';

interface MarketMapProps {
  markets: Market[];
  onMarkerClick: (market: Market) => void;
}

const bestMandiIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const normalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const MarketMap: React.FC<MarketMapProps> = ({ markets, onMarkerClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const [farmerLocation, setFarmerLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
  });

  // Create map only once
  useEffect(() => {
    const map = L.map('market-map').setView(
      [farmerLocation.lat, farmerLocation.lng],
      6
    );

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);

    // Click map to change farmer location
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      setFarmerLocation({ lat, lng });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update routes when farmer location changes
  useEffect(() => {
    const map = mapRef.current;
    const routeLayer = routeLayerRef.current;

    if (!map || !routeLayer) return;

    routeLayer.clearLayers();

    // Farmer marker
    L.marker([farmerLocation.lat, farmerLocation.lng])
      .addTo(routeLayer)
      .bindPopup('Farmer Location');

    const bestMarket = markets.find(
      (m) => m.profit_category === 'high'
    );

    markets.forEach(async (market) => {
      const markerIcon =
        market.profit_category === 'high' ? bestMandiIcon : normalIcon;

      const marker = L.marker([market.lat, market.lng], {
        icon: markerIcon,
      })
        .addTo(routeLayer)
        .bindPopup(market.name)
        .on('click', () => onMarkerClick(market));

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${farmerLocation.lng},${farmerLocation.lat};${market.lng},${market.lat}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        const route = data.routes[0];

        const routeCoords = route.geometry.coordinates.map(
          ([lng, lat]: number[]) => [lat, lng]
        );

        const isBest = bestMarket?.id === market.id;

        L.polyline(routeCoords, {
          color: isBest ? '#FFD700' : 'green',
          weight: isBest ? 6 : 4,
        }).addTo(routeLayer);

      } catch (err) {
        console.error('Routing error', err);
      }
    });

  }, [farmerLocation, markets, onMarkerClick]);

  return (
    <div
      id="market-map"
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
};

export default MarketMap;