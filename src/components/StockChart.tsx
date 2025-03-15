import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface StockChartProps {
  data: any[];
  predictions?: any[];
  chartType?: 'line' | 'area' | 'candle' | 'composed';
  showVolume?: boolean;
  height?: number;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  predictions = [],
  chartType = 'line',
  showVolume = false,
  height = 400
}) => {
  const { theme } = useTheme();
  
  // Format data for display
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short'
    })
  }));

  const formattedPredictions = predictions.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short'
    })
  }));

  // Combine historical data with predictions
  const combinedData = [
    ...formattedData,
    ...formattedPredictions
  ];

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded shadow-lg`}>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render different chart types
  const renderChart = () => {
    const gridColor = theme === 'dark' ? '#333' : '#ddd';
    const textColor = theme === 'dark' ? 'white' : '#333';
    
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#82ca9d" 
              fillOpacity={1} 
              fill="url(#colorClose)" 
              name="Close Price"
            />
            {predictions.length > 0 && (
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorPredicted)" 
                name="Predicted Price"
              />
            )}
          </AreaChart>
        );
      
      case 'composed':
        return (
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fill: textColor }} />
            <YAxis yAxisId="left" tick={{ fill: textColor }} />
            {showVolume && (
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fill: textColor }} 
                domain={['auto', 'auto']}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#82ca9d" 
              dot={false} 
              yAxisId="left"
              name="Close Price"
            />
            {predictions.length > 0 && (
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8884d8" 
                dot={false} 
                yAxisId="left"
                name="Predicted Price"
                strokeDasharray="5 5"
              />
            )}
            {showVolume && (
              <Bar 
                dataKey="volume" 
                fill="#ff7300" 
                yAxisId="right" 
                name="Volume"
                opacity={0.5}
              />
            )}
          </ComposedChart>
        );
      
      case 'candle':
        return (
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="high" 
              fill="transparent" 
              stroke="#22c55e" 
              name="High"
            />
            <Bar 
              dataKey="low" 
              fill="transparent" 
              stroke="#ef4444" 
              name="Low"
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#82ca9d" 
              dot={false} 
              name="Close Price"
            />
            {predictions.length > 0 && (
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8884d8" 
                dot={false} 
                name="Predicted Price"
                strokeDasharray="5 5"
              />
            )}
          </ComposedChart>
        );
      
      case 'line':
      default:
        return (
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#82ca9d" 
              dot={false} 
              name="Close Price"
            />
            <Line 
              type="monotone" 
              dataKey="open" 
              stroke="#ff7300" 
              dot={false} 
              name="Open Price"
            />
            {predictions.length > 0 && (
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8884d8" 
                dot={true} 
                name="Predicted Price"
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 rounded-lg shadow-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;