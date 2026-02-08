import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import LanguageToggle from '../components/LanguageToggle';
import { Tractor, Scale, MapPin } from 'lucide-react';
import { CROPS_MOCK, CALCULATION_RESULT_MOCK } from '../mock/mandiData';
import { CalculationResult } from '../types/api';

interface HomePageProps {
  setCalculationResults: (results: CalculationResult) => void;
}

const translations = {
  hi: {
    title: 'कृषि-रूट',
    subtitle: 'जानिए कहाँ बेचने पर होगा ज्यादा फायदा',
    selectCrop: 'अपनी फसल चुनें',
    enterQuantity: 'मात्रा (क्विंटल)',
    location: 'आपकी लोकेशन',
    calculateButton: 'सबसे ज्यादा फायदा देखें',
    loading: 'गणना हो रही है...',
    quantityPlaceholder: 'जैसे: 20',
    cropPlaceholder: 'फसल चुनें',
  },
  en: {
    title: 'Krishi-Route',
    subtitle: 'Find where to sell for maximum profit',
    selectCrop: 'Select Your Crop',
    enterQuantity: 'Quantity (Quintal)',
    location: 'Your Location',
    calculateButton: 'Show Maximum Profit',
    loading: 'Calculating...',
    quantityPlaceholder: 'e.g., 20',
    cropPlaceholder: 'Choose crop',
  },
};

const HomePage: React.FC<HomePageProps> = ({ setCalculationResults }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();

  const [selectedCrop, setSelectedCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (!selectedCrop || !quantity) {
      alert(language === 'hi' ? 'कृपया सभी जानकारी भरें' : 'Please fill all details');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const selectedCropData = CROPS_MOCK.find((c) => c.id === selectedCrop);
      const result: CalculationResult = {
        ...CALCULATION_RESULT_MOCK,
        crop: selectedCropData || CROPS_MOCK[0],
        quantity: parseFloat(quantity),
      };
      
      setCalculationResults(result);
      setLoading(false);
      navigate('/results');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 relative">
      <LanguageToggle />

      <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
        <div className="text-center mb-8" data-testid="home-header">
          <div className="flex items-center justify-center mb-4">
            <Tractor className="w-12 h-12 text-green-700" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2" data-testid="app-title">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium" data-testid="app-subtitle">
            {t.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 animate-slide-up" data-testid="input-form">
          <div data-testid="crop-selection">
            <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3">
              <Tractor className="w-6 h-6 text-green-700" />
              {t.selectCrop}
            </label>
            <select
              data-testid="crop-selector"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full h-14 text-lg px-4 rounded-lg border-2 border-gray-300 focus:border-green-600 focus:outline-none bg-white"
            >
              <option value="">{t.cropPlaceholder}</option>
              {CROPS_MOCK.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {language === 'hi' ? crop.name_hi : crop.name_en}
                </option>
              ))}
            </select>
          </div>

          <div data-testid="quantity-input">
            <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3">
              <Scale className="w-6 h-6 text-green-700" />
              {t.enterQuantity}
            </label>
            <input
              data-testid="quantity-field"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t.quantityPlaceholder}
              className="w-full h-14 text-lg px-4 rounded-lg border-2 border-gray-300 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div data-testid="location-display">
            <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3">
              <MapPin className="w-6 h-6 text-green-700" />
              {t.location}
            </label>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-base text-gray-700">
                📍 {language === 'hi' ? 'दिल्ली क्षेत्र' : 'Delhi Region'}
              </p>
            </div>
          </div>

          <button
            data-testid="calculate-button"
            onClick={handleCalculate}
            disabled={loading || !selectedCrop || !quantity}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg w-full text-xl transition-all active:scale-95"
          >
            {loading ? t.loading : t.calculateButton}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600" data-testid="info-footer">
          <p>{language === 'hi' ? '💚 आपके फायदे के लिए' : '💚 For Your Profit'}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;