import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { events } from './eventDetails';

const RegistrationPage = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  
  // 1. Find the specific event data based on the URL ID
  const event = events.find(e => e.id === parseInt(eventID));

  // Handle case where ID doesn't exist
  if (!event) {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">Event not found 😕</h1>
            <button onClick={() => navigate('/')} className="text-blue-400 hover:underline">Go Home</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans flex items-center justify-center py-20">
        
      {/* --- BACKGROUND (Same as WelcomePage) --- */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'hue-rotate(15deg) contrast(1.2)'
        }}
      />
      {/* Dark Overlay for focus */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-900/90"></div>

      {/* --- THE CARD (Reused Design) --- */}
      {/* Width 85%, Max 1000px, Rounded, Shadow */}
      <div className="relative z-10 w-[85%] max-w-[1000px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* LEFT: Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
            <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Date Badge (On Right) */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-xl font-bold shadow-lg">
                📆 {event.date}
            </div>
            
            {/* Back Button Overlay */}
            <button 
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-md transition-all text-sm"
            >
                ⬅ Back
            </button>
        </div>

        {/* RIGHT: Content Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white text-gray-900">
            <h2 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-wide">
                {event.title}
            </h2>
            <h3 className="text-lg font-bold text-blue-600 mb-6">
                {event.tagline}
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {event.description}
            </p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8 text-sm text-gray-700">
                <div>
                    <span className="block font-bold text-gray-400 uppercase text-xs">Time</span>
                    <span className="font-semibold text-lg">{event.time}</span>
                </div>
                <div>
                    <span className="block font-bold text-gray-400 uppercase text-xs">Location</span>
                    <span className="font-semibold text-lg">{event.location}</span>
                </div>
                <div>
                    <span className="block font-bold text-gray-400 uppercase text-xs">Price</span>
                    <span className="font-semibold text-lg text-green-600">
                        {event.price === 0 ? "FREE" : `₹${event.price}`}
                    </span>
                </div>
            </div>

            {/* CONFIRM BUTTON */}
            <button 
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform transition-all active:scale-95 text-xl"
                onClick={() => alert(`🎉 SUCCESS! You are registered for ${event.title}`)}
            >
                Confirm Registration 
            </button>
        </div>

      </div>
    </div>
  );
};

export default RegistrationPage;