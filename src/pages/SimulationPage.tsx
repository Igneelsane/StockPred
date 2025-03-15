import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import StockChart from '../components/StockChart';
import PredictionModelSelector from '../components/PredictionModelSelector';
import { getAllPredictions } from '../services/predictionService';
import { Info, AlertCircle, SplitSquareHorizontal, Maximize2, Minimize2, HelpCircle } from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  data: any[];
}

const SimulationPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedScenario, setSelectedScenario] = useState<string>('bullMarket');
  const [timeframe, setTimeframe] = useState<number>(180); // days
  const [volatility, setVolatility] = useState<number>(50);
  const [selectedModel, setSelectedModel] = useState('linearRegression');
  const [predictionDays, setPredictionDays] = useState(30);
  const [predictions, setPredictions] = useState<any>({});
  const [showComparison, setShowComparison] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Sample historical data generator
  const generateHistoricalData = (scenario: string, days: number, volatilityLevel: number) => {
    const data = [];
    let basePrice = 1000;
    const volatilityFactor = volatilityLevel / 100;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));

      let trend = 0;
      switch (scenario) {
        case 'bullMarket':
          trend = 0.001 * (1 + Math.random() * volatilityFactor);
          break;
        case 'bearMarket':
          trend = -0.001 * (1 + Math.random() * volatilityFactor);
          break;
        case 'sideways':
          trend = (Math.random() - 0.5) * 0.002 * volatilityFactor;
          break;
        case 'volatile':
          trend = (Math.random() - 0.5) * 0.004 * volatilityFactor;
          break;
      }

      basePrice = basePrice * (1 + trend);
      const dailyVolatility = basePrice * 0.02 * volatilityFactor;

      data.push({
        date: date.toISOString().split('T')[0],
        open: basePrice - dailyVolatility / 2,
        high: basePrice + dailyVolatility,
        low: basePrice - dailyVolatility,
        close: basePrice,
        volume: Math.floor(1000000 + Math.random() * 1000000)
      });
    }

    return data;
  };

  const scenarios: SimulationScenario[] = [
    {
      id: 'bullMarket',
      name: 'Bull Market',
      description: 'Simulates a strong upward trend with occasional pullbacks',
      data: generateHistoricalData('bullMarket', timeframe, volatility)
    },
    {
      id: 'bearMarket',
      name: 'Bear Market',
      description: 'Simulates a declining market with periodic relief rallies',
      data: generateHistoricalData('bearMarket', timeframe, volatility)
    },
    {
      id: 'sideways',
      name: 'Sideways Trading',
      description: 'Simulates a range-bound market with no clear trend',
      data: generateHistoricalData('sideways', timeframe, volatility)
    },
    {
      id: 'volatile',
      name: 'High Volatility',
      description: 'Simulates extreme price swings and market uncertainty',
      data: generateHistoricalData('volatile', timeframe, volatility)
    }
  ];

  useEffect(() => {
    const currentScenario = scenarios.find(s => s.id === selectedScenario);
    if (currentScenario) {
      const predictions = getAllPredictions(currentScenario.data, predictionDays);
      setPredictions(predictions);
    }
  }, [selectedScenario, timeframe, volatility, predictionDays]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleDaysChange = (days: number) => {
    setPredictionDays(days);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Market Simulation
          </h1>
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-yellow-500" size={20} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Simulation Mode - Using Test Data
            </span>
          </div>
        </div>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Test prediction models with different market scenarios and parameters
        </p>
      </div>

      {/* Controls Section */}
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Scenario Selection */}
          <div>
            <label className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Market Scenario
            </label>
            <div className="space-y-2">
              {scenarios.map(scenario => (
                <button
                  key={scenario.id}
                  className={`w-full p-3 rounded-md transition-colors flex items-center justify-between ${
                    selectedScenario === scenario.id
                      ? 'bg-green-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                  onMouseEnter={() => setShowTooltip(scenario.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <span>{scenario.name}</span>
                  <Info size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe Control */}
          <div>
            <label className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Historical Timeframe (Days)
            </label>
            <input
              type="range"
              min="30"
              max="365"
              value={timeframe}
              onChange={(e) => setTimeframe(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>30</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{timeframe}</span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>365</span>
            </div>
          </div>

          {/* Volatility Control */}
          <div>
            <label className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Market Volatility
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={volatility}
              onChange={(e) => setVolatility(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Low</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{volatility}%</span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>High</span>
            </div>
          </div>

          {/* Comparison Toggle */}
          <div>
            <label className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              View Mode
            </label>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`w-full p-3 rounded-md transition-colors flex items-center justify-center space-x-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showComparison ? (
                <>
                  <Minimize2 size={18} />
                  <span>Single View</span>
                </>
              ) : (
                <>
                  <SplitSquareHorizontal size={18} />
                  <span>Compare Models</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Prediction Model Selection */}
      <div className="mb-8">
        <PredictionModelSelector
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          predictionDays={predictionDays}
          onDaysChange={handleDaysChange}
        />
      </div>

      {/* Simulation Results */}
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Simulation Results
          </h2>
          <button
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setShowTooltip('help')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <HelpCircle size={18} />
          </button>
        </div>

        {showComparison ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(predictions).map(([modelName, prediction]: [string, any]) => (
              <div key={modelName}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {modelName === 'linearRegression' ? 'Linear Regression' :
                   modelName === 'movingAverage' ? 'Moving Average' : 'Random Forest'}
                </h3>
                <StockChart
                  data={scenarios.find(s => s.id === selectedScenario)?.data || []}
                  predictions={prediction.predictions}
                  chartType="area"
                  height={300}
                />
              </div>
            ))}
          </div>
        ) : (
          <StockChart
            data={scenarios.find(s => s.id === selectedScenario)?.data || []}
            predictions={predictions[selectedModel]?.predictions || []}
            chartType="composed"
            showVolume={true}
            height={500}
          />
        )}

        {/* Tooltips */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute z-10 p-4 rounded-lg shadow-lg max-w-xs ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            style={{
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {showTooltip === 'help' ? (
              <>
                <h4 className="font-semibold mb-2">About Simulations</h4>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  This is a testing environment using simulated data. Results may differ from real market predictions.
                  Use this tool to understand how different models perform under various market conditions.
                </p>
              </>
            ) : (
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {scenarios.find(s => s.id === showTooltip)?.description}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;