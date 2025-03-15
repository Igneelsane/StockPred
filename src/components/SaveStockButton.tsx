import React, { useState } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { saveStock } from '../services/authService';

interface SaveStockButtonProps {
  stockSymbol: string;
  stockName: string;
}

const SaveStockButton: React.FC<SaveStockButtonProps> = ({ stockSymbol, stockName }) => {
  const { theme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const handleSaveStock = async () => {
    if (!currentUser) {
      setError('Please login to save stocks');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveStock(currentUser.uid, stockSymbol, stockName);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setError('Failed to save stock');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <button
        className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'} px-4 py-2 rounded-md cursor-not-allowed`}
        disabled
      >
        <Save size={18} />
        <span>Login to Save</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleSaveStock}
        disabled={isSaving || isSaved}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          isSaved
            ? 'bg-green-600 text-white'
            : theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
        }`}
      >
        {isSaving ? (
          <span className="animate-spin">⟳</span>
        ) : isSaved ? (
          <Check size={18} />
        ) : (
          <Save size={18} />
        )}
        <span>{isSaved ? 'Saved' : 'Save Stock'}</span>
      </button>
      
      {error && (
        <div className="mt-2 flex items-center space-x-1 text-red-500 text-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SaveStockButton;