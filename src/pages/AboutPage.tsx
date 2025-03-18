import React from 'react';
import { Linkedin, Github, Mail, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Rohith',
      role: 'CHRIST University | BCA',
      bio: 'ACC Choir | ACC Core | University Choir | Afterhours Production | Team Vizerion | Zendappen Acapella | Misopella Acapella',
      image: '/images/rohith.jpg',  // ✅ Fixed Path
      linkedin: 'https://linkedin.com/in/rohithrockie',
      github: 'https://github.com/Igneelsane'
    },
    {
      name: 'Hazin',
      role: 'CHRIST University | BCA',
      bio: 'Afterhours Production | Team Vizerion | DPE | Graphic Designer | Motta Kallan ',
      image: '/images/hazin.jpeg',  // ✅ Fixed Path
      linkedin: 'https://linkedin.com/in/mohammedhazin',
      github: 'https://github.com/hazin'
    },
    {
      name: 'Jeromss',
      role: 'CHRIST University | BCA',
      bio: 'ACC Choir | Afterhours Production | Team Vizerion | University Football Team',
      image: '/images/jeroms.jpg',  // ✅ Fixed Path
      linkedin: 'https://www.linkedin.com/in/jerom-samuel-92a94b2ba/',
      github: 'https://github.com/jerom'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">About StockPred</h1>
      
      <div className="bg-black p-8 rounded-lg border border-gray-800 shadow-md mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
        <p className="text-gray-400 mb-6">
          At StockPred, we're dedicated to democratizing stock market prediction through advanced machine learning algorithms and real-time data analysis.
        </p>
        <p className="text-gray-400 mb-6">
          Founded in December 2024, StockPred focuses on the Indian stock market, offering comprehensive analysis of NSE and BSE-listed companies.
        </p>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Our Prediction Models</h3>
          <ul className="space-y-2 text-gray-400">
            <li><strong className="text-white">Linear Regression:</strong> Stable market trend predictions</li>
            <li><strong className="text-white">Moving Average:</strong> Noise reduction for clearer trends</li>
            <li><strong className="text-white">Random Forest:</strong> Advanced multi-factor analysis</li>
          </ul>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-black p-6 rounded-lg border border-gray-800 shadow-md">
            <div className="flex flex-col items-center mb-4">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-32 h-32 rounded-full object-cover border-2 border-green-500"
              />
              <h3 className="text-xl font-bold text-white mt-4">{member.name}</h3>
              <p className="text-green-500">{member.role}</p>
            </div>
            
            <p className="text-gray-400 text-center mb-6">{member.bio}</p>
            
            <div className="flex justify-center space-x-4">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2 bg-blue-900 text-blue-300 rounded-full hover:bg-blue-800 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer"
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black p-8 rounded-lg border border-gray-800 shadow-md mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Recharts"] },
            { title: "Backend", items: ["Firebase", "Realtime Database", "Authentication", "Cloud Functions"] },
            { title: "Data Sources", items: ["Alpha Vantage API", "Historical Stock Data", "Company Information", "Market Indices"] },
            { title: "ML Models", items: ["Linear Regression", "Moving Average", "Random Forest", "Custom Algorithms"] }
          ].map((stack, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">{stack.title}</h3>
              <ul className="text-gray-400 space-y-1">
                {stack.items.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black p-8 rounded-lg border border-gray-800 shadow-md text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href="mailto:contact@stockpred.com" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
            <Mail size={18} /><span>contact@stockpred.com</span>
          </a>
          <a href="https://github.com/igneelsane" target="_blank" rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
            <Github size={18} /><span>GitHub</span>
          </a>
          <a href="https://stockpred.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
            <Globe size={18} /><span>www.stockpred.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
