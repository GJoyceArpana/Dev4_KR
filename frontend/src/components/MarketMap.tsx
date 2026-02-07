import React, { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LanguageContext } from '../App';
import { IndianRupee } from 'lucide-react';
import { Market } from '../types/api';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MarketMapProps {
  markets: Market[];
  onMarkerClick: (market: Market) => void;
}

const translations = {
  hi: {
    profit: 'फायदा',
    distance: 'दूरी',
    km: 'किमी',
  },
  en: {
    profit: 'Profit',
    distance: 'Distance',
    km: 'km',
  },
};

const MarketMap: React.FC<MarketMapProps> = ({ markets, onMarkerClick }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const center: [number, number] = markets.length > 0 ? [markets[0].lat, markets[0].lng] : [28.6139, 77.209];

  const createCustomIcon = (profitCategory: string) => {
    const colors: Record<string, string> = {
      high: '#15803d',
      medium: '#d97706',
      low: '#dc2626',
    };

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${colors[profitCategory]};
          border: 3px solid #ffffff;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          font-size: 20px;
        ">
          ₹
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const getCircleColor = (profitCategory: string) => {
    if (profitCategory === 'high') return '#15803d';
    if (profitCategory === 'medium') return '#d97706';
    return '#dc2626';
  };

  return (
    <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }} data-testid="leaflet-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markets.map((market, index) => (
        <React.Fragment key={market.id}>
          <Circle
            center={[market.lat, market.lng]}
            radius={market.distance_km * 50}
            pathOptions={{
              color: getCircleColor(market.profit_category),
              fillColor: getCircleColor(market.profit_category),
              fillOpacity: 0.1,
              weight: 1,
            }}
          />

          <Marker
            position={[market.lat, market.lng]}
            icon={createCustomIcon(market.profit_category)}
            eventHandlers={{
              click: () => onMarkerClick(market),
            }}
          >
            <Popup>
              <div className="text-center" data-testid={`popup-${index}`}>
                <h3 className="font-bold text-base mb-2">{market.name}</h3>
                <div className="flex items-center justify-center gap-1 text-green-700 font-bold">
                  <IndianRupee className="w-4 h-4" />
                  <span>{Math.round(market.net_profit).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {t.distance}: {market.distance_km} {t.km}
                </p>
              </div>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default MarketMap;