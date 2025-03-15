import axios from 'axios';

const API_KEY = '7HG8Y9PPG4AC0CZC';
const BASE_URL = 'https://www.alphavantage.co/query';

// Cache for storing API responses
const apiCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper function to make API calls with caching
const cachedApiCall = async (url: string, params: any) => {
  // Create a cache key based on the URL and parameters
  const cacheKey = JSON.stringify({ url, params });
  
  // Check if we have a cached response that's still valid
  const cachedResponse = apiCache[cacheKey];
  if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_DURATION) {
    console.log('Using cached data for:', params.function, params.symbol || params.keywords);
    return cachedResponse.data;
  }
  
  // Make the actual API call
  console.log('Making API call for:', params.function, params.symbol || params.keywords);
  const response = await axios.get(url, { params });
  
  // Cache the response
  apiCache[cacheKey] = {
    data: response.data,
    timestamp: Date.now()
  };
  
  return response.data;
};

// Get daily stock data for the past 5 years
export const getDailyStockData = async (symbol: string) => {
  try {
    const response = await cachedApiCall(BASE_URL, {
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize: 'full',
      apikey: API_KEY
    });

    if (response['Error Message']) {
      throw new Error(response['Error Message']);
    }

    const timeSeries = response['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No data available for this stock');
    }

    // Convert to array and filter for last 5 years
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    const formattedData = Object.entries(timeSeries)
      .filter(([date]) => new Date(date) >= fiveYearsAgo)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return formattedData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

// Search for stocks
export const searchStocks = async (keywords: string) => {
  try {
    const response = await cachedApiCall(BASE_URL, {
      function: 'SYMBOL_SEARCH',
      keywords,
      apikey: API_KEY
    });

    if (response['Error Message']) {
      throw new Error(response['Error Message']);
    }

    return response.bestMatches || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

// Get company overview
export const getCompanyOverview = async (symbol: string) => {
  try {
    const response = await cachedApiCall(BASE_URL, {
      function: 'OVERVIEW',
      symbol,
      apikey: API_KEY
    });

    if (response['Error Message']) {
      throw new Error(response['Error Message']);
    }

    return response;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw error;
  }
};

// Get global market status
export const getGlobalMarketStatus = async () => {
  try {
    const response = await cachedApiCall(BASE_URL, {
      function: 'GLOBAL_QUOTE',
      symbol: 'NIFTY 50',
      apikey: API_KEY
    });

    if (response['Error Message']) {
      throw new Error(response['Error Message']);
    }

    return response['Global Quote'] || {};
  } catch (error) {
    console.error('Error fetching market status:', error);
    throw error;
  }
};

// Get top indices data
export const getTopIndices = async () => {
  try {
    // Define the top Indian indices to fetch
    const topIndices = [
      { symbol: 'NIFTY', name: 'NIFTY 50' },
      { symbol: 'SENSEX', name: 'BSE SENSEX' },
      { symbol: 'BANKNIFTY', name: 'NIFTY BANK' },
      { symbol: 'NIFTYIT', name: 'NIFTY IT' }
    ];
    
    // Fetch data for each index
    const indicesData = await Promise.all(
      topIndices.map(async (index) => {
        try {
          const response = await cachedApiCall(BASE_URL, {
            function: 'GLOBAL_QUOTE',
            symbol: `${index.symbol}.BSE`,
            apikey: API_KEY
          });
          
          // If we get valid data
          if (response['Global Quote'] && Object.keys(response['Global Quote']).length > 0) {
            const quote = response['Global Quote'];
            return {
              symbol: index.name,
              price: quote['05. price'] || '0',
              change: quote['10. change percent']?.replace('%', '') || '0',
              volume: formatVolume(parseInt(quote['06. volume'] || '0'))
            };
          }
          
          // Fallback to fetch from NSE if BSE fails
          const nseResponse = await cachedApiCall(BASE_URL, {
            function: 'GLOBAL_QUOTE',
            symbol: `${index.symbol}.NS`,
            apikey: API_KEY
          });
          
          if (nseResponse['Global Quote'] && Object.keys(nseResponse['Global Quote']).length > 0) {
            const quote = nseResponse['Global Quote'];
            return {
              symbol: index.name,
              price: quote['05. price'] || '0',
              change: quote['10. change percent']?.replace('%', '') || '0',
              volume: formatVolume(parseInt(quote['06. volume'] || '0'))
            };
          }
          
          // If both fail, return placeholder data
          return {
            symbol: index.name,
            price: '0',
            change: '0',
            volume: 'N/A'
          };
        } catch (error) {
          console.error(`Error fetching data for ${index.symbol}:`, error);
          return {
            symbol: index.name,
            price: '0',
            change: '0',
            volume: 'N/A'
          };
        }
      })
    );
    
    return indicesData;
  } catch (error) {
    console.error('Error fetching top indices:', error);
    throw error;
  }
};

// Get top gainers
export const getTopGainers = async () => {
  try {
    // List of potential top gainer stocks (Indian stocks)
    const potentialGainers = [
      { symbol: 'RELIANCE.BSE', name: 'Reliance Industries' },
      { symbol: 'TCS.BSE', name: 'Tata Consultancy Services' },
      { symbol: 'INFY.BSE', name: 'Infosys Limited' },
      { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank' },
      { symbol: 'HINDUNILVR.BSE', name: 'Hindustan Unilever' },
      { symbol: 'SBIN.BSE', name: 'State Bank of India' },
      { symbol: 'BHARTIARTL.BSE', name: 'Bharti Airtel' }
    ];
    
    // Fetch data for each stock
    const stocksData = await Promise.all(
      potentialGainers.map(async (stock) => {
        try {
          const response = await cachedApiCall(BASE_URL, {
            function: 'GLOBAL_QUOTE',
            symbol: stock.symbol,
            apikey: API_KEY
          });
          
          if (response['Global Quote'] && Object.keys(response['Global Quote']).length > 0) {
            const quote = response['Global Quote'];
            return {
              symbol: stock.symbol.split('.')[0],
              name: stock.name,
              price: quote['05. price'] || '0',
              change: quote['10. change percent']?.replace('%', '') || '0',
              changeValue: parseFloat(quote['10. change percent']?.replace('%', '') || '0')
            };
          }
          
          return null;
        } catch (error) {
          console.error(`Error fetching data for ${stock.symbol}:`, error);
          return null;
        }
      })
    );
    
    // Filter out null values and sort by change percentage (descending)
    const validStocks = stocksData
      .filter(stock => stock !== null)
      .sort((a, b) => b!.changeValue - a!.changeValue);
    
    // Return top 4 gainers
    return validStocks.slice(0, 4);
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    return [];
  }
};

// Get top losers
export const getTopLosers = async () => {
  try {
    // List of potential top loser stocks (Indian stocks)
    const potentialLosers = [
      { symbol: 'SUNPHARMA.BSE', name: 'Sun Pharmaceutical' },
      { symbol: 'TATAMOTORS.BSE', name: 'Tata Motors' },
      { symbol: 'AXISBANK.BSE', name: 'Axis Bank' },
      { symbol: 'WIPRO.BSE', name: 'Wipro Limited' },
      { symbol: 'TATASTEEL.BSE', name: 'Tata Steel' },
      { symbol: 'MARUTI.BSE', name: 'Maruti Suzuki' },
      { symbol: 'BAJFINANCE.BSE', name: 'Bajaj Finance' },
      { symbol: 'HCLTECH.BSE', name: 'HCL Technologies' }
    ];
    
    // Fetch data for each stock
    const stocksData = await Promise.all(
      potentialLosers.map(async (stock) => {
        try {
          const response = await cachedApiCall(BASE_URL, {
            function: 'GLOBAL_QUOTE',
            symbol: stock.symbol,
            apikey: API_KEY
          });
          
          if (response['Global Quote'] && Object.keys(response['Global Quote']).length > 0) {
            const quote = response['Global Quote'];
            return {
              symbol: stock.symbol.split('.')[0],
              name: stock.name,
              price: quote['05. price'] || '0',
              change: quote['10. change percent']?.replace('%', '') || '0',
              changeValue: parseFloat(quote['10. change percent']?.replace('%', '') || '0')
            };
          }
          
          return null;
        } catch (error) {
          console.error(`Error fetching data for ${stock.symbol}:`, error);
          return null;
        }
      })
    );
    
    // Filter out null values and sort by change percentage (ascending)
    const validStocks = stocksData
      .filter(stock => stock !== null)
      .sort((a, b) => a!.changeValue - b!.changeValue);
    
    // Return top 4 losers
    return validStocks.slice(0, 4);
  } catch (error) {
    console.error('Error fetching top losers:', error);
    return [];
  }
};

// Get most active stocks
export const getMostActiveStocks = async () => {
  try {
    // List of potentially active stocks (Indian stocks)
    const potentialActive = [
      { symbol: 'SBIN.BSE', name: 'State Bank of India' },
      { symbol: 'TATASTEEL.BSE', name: 'Tata Steel' },
      { symbol: 'BHARTIARTL.BSE', name: 'Bharti Airtel' },
      { symbol: 'WIPRO.BSE', name: 'Wipro Limited' },
      { symbol: 'RELIANCE.BSE', name: 'Reliance Industries' },
      { symbol: 'INFY.BSE', name: 'Infosys Limited' },
      { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank' }
    ];
    
    // Fetch data for each stock
    const stocksData = await Promise.all(
      potentialActive.map(async (stock) => {
        try {
          const response = await cachedApiCall(BASE_URL, {
            function: 'GLOBAL_QUOTE',
            symbol: stock.symbol,
            apikey: API_KEY
          });
          
          if (response['Global Quote'] && Object.keys(response['Global Quote']).length > 0) {
            const quote = response['Global Quote'];
            return {
              symbol: stock.symbol.split('.')[0],
              name: stock.name,
              price: quote['05. price'] || '0',
              volume: formatVolume(parseInt(quote['06. volume'] || '0')),
              volumeValue: parseInt(quote['06. volume'] || '0')
            };
          }
          
          return null;
        } catch (error) {
          console.error(`Error fetching data for ${stock.symbol}:`, error);
          return null;
        }
      })
    );
    
    // Filter out null values and sort by volume (descending)
    const validStocks = stocksData
      .filter(stock => stock !== null)
      .sort((a, b) => b!.volumeValue - a!.volumeValue);
    
    // Return top 4 most active
    return validStocks.slice(0, 4);
  } catch (error) {
    console.error('Error fetching most active stocks:', error);
    return [];
  }
};

// Helper function to format volume
const formatVolume = (volume: number): string => {
  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(2)}Cr`;
  } else if (volume >= 100000) {
    return `${(volume / 100000).toFixed(2)}L`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toString();
};