import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative font-sans flex flex-col items-center justify-center text-white overflow-hidden">
      
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'hue-rotate(15deg) contrast(1.2) brightness(0.2)' 
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center p-8">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4 animate-pulse">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
        >
          Go Home
        </button>
      </div>

    </div>
  );
};

export default NotFound;