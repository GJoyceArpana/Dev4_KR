import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import { CalculationResult, Language } from './types/api';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'hi',
  setLanguage: () => {},
});

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('hi');
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<HomePage setCalculationResults={setCalculationResults} />}
            />
            <Route
              path="/results"
              element={<ResultsPage results={calculationResults} />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;