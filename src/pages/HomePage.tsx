import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import StockSearch from '../components/StockSearch';
import MarketOverview from '../components/MarketOverview';
import { BarChart2, TrendingUp, LineChart, ChevronRight, Star, Users,ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface News {
    title: string;
    excerpt: string;
    image: string;
    date: string;
    content: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const testimonials = [
    {
      name: "Sabari Kesav",
      role: "Rapha | Intern",
      image: "/images/Sabari.jpg",
      content: "StockPred has helped me put my money into good use and now I don't waste it by gambling."
    },
    {
      name: "Aniruddh KA",
      role: "Rocketleg | Intern",
      image: "/images/Aswin.jpg",
      content: "I have gotten into trading this year, have stopped putting my money on cars and now I trade every other day with the help of StockPred."
    },
    {
      name: "Aswin Thoma",
      role: "Rapha | Intern",
      image: "/images/Ani.jpg",
      content: "My name is Thomas Aswins, I have developed big interest in this after getting to use the simulation feature."
    }
  ];

  const news = [
    {
      title: "AI-Powered Stock Predictions: The Future of Trading",
      excerpt: "How artificial intelligence is revolutionizing stock market predictions and trading strategies.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      date: "Feb 15, 2024",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      title: "Market Analysis: Q1 2024 Insights",
      excerpt: "A comprehensive analysis of market trends and predictions for the coming quarters.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      date: "Feb 10, 2024",
      content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "Understanding Market Volatility",
      excerpt: "Expert insights on navigating market volatility and maintaining a stable portfolio.",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      date: "Feb 5, 2024",
      content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    }
  ];

  const stats = [
    { label: "Team Members", value: "3", icon: <Users className="w-6 h-6" /> },
    { label: "Started in", value: "November,2024", icon: <TrendingUp className="w-6 h-6" /> },
    { label: "Ideas yet to be implemented", value: "10+", icon: <BarChart2 className="w-6 h-6" /> },
    { label: "Years of Data", value: "5+", icon: <LineChart className="w-6 h-6" /> }
  ];

  const features = [
    {
      title: "AI-Powered Predictions",
      description: "Advanced machine learning models analyze market trends and predict stock movements with high accuracy.",
      icon: <TrendingUp className="w-12 h-12 text-green-500" />
    },
    {
      title: "Real-time Analytics",
      description: "Get instant access to market data, technical indicators, and comprehensive stock analysis.",
      icon: <BarChart2 className="w-12 h-12 text-blue-500" />
    },
    {
      title: "Portfolio Management",
      description: "Track and manage your investments with our intuitive portfolio management tools.",
      icon: <LineChart className="w-12 h-12 text-purple-500" />
    }
  ];

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ y }}
        className="relative min-h-screen flex items-center justify-center py-20 px-4"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-white via-gray-100 to-white'}`}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Predict the Future of
              <span className="text-green-500"> Indian Stocks</span>
            </motion.h1>
            
            <motion.p 
              className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Make informed investment decisions with AI-powered stock predictions and real-time market insights
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <StockSearch />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={() => navigate('/market-data')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center"
              >
                View Market Data
                <ChevronRight className="ml-2" />
              </button>
              
              <button
                onClick={() => navigate('/about')}
                className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center`}
              >
                Learn More
                <ChevronRight className="ml-2" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Market Overview Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <MarketOverview />
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Why Choose StockPred?
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Advanced features designed to enhance your trading experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <motion.section
        ref={statsRef}
        className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1 }}
                className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-xl text-center`}
              >
                <div className={`inline-flex items-center justify-center p-3 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} text-green-500 mb-4`}>
                  {stat.icon}
                </div>
                <h3 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}` }>
              What Our Users Say
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Trusted by these Investors
            </p>
          </div>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6 rounded-xl h-full`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="inline-block w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{testimonial.content}"
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Latest News Section */}
      <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Latest Market Insights
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Stay updated with the latest market news and analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.date}
                  </p>
                  <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.excerpt}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedNews(item);
                      setShowNewsModal(true);
                    }}
                    className="text-green-500 hover:text-green-600 flex items-center text-sm font-medium"
                  >
                    Read More
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Ready to Start Predicting?
            </h2>
            <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Join traders who are already using StockPred to make smarter investment decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Login/Sign up
              </button>
              <button
                onClick={() => navigate('/about')}
                className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} px-8 py-3 rounded-lg transition-all transform hover:scale-105`}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Modal */}
      {showNewsModal && selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowNewsModal(false)}
          ></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full relative z-10`}
          >
            <button
              onClick={() => setShowNewsModal(false)}
              className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {selectedNews.title}
            </h3>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedNews.date}
            </p>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {selectedNews.content}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;