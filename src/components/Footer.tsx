import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, 
  BarChart2, 
  PlayCircle, 
  Info, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Newspaper,
  Twitter,
  Linkedin,
  Github,
  Facebook
} from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-t mt-auto`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Home size={16} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/market-data" 
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <BarChart2 size={16} />
                  <span>Market Data</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/simulation" 
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <PlayCircle size={16} />
                  <span>Simulation</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Info size={16} />
                  <span>About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* User Section */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              User Section
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/saved-stocks" 
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Save size={16} />
                  <span>Saved Stocks</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <User size={16} />
                  <span>Login</span>
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <Mail size={16} />
                <span>contact@stockpred.com</span>
              </li>
              <li className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <Phone size={16} />
                <span>+91 0123456789</span>
              </li>
              <li className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <MapPin size={16} />
                <span>Bangalore Yeshwanthpur Campus

Nagasandra, Near Tumkur Road, Bangalore,
Karnataka-560073</span>
              </li>
            </ul>
          </div>

          {/* Social Media & RSS */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              
              <a 
                href="https://linkedin.com/company/stockpred" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/Igneelsane/StockPred" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Github size={20} />
              </a>
              
            </div>
            
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex flex-col md:flex-row justify-center items-center text-center w-full">
  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
    © {new Date().getFullYear()} StockPred. All rights reserved.
  </p>
</div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;