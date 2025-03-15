import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart2, RefreshCw, Search } from 'lucide-react';
import { getTopGainers, getTopLosers, getMostActiveStocks } from '../services/stockService';
import { useTheme } from '../context/ThemeContext';

const MarketDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [mostActive, setMostActive] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const fetchMarketData = async () => {
    try {
      setLoading(true);
      
      // Fetch top gainers, losers, and most active stocks
      const gainers = await getTopGainers();
      const losers = await getTopLosers();
      const active = await getMostActiveStocks();
      
      setTopGainers(gainers);
      setTopLosers(losers);
      setMostActive(active);
      setDataFetched(true);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 md:mb-0`}>Market Data</h1>
        
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          
          <button
            onClick={fetchMarketData}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (
              <RefreshCw size={18} className="animate-spin mr-2" />
            ) : (
              <RefreshCw size={18} className="mr-2" />
            )}
            <span>{dataFetched ? 'Refresh Data' : 'Load Market Data'}</span>
          </button>
        </div>
      </div>
      
      {!dataFetched && !loading ? (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-8 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md text-center`}>
          <BarChart2 size={48} className={`mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`} />
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Market Data Not Loaded</h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-lg mx-auto`}>
            Click the "Load Market Data" button to fetch the latest information about top gainers, losers, and most active stocks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Top Gainers</h2>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className={`p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg animate-pulse`}>
                    <div className={`h-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/3 mb-2`}></div>
                    <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-2/3`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {topGainers.length > 0 ? (
                  topGainers.map((stock, index) => (
                    <li 
                      key={index}
                      className={`p-3 ${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg cursor-pointer transition-colors`}
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stock.symbol}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{parseFloat(stock.price).toFixed(2)}</p>
                          <p className="text-green-500">+{stock.change}%</p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} py-4`}>No data available</p>
                )}
              </ul>
            )}
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Top Losers</h2>
              <TrendingUp className="text-red-500 transform rotate-180" size={20} />
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className={`p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg animate-pulse`}>
                    <div className={`h-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/3 mb-2`}></div>
                    <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-2/3`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {topLosers.length > 0 ? (
                  topLosers.map((stock, index) => (
                    <li 
                      key={index}
                      className={`p-3 ${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg cursor-pointer transition-colors`}
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stock.symbol}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{parseFloat(stock.price).toFixed(2)}</p>
                          <p className="text-red-500">{stock.change}%</p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} py-4`}>No data available</p>
                )}
              </ul>
            )}
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Most Active</h2>
              <BarChart2 className="text-blue-500" size={20} />
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className={`p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg animate-pulse`}>
                    <div className={`h-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/3 mb-2`}></div>
                    <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-2/3`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {mostActive.length > 0 ? (
                  mostActive.map((stock, index) => (
                    <li 
                      key={index}
                      className={`p-3 ${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg cursor-pointer transition-colors`}
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stock.symbol}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{parseFloat(stock.price).toFixed(2)}</p>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Vol: {stock.volume}</p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} py-4`}>No data available</p>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-12 text-center">
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          Want to search for a specific stock instead?
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center"
        >
          <Search size={18} className="mr-2" />
          Go to Search
        </button>
      </div>
    </div>
  );
};

export default MarketDataPage;