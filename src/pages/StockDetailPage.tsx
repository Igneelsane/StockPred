import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDailyStockData, getCompanyOverview } from '../services/stockService';
import { getAllPredictions } from '../services/predictionService';
import StockChart from '../components/StockChart';
import StockStats from '../components/StockStats';
import PredictionModelSelector from '../components/PredictionModelSelector';
import SaveStockButton from '../components/SaveStockButton';
import { Calendar, Globe, DollarSign, BarChart2, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const StockDetailPage: React.FC = () => {
  const { theme } = useTheme();
  const { symbol } = useParams<{ symbol: string }>();
  const [stockData, setStockData] = useState<any[]>([]);
  const [companyOverview, setCompanyOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('linearRegression');
  const [predictionDays, setPredictionDays] = useState(30);
  const [predictions, setPredictions] = useState<any>({});
  const [chartType, setChartType] = useState<'line' | 'area' | 'candle' | 'composed'>('line');
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getDailyStockData(symbol);
        setStockData(data);
        
        // Get company overview
        try {
          const overview = await getCompanyOverview(symbol);
          setCompanyOverview(overview);
        } catch (err) {
          console.error('Error fetching company overview:', err);
        }
        
        // Generate predictions
        const allPredictions = getAllPredictions(data, predictionDays);
        setPredictions(allPredictions);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [symbol, predictionDays]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleDaysChange = (days: number) => {
    setPredictionDays(days);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className={`h-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/4 mb-4`}></div>
          <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded w-2/4 mb-8`}></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-24 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded`}></div>
            ))}
          </div>
          <div className={`h-96 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded mb-8`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-500 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {symbol} {companyOverview?.Name && `- ${companyOverview.Name}`}
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {companyOverview?.Exchange || 'NSE'} • {companyOverview?.Sector || 'N/A'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <SaveStockButton 
            stockSymbol={symbol || ''} 
            stockName={companyOverview?.Name || symbol || ''}
          />
        </div>
      </div>
      
      <StockStats stockData={stockData} companyOverview={companyOverview} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md mb-4`}>
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Price Chart</h2>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    chartType === 'line' 
                      ? 'bg-green-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Line
                </button>
                <button 
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    chartType === 'area' 
                      ? 'bg-green-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Area
                </button>
                <button 
                  onClick={() => setChartType('candle')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    chartType === 'candle' 
                      ? 'bg-green-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Candle
                </button>
                <button 
                  onClick={() => setChartType('composed')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    chartType === 'composed' 
                      ? 'bg-green-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Composed
                </button>
                <button 
                  onClick={() => setShowVolume(!showVolume)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    showVolume 
                      ? 'bg-blue-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showVolume ? 'Hide Volume' : 'Show Volume'}
                </button>
              </div>
            </div>
            
            <StockChart 
              data={stockData.slice(-90)} 
              predictions={predictions[selectedModel]?.predictions || []}
              chartType={chartType}
              showVolume={showVolume}
              height={400}
            />
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Prediction Results</h2>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Historical Data</p>
                
                <div className="w-3 h-3 rounded-full bg-blue-500 ml-4"></div>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Predicted Data</p>
              </div>
              
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Showing {predictionDays}-day prediction using {selectedModel === 'linearRegression' ? 'Linear Regression' : 
                selectedModel === 'movingAverage' ? 'Moving Average' : 'Random Forest'} model
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Predicted in 7 Days</h3>
                {predictions[selectedModel]?.predictions && predictions[selectedModel].predictions.length > 0 ? (
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ₹{predictions[selectedModel].predictions[6]?.predicted.toFixed(2) || 'N/A'}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(predictions[selectedModel].predictions[6]?.date).toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                ) : (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No prediction available</p>
                )}
              </div>
              
              <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Predicted in 15 Days</h3>
                {predictions[selectedModel]?.predictions && predictions[selectedModel].predictions.length > 10 ? (
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ₹{predictions[selectedModel].predictions[14]?.predicted.toFixed(2) || 'N/A'}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(predictions[selectedModel].predictions[14]?.date).toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                ) : (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No prediction available</p>
                )}
              </div>
              
              <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Predicted in 30 Days</h3>
                {predictions[selectedModel]?.predictions && predictions[selectedModel].predictions.length > 20 ? (
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ₹{predictions[selectedModel].predictions[29]?.predicted.toFixed(2) || 'N/A'}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(predictions[selectedModel].predictions[29]?.date).toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                ) : (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No prediction available</p>
                )}
              </div>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Model Performance</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                {selectedModel === 'linearRegression' && 'Linear regression predicts future values based on the linear relationship between time and price.'}
                {selectedModel === 'movingAverage' && 'Moving average uses the average of previous prices to smooth out price data and identify trends.'}
                {selectedModel === 'randomForest' && 'Random Forest is an advanced machine learning model that uses multiple decision trees to make more accurate predictions.'}
              </p>
              
              {selectedModel === 'linearRegression' && predictions.linearRegression?.r2 && (
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  R² Score: <span className="font-semibold">{(predictions.linearRegression.r2 * 100).toFixed(2)}%</span>
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <PredictionModelSelector 
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            predictionDays={predictionDays}
            onDaysChange={handleDaysChange}
          />
          
          {/* {companyOverview && (
            <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md mt-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Company Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Globe size={18} className="text-blue-500 mt-1" />
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Industry</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{companyOverview.Industry || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar size={18} className="text-green-500 mt-1" />
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>IPO Date</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{companyOverview.IPODate || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <DollarSign size={18} className="text-purple-500 mt-1" />
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Dividend Yield</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{companyOverview.DividendYield ? `${(parseFloat(companyOverview.DividendYield) * 100).toFixed(2)}%` : 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <BarChart2 size={18} className="text-red-500 mt-1" />
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>52-Week High/Low</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {companyOverview['52WeekHigh'] ? `₹${parseFloat(companyOverview['52WeekHigh']).toFixed(2)}` : 'N/A'} / 
                      {companyOverview['52WeekLow'] ? `₹${parseFloat(companyOverview['52WeekLow']).toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <TrendingUp size={18} className="text-blue-500 mt-1" />
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>P/E Ratio</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{companyOverview.PERatio || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {companyOverview.Description && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>About</p>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm line-clamp-6`}>{companyOverview.Description}</p>
                  <button className="text-green-500 text-sm mt-2 hover:underline">Read more</button>
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage;