import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LanguageContext } from '../App';
import DetailModal from '../components/DetailModal';
import LanguageToggle from '../components/LanguageToggle';
import MarketCard from '../components/MarketCard';
import MarketMap from '../components/MarketMap';
import { CROPS_MOCK, MARKETS_MOCK, VEHICLES_MOCK } from '../mock/mandiData';
import { calculateProfit } from '../services/calculateApi';
import { CalculationResult, Market } from '../types/api';

interface ResultsPageProps {
  results: CalculationResult | null;
}

const translations = {
  hi: {
    back: 'वापस जाएं',
    bestOption: 'सबसे ज्यादा फायदा',
  },
  en: {
    back: 'Go Back',
    bestOption: 'Maximum Profit',
  },
};

const ResultsPage: React.FC<ResultsPageProps> = ({ results }) => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const t = translations[language];

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [markets, setMarkets] = useState<Market[]>(MARKETS_MOCK);
  const [loading, setLoading] = useState(true);

  const crop = results?.crop || CROPS_MOCK[0];
  const quantity = results?.quantity || 25;
  const vehicle = results?.vehicle || VEHICLES_MOCK[0];

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const data = await calculateProfit({
          quantity,
          vehicleRate: vehicle.cost_per_km,
          crop: crop.id,
          rideShare: false,
        });

        if (Array.isArray(data?.results)) {
          const normalizedMarkets: Market[] = data.results
            .map((item: any) => {
              const baseMarket = MARKETS_MOCK.find((market) => market.id === item.id);
              const rank = Number(item.rank ?? 999);

              return {
                id: item.id ?? baseMarket?.id ?? `market-${rank}`,
                name: item.name ?? baseMarket?.name ?? 'Unknown Market',
                lat: baseMarket?.lat ?? 28.6139,
                lng: baseMarket?.lng ?? 77.209,
                price_per_quintal: Number(item.price ?? baseMarket?.price_per_quintal ?? 0),
                distance_km: Number(item.distance ?? baseMarket?.distance_km ?? 0),
                transport_cost: Number(item.transportCost ?? baseMarket?.transport_cost ?? 0),
                handling_cost: Number(item.handlingCost ?? item.otherCost ?? baseMarket?.handling_cost ?? 0),
                net_profit: Number(item.netProfit ?? baseMarket?.net_profit ?? 0),
                profit_category: rank === 1 ? 'high' : rank === 2 ? 'medium' : 'low',
                projectedPrice3Day: Number(item.projectedPrice3Day ?? 0),
                projectedPrice5Day: Number(item.projectedPrice5Day ?? 0),
                risk: item.risk,
              };
            })
            .sort((first: Market, second: Market) => second.net_profit - first.net_profit);

          setMarkets(normalizedMarkets);
        }
      } catch (error) {
        console.error('Backend error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfit();
  }, [crop.id, quantity, vehicle.cost_per_km]);

  const bestMarket = markets.find((market) => market.profit_category === 'high');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Calculating best mandi…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <LanguageToggle />

      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-700 font-semibold mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.back}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'hi' ? crop.name_hi : crop.name_en}
              </h2>
              <p className="text-base text-gray-600">{quantity} quintal</p>
            </div>

            {bestMarket && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                ⭐ {t.bestOption}: {bestMarket.name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-2 gap-6">
        <div className="h-[70vh] rounded-xl overflow-hidden shadow-lg">
          <MarketMap markets={markets} onMarkerClick={(market) => setSelectedMarket(market)} />
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
          {markets.map((market, index) => (
            <div
              key={market.id}
              className={market.profit_category === 'high' ? 'ring-2 ring-green-500 rounded-xl' : ''}
            >
              <MarketCard
                market={market}
                index={index}
                onClick={() => setSelectedMarket(market)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedMarket && (
        <DetailModal
          market={selectedMarket}
          crop={crop}
          quantity={quantity}
          vehicle={vehicle}
          onClose={() => setSelectedMarket(null)}
        />
      )}
    </div>
  );
};

export default ResultsPage;