import React, { useContext } from 'react';
import { LanguageContext } from '../App';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className="fixed top-4 right-4 z-50" data-testid="language-toggle">
      <button
        data-testid="language-button"
        onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
        className="bg-white border-2 border-green-700 text-green-800 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-50 transition-all active:scale-95"
      >
        {language === 'hi' ? 'English' : 'हिंदी'}
      </button>
    </div>
  );
};

export default LanguageToggle;