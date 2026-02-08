import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import { IndianRupee, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Market } from '../types/api';

interface MarketCardProps {
  market: Market;
  index: number;
  onClick: () => void;
}

const translations = {
  hi: {
    profit: 'फायदा',
    perQuintal: 'प्रति क्विंटल',
    distance: 'दूरी',
    km: 'किमी',
    tapDetails: 'जानकारी के लिए टैप करें',
  },
  en: {
    profit: 'Profit',
    perQuintal: 'per quintal',
    distance: 'Distance',
    km: 'km',
    tapDetails: 'Tap for details',
  },
};

const MarketCard: React.FC<MarketCardProps> = ({ market, index, onClick }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const getBorderColor = () => {
    if (market.profit_category === 'high') return 'border-green-600';
    if (market.profit_category === 'medium') return 'border-orange-500';
    return 'border-red-500';
  };

  const getProfitIcon = () => {
    if (market.profit_category === 'high') return <TrendingUp className="w-6 h-6" />;
    if (market.profit_category === 'medium') return <Minus className="w-6 h-6" />;
    return <TrendingDown className="w-6 h-6" />;
  };

  const getTextColor = () => {
    if (market.profit_category === 'high') return 'text-green-700';
    if (market.profit_category === 'medium') return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div
      data-testid={`market-card-${index}`}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md border-2 ${getBorderColor()} p-5 cursor-pointer hover:shadow-xl transition-all active:scale-98 animate-slide-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800" data-testid={`market-name-${index}`}>
            {market.name}
          </h3>
          <p className="text-sm text-gray-600" data-testid={`market-distance-${index}`}>
            {t.distance}: {market.distance_km} {t.km}
          </p>
        </div>
        <div className={`${getTextColor()}`}>{getProfitIcon()}</div>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t.profit}</p>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-6 h-6 text-green-700" strokeWidth={3} />
              <span className="text-3xl font-bold text-green-700" data-testid={`market-profit-${index}`}>
                {Math.round(market.net_profit).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          {index === 0 && (
            <div className="bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full" data-testid="best-badge">
              {language === 'hi' ? '✨ सर्वश्रेष्ठ' : '✨ BEST'}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3" data-testid={`tap-details-${index}`}>
        {t.tapDetails}
      </p>
    </div>
  );
};

export default MarketCard;