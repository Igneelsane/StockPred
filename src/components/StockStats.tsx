import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface StockStatsProps {
  stockData: any;
  companyOverview?: any;
}

const StockStats: React.FC<StockStatsProps> = ({ stockData, companyOverview }) => {
  const { theme } = useTheme();
  
  if (!stockData || stockData.length === 0) {
    return null;
  }

  // Get latest data
  const latestData = stockData[stockData.length - 1];
  const previousData = stockData[stockData.length - 2] || latestData;
  
  // Calculate change
  const priceChange = latestData.close - previousData.close;
  const percentChange = (priceChange / previousData.close) * 100;
  
  // Calculate 52-week high and low
  const yearData = stockData.slice(-252); // Approximately 252 trading days in a year
  const high52Week = Math.max(...yearData.map((d: any) => d.high));
  const low52Week = Math.min(...yearData.map((d: any) => d.low));
  
  // Calculate average volume
  const avgVolume = yearData.reduce((sum: number, d: any) => sum + d.volume, 0) / yearData.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Current Price</p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{latestData.close.toFixed(2)}</p>
          </div>
          <div className={`flex items-center ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
        </div>
        <div className={`mt-2 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>52 Week Range</p>
            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>₹{low52Week.toFixed(2)} - ₹{high52Week.toFixed(2)}</p>
          </div>
          <div className="text-blue-500">
            <Activity size={20} />
          </div>
        </div>
        <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Current: {((latestData.close - low52Week) / (high52Week - low52Week) * 100).toFixed(0)}% of range
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Volume</p>
            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{latestData.volume.toLocaleString()}</p>
          </div>
          <div className="text-purple-500">
            <BarChart size={20} />
          </div>
        </div>
        <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Avg: {Math.round(avgVolume).toLocaleString()}
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Market Cap</p>
            {companyOverview ? (
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ₹{(parseFloat(companyOverview.MarketCapitalization) / 10000000).toFixed(2)} Cr
              </p>
            ) : (
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>--</p>
            )}
          </div>
          <div className="text-yellow-500">
            <DollarSign size={20} />
          </div>
        </div>
        <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {companyOverview ? companyOverview.Industry || 'N/A' : 'Loading...'}
        </div>
      </div>
    </div>
  );
};

export default StockStats;