import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  source: string;
  url: string;
  isBreaking: boolean;
}

const NewsSection: React.FC = () => {
  const { theme } = useTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: 'Market Rally Continues as Tech Stocks Surge',
            excerpt: 'Major tech companies lead the market rally with strong earnings reports',
            content: 'Detailed analysis of the market rally...',
            image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            date: new Date().toISOString(),
            category: 'Market Analysis',
            source: 'StockPred News',
            url: '/news/market-rally',
            isBreaking: true
          },
          {
            id: '2',
            title: 'Central Bank Announces New Policy Measures',
            excerpt: 'Policy changes expected to impact market dynamics',
            content: 'Details of the new policy measures...',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            date: new Date(Date.now() - 3600000).toISOString(),
            category: 'Policy Updates',
            source: 'StockPred News',
            url: '/news/policy-update',
            isBreaking: false
          }
        ];

        setNews(mockNews);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // In production, set up a polling interval to fetch news regularly
    const interval = setInterval(fetchNews, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
        <div className="animate-pulse">
          <div className={`h-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/4 mb-4`}></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4">
                <div className={`h-24 w-24 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded`}></div>
                <div className="flex-1">
                  <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                  <div className={`h-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded w-1/2`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-md`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Latest Market News
        </h2>
        {lastUpdated && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Updated {formatTimeAgo(lastUpdated.toISOString())}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {news.map(item => (
          <div 
            key={item.id}
            className={`${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'} -mx-6 px-6 py-4 transition-colors`}
          >
            <div className="flex items-start space-x-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {item.isBreaking && (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                      Breaking
                    </span>
                  )}
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.category}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    • {formatTimeAgo(item.date)}
                  </span>
                </div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  {item.excerpt}
                </p>
                <div className="flex items-center space-x-4">
                  <Link
                    to={item.url}
                    className="flex items-center space-x-1 text-green-500 hover:text-green-600 text-sm font-medium"
                  >
                    <span>Read More</span>
                    <ArrowRight size={14} />
                  </Link>
                  {item.source !== 'StockPred News' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm`}
                    >
                      <span>{item.source}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/news"
          className={`inline-flex items-center space-x-2 px-6 py-2 rounded-md ${
            theme === 'dark'
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          <span>View All News</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NewsSection;