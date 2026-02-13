import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import { X, IndianRupee, Truck, Package, TrendingUp } from 'lucide-react';
import { Market, Crop, Vehicle } from '../types/api';

interface DetailModalProps {
  market: Market;
  crop: Crop;
  quantity: number;
  vehicle?: Vehicle;
  onClose: () => void;
}

const translations = {
  hi: {
    details: 'पूरी जानकारी',
    marketPrice: 'मंडी भाव',
    perQuintal: 'प्रति क्विंटल',
    transportCost: 'ट्रांसपोर्ट खर्च',
    handlingCost: 'हैंडलिंग खर्च',
    totalCost: 'कुल खर्च',
    netProfit: 'शुद्ध फायदा',
    distance: 'दूरी',
    km: 'किमी',
    vehicle: 'वाहन',
  },
  en: {
    details: 'Complete Details',
    marketPrice: 'Market Price',
    perQuintal: 'per quintal',
    transportCost: 'Transport Cost',
    handlingCost: 'Handling Cost',
    totalCost: 'Total Cost',
    netProfit: 'Net Profit',
    distance: 'Distance',
    km: 'km',
    vehicle: 'Vehicle',
  },
};

const DetailModal: React.FC<DetailModalProps> = ({ market, crop, quantity, vehicle, onClose }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const totalMarketValue = market.price_per_quintal * quantity;
  const totalCost = market.transport_cost + market.handling_cost;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in"
      onClick={onClose}
      data-testid="detail-modal-overlay"
    >
      <div
        className="bg-white rounded-t-3xl max-w-md w-full p-6 animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="detail-modal"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800" data-testid="modal-title">
            {t.details}
          </h2>
          <button
            data-testid="close-modal-button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4" data-testid="market-info">
          <h3 className="text-xl font-bold text-gray-800">{market.name}</h3>
          <p className="text-sm text-gray-600">
            {t.distance}: {market.distance_km} {t.km}
          </p>
          {vehicle && (
            <p className="text-sm text-gray-600">
              {t.vehicle}: {vehicle.icon} {language === 'hi' ? vehicle.name_hi : vehicle.name_en} (₹{vehicle.cost_per_km}/{t.km})
            </p>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-200" data-testid="market-price">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-700" />
              <span className="text-base font-medium text-gray-700">{t.marketPrice}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-800 font-semibold">
              <IndianRupee className="w-4 h-4" />
              <span>{totalMarketValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200" data-testid="transport-cost">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600" />
              <span className="text-base font-medium text-gray-700">{t.transportCost}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 font-semibold">
              <span>-</span>
              <IndianRupee className="w-4 h-4" />
              <span>{market.transport_cost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200" data-testid="handling-cost">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              <span className="text-base font-medium text-gray-700">{t.handlingCost}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 font-semibold">
              <span>-</span>
              <IndianRupee className="w-4 h-4" />
              <span>{market.handling_cost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200" data-testid="total-cost">
            <span className="text-base font-bold text-gray-700">{t.totalCost}</span>
            <div className="flex items-center gap-1 text-red-600 font-bold">
              <span>-</span>
              <IndianRupee className="w-4 h-4" />
              <span>{totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 text-white" data-testid="net-profit">
          <p className="text-base mb-2 font-medium">{t.netProfit}</p>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-8 h-8" strokeWidth={3} />
            <span className="text-4xl font-bold">{Math.round(market.net_profit).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;