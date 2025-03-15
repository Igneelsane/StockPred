import React, { useState } from 'react';
import { getTopIndices } from '../services/stockService';
import { TrendingUp, TrendingDown, AlertCircle, Clock, RefreshCw, BarChart2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MarketOverview: React.FC = () => {
  const { theme } = useTheme();
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed'>('closed');
  const [nextClosedDay, setNextClosedDay] = useState<string>('');
  const [dataFetched, setDataFetched] = useState(false);

  const checkMarketStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (day === 0 || day === 6) {
      setMarketStatus('closed');
      const nextSaturday = new Date();
      nextSaturday.setDate(now.getDate() + (6 - day + 7) % 7);
      setNextClosedDay(`Saturday, ${nextSaturday.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}`);
      return;
    }
    
    const currentTimeInMinutes = hours * 60 + minutes;
    const marketOpenInMinutes = 9 * 60 + 15;
    const marketCloseInMinutes = 15 * 60 + 30;
    
    if (currentTimeInMinutes >= marketOpenInMinutes && currentTimeInMinutes <= marketCloseInMinutes) {
      setMarketStatus('open');
    } else {
      setMarketStatus('closed');
      const nextSaturday = new Date();
      nextSaturday.setDate(now.getDate() + (6 - day));
      setNextClosedDay(`Saturday, ${nextSaturday.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}`);
    }
  };

  const fetchIndicesData = async () => {
    setLoading(true);
    try {
      const data = await getTopIndices();
      setIndices(data);
      checkMarketStatus();
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching indices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!dataFetched && !loading) {
    return (
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md mb-12 text-center`}>
        <BarChart2 size={48} className={`mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`} />
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Market Overview</h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          Click the button below to load the latest market data and indices.
        </p>
        <button
          onClick={fetchIndicesData}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center"
        >
          <RefreshCw size={18} className="mr-2" />
          Load Market Data
        </button>
      </div>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md mb-12`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Market Overview</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${marketStatus === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Market {marketStatus === 'open' ? 'Open' : 'Closed'}
            </span>
          </div>
          <button
            onClick={fetchIndicesData}
            disabled={loading}
            className={`p-2 rounded-md transition-colors ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="Refresh Data"
          >
            <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className={`h-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/2 mb-2`}></div>
              <div className={`h-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-3/4 mb-1`}></div>
              <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/4`}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {indices.map((index, i) => (
            <div key={i} className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>{index.symbol}</h3>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{parseFloat(index.price).toLocaleString('en-IN')}</p>
              <div className={`flex items-center ${parseFloat(index.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {parseFloat(index.change) >= 0 ? (
                  <>
                    <TrendingUp size={16} className="mr-1" />
                    <span>+{index.change}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown size={16} className="mr-1" />
                    <span>{index.change}%</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
          <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Market Status</h3>
          <div className="flex items-center">
            {marketStatus === 'open' ? (
              <>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="text-green-500 font-semibold">Open</p>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-red-500 mr-2" />
                <p className="text-red-500 font-semibold">Closed</p>
              </>
            )}
          </div>
          {marketStatus === 'closed' && (
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
              Next closed day: {nextClosedDay}
            </p>
          )}
        </div>
        
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
          <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Trading Time</h3>
          <div className="flex items-center">
            <Clock size={16} className="text-blue-400 mr-2" />
            <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>9:15 AM - 3:30 PM IST</p>
          </div>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
            Monday to Friday (Except Holidays)
          </p>
        </div>
        
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg`}>
          <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Last Updated</h3>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>{new Date().toLocaleTimeString()}</p>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
            {new Date().toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;