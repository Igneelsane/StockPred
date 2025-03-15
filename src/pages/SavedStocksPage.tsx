import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getSavedStocks, removeStock } from '../services/authService';
import { Trash2, ExternalLink, AlertCircle, Search } from 'lucide-react';

const SavedStocksPage: React.FC = () => {
  const { theme } = useTheme();
  const [savedStocks, setSavedStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedStocks = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const stocks = await getSavedStocks(currentUser.uid);
        setSavedStocks(stocks);
      } catch (err) {
        setError('Failed to load saved stocks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStocks();
  }, [currentUser, navigate]);

  const handleRemoveStock = async (symbol: string) => {
    if (!currentUser) return;

    try {
      const updatedStocks = await removeStock(currentUser.uid, symbol);
      setSavedStocks(updatedStocks);
    } catch (err) {
      console.error('Error removing stock:', err);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md text-center`}>
          <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Login Required</h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>You need to login to view your saved stocks.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>Saved Stocks</h1>
        <div className="animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg mb-4`}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>Saved Stocks</h1>

      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {savedStocks.length === 0 ? (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md text-center`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>No Saved Stocks</h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>You haven't saved any stocks yet.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors inline-flex items-center"
          >
            <Search size={18} className="mr-2" />
            Search Stocks
          </button>
        </div>
      ) : (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Symbol</th>
                  <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Name</th>
                  <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Saved Date</th>
                  <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedStocks.map((stock, index) => (
                  <tr 
                    key={index} 
                    className={`border-b ${theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-green-500">{stock.symbol}</span>
                    </td>
                    <td className={`py-4 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stock.name}</td>
                    <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(stock.savedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleStockClick(stock.symbol)}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          title="View Stock"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveStock(stock.symbol)}
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          title="Remove Stock"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedStocksPage;