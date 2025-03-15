import React from 'react';
import { TrendingUp, BarChart2, LineChart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PredictionModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  predictionDays: number;
  onDaysChange: (days: number) => void;
}

const PredictionModelSelector: React.FC<PredictionModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  predictionDays,
  onDaysChange
}) => {
  const { theme } = useTheme();
  const models = [
    { id: 'linearRegression', name: 'Linear Regression', icon: <LineChart size={18} /> },
    { id: 'movingAverage', name: 'Moving Average', icon: <TrendingUp size={18} /> },
    { id: 'randomForest', name: 'Random Forest', icon: <BarChart2 size={18} /> }
  ];

  const dayOptions = [7, 15, 30, 60, 90];

  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Prediction Settings</h3>
      
      <div className="mb-4">
        <label className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Prediction Model</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {models.map(model => (
            <button
              key={model.id}
              className={`flex items-center justify-center space-x-2 p-2 rounded-md transition-colors ${
                selectedModel === model.id
                  ? 'bg-green-600 text-white'
                  : theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => onModelChange(model.id)}
            >
              {model.icon}
              <span>{model.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Prediction Days</label>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map(days => (
            <button
              key={days}
              className={`px-3 py-1 rounded-md transition-colors ${
                predictionDays === days
                  ? 'bg-green-600 text-white'
                  : theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => onDaysChange(days)}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionModelSelector;