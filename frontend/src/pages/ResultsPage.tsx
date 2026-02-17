import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Map, List } from "lucide-react";

import { LanguageContext } from "../App";
import LanguageToggle from "../components/LanguageToggle";
import MarketCard from "../components/MarketCard";
import MarketMap from "../components/MarketMap";
import DetailModal from "../components/DetailModal";

import { CROPS_MOCK, VEHICLES_MOCK } from "../mock/mandiData";
import { CalculationResult, Market } from "../types/api";

interface ResultsPageProps {
  results: CalculationResult | null;
}

const translations = {
  hi: {
    back: "वापस जाएं",
  },
  en: {
    back: "Go Back",
  },
};

const ResultsPage: React.FC<ResultsPageProps> = ({ results }) => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const t = translations[language];

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const crop = results?.crop || CROPS_MOCK[0];
  const quantity = results?.quantity || 25;
  const vehicle = results?.vehicle || VEHICLES_MOCK[0];

  // 🚀 Fetch calculation from backend
  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/calculate",
          {
            quantity,
            vehicleRate: vehicle.cost_per_km,
            crop: crop.id,
            rideShare: false
          }
        );

        console.log("🔥 Backend Response:", response.data);

        if (response.data?.results) {
          setMarkets(response.data.results);
        }
      } catch (error) {
        console.error("Backend error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfit();
  }, [quantity, vehicle.cost_per_km, crop.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">
          Calculating best mandi…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <LanguageToggle />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-green-700 font-semibold mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.back}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === "hi" ? crop.name_hi : crop.name_en}
              </h2>
              <p className="text-base text-gray-600">
                {quantity} quintal
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-green-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-lg ${
                  viewMode === "map"
                    ? "bg-green-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-md mx-auto px-6 py-6">
        {viewMode === "list" ? (
          <div className="space-y-4">
            {markets.map((market, index) => (
              <MarketCard
                key={market.id}
                market={{
                  id: market.id,
                  name: market.name,
                  distance_km: market.distance,
                  price_per_quintal: market.price,
                  transport_cost: market.transportCost,
                  handling_cost: market.otherCost,
                  net_profit: market.netProfit,
                  profit_category:
                    market.rank === 1
                      ? "high"
                      : market.rank === 2
                      ? "medium"
                      : "low"
                }}
                index={index}
                onClick={() => setSelectedMarket(market)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[70vh] rounded-xl overflow-hidden shadow-lg">
            <MarketMap
              markets={markets}
              onMarkerClick={(market) =>
                setSelectedMarket(market)
              }
            />
          </div>
        )}
      </div>

      {/* Modal */}
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
