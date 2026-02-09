import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import LanguageToggle from '../components/LanguageToggle';
import MarketCard from '../components/MarketCard';
import MarketMap from '../components/MarketMap';
import DetailModal from '../components/DetailModal';
import { ArrowLeft, Map, List } from 'lucide-react';
import { CalculationResult, Market } from '../types/api';

// 🔗 NEW imports
import { MARKETS_MOCK, CROPS_MOCK } from '../mock/mandiData';
import { getMandis } from '../services/mandiApi';

const translations = {
  hi: {
    back: 'वापस जाएं',
    bestOption: 'सबसे ज्यादा फायदा',
    showMap: 'नक्शा देखें',
    showList: 'सूची देखें',
    noResults: 'कोई परिणाम नहीं मिला',
    goBack: 'वापस जाएं',
  },
  en: {
    back: 'Go Back',
    bestOption: 'Maximum Profit',
    showMap: 'Show Map',
    showList: 'Show List',
    noResults: 'No results found',
    goBack: 'Go Back',
  },
};

const ResultsPage: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  // 🔥 Backend → Frontend bridge state
  const [markets, setMarkets] = useState<Market[]>(MARKETS_MOCK);
  const [loading, setLoading] = useState(true);

  // Static crop + quantity for MVP demo
  const crop = CROPS_MOCK[0];
  const quantity = 25;

  // 🔗 Fetch backend data
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

      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
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

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg ${
                  viewMode === 'map'
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {markets.map((market, index) => (
              <MarketCard
                key={market.id}
                market={market}
                index={index}
                onClick={() => setSelectedMarket(market)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[70vh] rounded-xl overflow-hidden shadow-lg">
            <MarketMap
              markets={markets}
              onMarkerClick={(market) => setSelectedMarket(market)}
            />
          </div>
        )}
      </div>

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
