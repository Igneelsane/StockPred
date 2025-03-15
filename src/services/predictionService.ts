import { SimpleLinearRegression } from 'ml-regression';
import { RandomForestRegression as RandomForest } from 'ml-random-forest';

// Linear Regression prediction model
export const linearRegressionPredict = (data: any[], daysToPredict: number = 30) => {
  try {
    // Extract features and target
    const x = data.map((_, index) => index);
    const y = data.map(item => item.close);
    
    // Train the model
    const regression = new SimpleLinearRegression(x, y);
    
    // Make predictions
    const predictions = [];
    const lastDate = new Date(data[data.length - 1].date);
    
    for (let i = 1; i <= daysToPredict; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + i);
      
      // Skip weekends
      if (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
        continue;
      }
      
      const predictedValue = regression.predict(data.length + i - 1);
      
      predictions.push({
        date: nextDate.toISOString().split('T')[0],
        predicted: predictedValue,
        actual: null
      });
    }
    
    return {
      predictions,
      r2: regression.score(x, y),
      model: 'Linear Regression'
    };
  } catch (error) {
    console.error('Error in linear regression prediction:', error);
    throw error;
  }
};

// Moving Average prediction model
export const movingAveragePredict = (data: any[], daysToPredict: number = 30, window: number = 20) => {
  try {
    const closePrices = data.map(item => item.close);
    const predictions = [];
    const lastDate = new Date(data[data.length - 1].date);
    
    // Calculate moving average
    const getMA = (prices: number[], window: number) => {
      if (prices.length < window) {
        return prices.reduce((sum, price) => sum + price, 0) / prices.length;
      }
      
      const windowPrices = prices.slice(prices.length - window);
      return windowPrices.reduce((sum, price) => sum + price, 0) / window;
    };
    
    const predictedPrices = [...closePrices];
    
    for (let i = 1; i <= daysToPredict; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + i);
      
      // Skip weekends
      if (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
        continue;
      }
      
      const ma = getMA(predictedPrices, window);
      predictedPrices.push(ma);
      
      predictions.push({
        date: nextDate.toISOString().split('T')[0],
        predicted: ma,
        actual: null
      });
    }
    
    return {
      predictions,
      model: `Moving Average (${window} days)`
    };
  } catch (error) {
    console.error('Error in moving average prediction:', error);
    throw error;
  }
};

// Random Forest prediction model
export const randomForestPredict = (data: any[], daysToPredict: number = 30) => {
  try {
    // Create features: use previous 5 days to predict next day
    const features = [];
    const targets = [];
    
    for (let i = 5; i < data.length; i++) {
      const feature = [
        data[i-1].close,
        data[i-2].close,
        data[i-3].close,
        data[i-4].close,
        data[i-5].close,
        data[i-1].volume,
        data[i-1].high - data[i-1].low, // volatility
      ];
      
      features.push(feature);
      targets.push(data[i].close);
    }
    
    // Train the model
    const options = {
      nEstimators: 100,
      maxDepth: 6,
      treeOptions: {
        maxFeatures: 'sqrt'
      }
    };
    
    const rf = new RandomForest(options);
    rf.train(features, targets);
    
    // Make predictions
    const predictions = [];
    const lastDate = new Date(data[data.length - 1].date);
    let lastPredictions = [
      data[data.length-1].close,
      data[data.length-2].close,
      data[data.length-3].close,
      data[data.length-4].close,
      data[data.length-5].close,
      data[data.length-1].volume,
      data[data.length-1].high - data[data.length-1].low,
    ];
    
    for (let i = 1; i <= daysToPredict; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + i);
      
      // Skip weekends
      if (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
        continue;
      }
      
      const predictedValue = rf.predict([lastPredictions.slice(0, 7)])[0];
      
      // Update last predictions for next iteration
      lastPredictions.unshift(predictedValue);
      lastPredictions.pop();
      
      predictions.push({
        date: nextDate.toISOString().split('T')[0],
        predicted: predictedValue,
        actual: null
      });
    }
    
    return {
      predictions,
      model: 'Random Forest'
    };
  } catch (error) {
    console.error('Error in random forest prediction:', error);
    throw error;
  }
};

// Get predictions using all models
export const getAllPredictions = (data: any[], daysToPredict: number = 30) => {
  return {
    linearRegression: linearRegressionPredict(data, daysToPredict),
    movingAverage: movingAveragePredict(data, daysToPredict),
    randomForest: randomForestPredict(data, daysToPredict)
  };
};