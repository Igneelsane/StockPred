import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { searchStocks } from '../services/stockService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const StockSearch: React.FC = () => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const data = await searchStocks(query);
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleStockSelect = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stocks..."
          className={`w-full px-4 py-2 pl-10 pr-10 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        <Search className={`absolute left-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
        {query && (
          <button
            className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setQuery('')}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showResults && (
        <div className={`absolute z-10 w-full mt-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-md shadow-lg max-h-60 overflow-y-auto`}>
          {loading ? (
            <div className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((stock, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 ${theme === 'dark' ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-100 border-gray-200'} cursor-pointer border-b last:border-b-0`}
                  onClick={() => handleStockSelect(stock['1. symbol'])}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-green-500">{stock['1. symbol']}</span>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate`}>{stock['2. name']}</p>
                    </div>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{stock['4. region']}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;