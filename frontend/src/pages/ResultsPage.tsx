import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import LanguageToggle from '../components/LanguageToggle';
import MarketCard from '../components/MarketCard';
import MarketMap from '../components/MarketMap';
import DetailModal from '../components/DetailModal';
import { ArrowLeft, Map, List } from 'lucide-react';
import { CalculationResult, Market } from '../types/api';

interface ResultsPageProps {
  results: CalculationResult | null;
}

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

const ResultsPage: React.FC<ResultsPageProps> = ({ results }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center" data-testid="no-results">
          <p className="text-xl text-gray-700 mb-4">{t.noResults}</p>
          <button
            data-testid="go-back-button"
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl"
          >
            {t.goBack}
          </button>
        </div>
      </div>
    );
  }

  const { crop, quantity, markets } = results;

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <LanguageToggle />

      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            data-testid="back-button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-700 font-semibold mb-3 hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.back}
          </button>

          <div className="flex items-center justify-between" data-testid="results-header">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'hi' ? crop.name_hi : crop.name_en}
              </h2>
              <p className="text-base text-gray-600">
                {quantity} {language === 'hi' ? 'क्विंटल' : 'quintal'}
              </p>
            </div>

            <div className="flex gap-2" data-testid="view-toggle">
              <button
                data-testid="list-view-button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                data-testid="map-view-button"
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map'
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
          <div className="space-y-4" data-testid="market-list">
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
          <div className="h-[70vh] rounded-xl overflow-hidden shadow-lg" data-testid="market-map">
            <MarketMap markets={markets} onMarkerClick={(market) => setSelectedMarket(market)} />
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