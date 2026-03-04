import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import LanguageToggle from '../components/LanguageToggle';
import MarketCard from '../components/MarketCard';
import MarketMap from '../components/MarketMap';
import DetailModal from '../components/DetailModal';
import { ArrowLeft } from 'lucide-react';
import { Market } from '../types/api';

// 🔗 imports
import { MARKETS_MOCK, CROPS_MOCK } from '../mock/mandiData';
import { getMandis } from '../services/mandiApi';

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

const ResultsPage: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const [markets, setMarkets] = useState<Market[]>(MARKETS_MOCK);
  const [loading, setLoading] = useState(true);

  const crop = CROPS_MOCK[0];
  const quantity = 25;

  // Fetch backend markets
  useEffect(() => {
    getMandis()
      .then((data) => {
        if (data?.markets?.length) {
          setMarkets(data.markets);
        }
      })
      .catch((err) => {
        console.warn('Backend not available, using mock data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Find best mandi
  const bestMarket = markets.find(
    (m) => m.profit_category === 'high'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading market data…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">

      <LanguageToggle />

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-700 font-semibold mb-3 hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.back}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'hi' ? crop.name_hi : crop.name_en}
              </h2>
              <p className="text-base text-gray-600">
                {quantity} {language === 'hi' ? 'क्विंटल' : 'quintal'}
              </p>
            </div>

            {bestMarket && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                ⭐ {t.bestOption}: {bestMarket.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN SPLIT LAYOUT */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-2 gap-6">

        {/* MAP SIDE */}
        <div className="h-[70vh] rounded-xl overflow-hidden shadow-lg">
          <MarketMap
            markets={markets}
            onMarkerClick={(market) => setSelectedMarket(market)}
          />
        </div>

        {/* MARKET LIST */}
        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
          {markets.map((market, index) => (
            <div
              key={market.id}
              className={
                market.profit_category === 'high'
                  ? 'ring-2 ring-green-500 rounded-xl'
                  : ''
              }
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

      {/* MODAL */}
      {selectedMarket && (
        <DetailModal
          market={selectedMarket}
          crop={crop}
          quantity={quantity}
          onClose={() => setSelectedMarket(null)}
        />
      )}

    </div>
  );
};

export default ResultsPage;