import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, User, Save, Home, Info, BarChart2, Sun, Moon, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logoutUser } from '../services/authService';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} text-${theme === 'dark' ? 'white' : 'gray-900'} py-4 px-6 shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-green-500">Stock</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Pred</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`flex items-center space-x-1 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          
          <Link to="/market-data" className={`flex items-center space-x-1 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <BarChart2 size={18} />
            <span>Market Data</span>
          </Link>
          
          <Link to="/simulation" className={`flex items-center space-x-1 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <PlayCircle size={18} />
            <span>Simulation</span>
          </Link>
          
          <Link to="/about" className={`flex items-center space-x-1 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Info size={18} />
            <span>About Us</span>
          </Link>
          
          {currentUser ? (
            <>
              <Link to="/saved-stocks" className={`flex items-center space-x-1 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Save size={18} />
                <span>Saved Stocks</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`flex items-center space-x-1 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <User size={18} />
                <span>Login</span>
              </Link>
              
              <Link 
                to="/register" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            className={theme === 'dark' ? 'text-white' : 'text-gray-900'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} py-4 px-6 absolute top-16 left-0 right-0 z-50`}>
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 py-2 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/market-data" 
              className={`flex items-center space-x-2 py-2 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 size={18} />
              <span>Market Data</span>
            </Link>
            
            <Link 
              to="/simulation" 
              className={`flex items-center space-x-2 py-2 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <PlayCircle size={18} />
              <span>Simulation</span>
            </Link>
            
            <Link 
              to="/about" 
              className={`flex items-center space-x-2 py-2 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Info size={18} />
              <span>About Us</span>
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/saved-stocks" 
                  className={`flex items-center space-x-2 py-2 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Save size={18} />
                  <span>Saved Stocks</span>
                </Link>
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 py-2 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`flex items-center space-x-2 py-2 hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
                
                <Link 
                  to="/register" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors inline-block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;