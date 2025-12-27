import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LoadingScreen from "./LoadingScreen";
import { API_URL } from "../config";

// --- 1. LOGOUT BUTTON ---
const LogoutBtn = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="
        group flex items-center justify-start
        w-[45px] h-[45px] border-none rounded-full cursor-pointer relative overflow-hidden
        transition-all duration-300 shadow-[2px_2px_10px_rgba(0,0,0,0.199)]
        bg-red-500 hover:w-[125px] hover:rounded-[40px]
        active:translate-x-[2px] active:translate-y-[2px]
      "
    >
      <div className="sign w-full transition-all duration-300 flex items-center justify-center group-hover:w-[30%] group-hover:pl-5">
        <svg viewBox="0 0 512 512" className="w-[17px] fill-white">
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
        </svg>
      </div>
      <div className="absolute right-0 w-0 opacity-0 text-white text-[1.2em] font-semibold transition-all duration-300 group-hover:opacity-100 group-hover:w-[70%] group-hover:pr-2.5">
        Logout
      </div>
    </button>
  );
};

// --- 2. BACK TO TOP BUTTON ---
const BackToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        group fixed bottom-8 right-8 z-50
        w-[50px] h-[50px] rounded-full bg-[rgb(20,20,20)]
        border-none font-semibold flex items-center justify-center
        shadow-[0px_0px_0px_4px_rgba(180,160,255,0.253)]
        cursor-pointer transition-all duration-300 overflow-hidden
        hover:w-[140px] hover:rounded-[50px] hover:bg-[rgb(181,160,255)]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
    >
      <svg className="w-[12px] transition-all duration-300 fill-white group-hover:-translate-y-[200%]" viewBox="0 0 384 512">
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
      </svg>
      <span className="absolute text-white text-[0px] transition-all duration-300 group-hover:text-[13px] group-hover:opacity-100">
        Back to Top
      </span>
    </button>
  );
};

// --- MAIN WELCOME PAGE ---
const WelcomePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // AI RECOMMENDATION STATES
    const [aiLoading, setAiLoading] = useState(false);
    const [showRecs, setShowRecs] = useState(false);
    const [recommendedEvents, setRecommendedEvents] = useState([]);

    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    // Logic to filter events based on search input
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.tagline.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetch(`${API_URL}/api/events`)
            .then(res => res.json()) 
            .then(data => setEvents(data))
            .catch(err => console.error("Failed to load events:", err));
    }, []); 

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleRegister = (eventID) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const token = localStorage.getItem("userToken");
            if (token) {
                navigate(`/register/${eventID}`);
            } else {            
                navigate('/login', {state: {from: `/register/${eventID}`}});
            }
        }, 1500); 
    }

   const handleAIRecommendation = async () => {
        const token = localStorage.getItem("userToken");
        const storedProfile = localStorage.getItem("userProfile");
        
        if (!token || !storedProfile) {
            alert("Please login to get personalized recommendations!");
            navigate('/login');
            return;
        }

        const userProfile = JSON.parse(storedProfile);

        if (!userProfile._id) {
            alert("Your session data is outdated. Please Log Out and Log In again to refresh it.");
            return;
        }

        setShowRecs(true);
        setAiLoading(true);

        try {
            console.log("🚀 Sending AI Request for User ID:", userProfile._id); 

            const res = await fetch(`${API_URL}/api/events/recommendations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userProfile._id })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server Error (${res.status}): ${errorText}`);
            }

            const data = await res.json();
            console.log("✅ AI Response Full Object:", data);

            if (Array.isArray(data)) {
                setRecommendedEvents(data);
            } else if (data.events && Array.isArray(data.events)) {
                setRecommendedEvents(data.events);
            } else if (data.recommendations && Array.isArray(data.recommendations)) {
                setRecommendedEvents(data.recommendations);
            } else if (data.data && Array.isArray(data.data)) {
                setRecommendedEvents(data.data);
            } else {
                console.error("❌ Structure mismatch! React expected an Array but got:", data);
                setRecommendedEvents([]); 
            }

        } catch (error) {
            console.error("❌ AI Error Details:", error);
            alert(`AI Failed: ${error.message}`); 
            setShowRecs(false);
        } finally {
            setAiLoading(false);
        }
    };

    const handleLogout = () => {
        if(window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userProfile"); 
            setIsLoggedIn(false);
            navigate('/login');
        }
    }

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <div className={`min-h-screen h-full relative font-sans transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            
            {isLoading && <LoadingScreen />}
            
            <BackToTopBtn />

            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    filter: isDarkMode ? 'hue-rotate(15deg) contrast(1.2)' : 'opacity(0.15) saturate(0)' 
                }}
            />  

            <div className={`absolute inset-0 z-0 transition-all duration-500 ${
                isDarkMode 
                ? 'bg-gradient-to-b from-gray-900/90 via-gray-900/60 to-gray-900/90' 
                : 'bg-gradient-to-b from-gray-50/90 via-gray-50/40 to-gray-50/90'
            }`}></div>

            <div className={`relative z-10 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>

                <nav className={`p-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-gray-900/80 border-b border-gray-800' : 'bg-white/80 border-b border-gray-200'}`}>
                    <h1 className="text-2xl font-black tracking-tighter">
                        Event<span className="text-blue-600">Hub</span>
                    </h1>

                    <div className="flex items-center gap-4">
                        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                        
                        {isLoggedIn && <LogoutBtn onLogout={handleLogout} />}

                        <button 
                            onClick={() => {
                                const token = localStorage.getItem("userToken");
                                navigate(token ? '/profile' : '/login');
                            }}
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 shadow-lg hover:scale-110 transition-transform"
                        >
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                               {localStorage.getItem("userProfile") ? (
                                   <img src={JSON.parse(localStorage.getItem("userProfile")).avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User" className="w-full h-full object-cover" />
                               ) : (
                                   <span className="text-lg">👤</span>
                               )}
                            </div>
                        </button>
                    </div>
                </nav>

                <header className="py-20 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        Discover. Compete. Win.
                    </h1>
                    <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Join the biggest student events of the year. Secure your spot now.
                    </p>
                </header>

                {/* --- SEARCH & AI BAR --- */}
                <div className="max-w-xl mx-auto mb-12 px-4 flex flex-col gap-4">
                    <div className="relative group w-full">
                        <input 
                            type="text" 
                            placeholder="Search for workshops, fests, or tournaments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full p-4 pl-12 rounded-2xl border bg-opacity-50 backdrop-blur-md outline-none transition-all ${
                                isDarkMode ? 'bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:bg-gray-800' : 'bg-white/50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                            }`}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
                    </div>

                    {/* AI BUTTON */}
                    <button
                        onClick={handleAIRecommendation}
                        className="
                            relative overflow-hidden w-full p-3 rounded-2xl font-bold text-white shadow-xl
                            bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-600 via-purple-600 to-blue-600
                            bg-[length:200%_200%] animate-[gradient_3s_ease-in-out_infinite]
                            hover:scale-[1.02] transition-transform
                            flex items-center justify-center gap-2 group border border-white/10
                        "
                    >
                         {/* Sparkle Icon */}
                        <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="tracking-wide drop-shadow-sm">Curate Events For Me (AI)</span>
                    </button>

                    {searchTerm && (
                        <p className="text-xs mt-2 text-blue-400 ml-2">
                            Found {filteredEvents.length} results for "{searchTerm}"
                        </p>
                    )}
                </div>

                {/* --- EVENTS LIST --- */}
                <div className="w-[90%] md:w-[85%] max-w-[1000px] mx-auto pb-20 space-y-12">
                    {filteredEvents.map((event, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={event.id || event._id}
                                className={`group relative flex flex-col md:flex-row md:h-[400px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 ${isEven ? '' : 'md:flex-row-reverse'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                            >
                                {/* Image Section */}
                                <div className="relative w-full md:w-1/2 h-56 md:h-full transition-all duration-700 ease-in-out group-hover:md:w-[40%]">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-xl font-bold shadow-lg">
                                        📆 {new Date(event.date).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="relative w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out group-hover:md:w-[60%]">
                                    <h2 className="text-3xl font-black mb-2 uppercase tracking-wide">{event.title}</h2>
                                    <h3 className="text-lg font-bold text-blue-500 mb-6">{event.tagline}</h3>

                                    <p className={`mb-8 md:line-clamp-3 group-hover:line-clamp-none transition-all duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {event.description}
                                    </p>

                                    {/* Footer */}
                                    <div className={`
                                        flex gap-4 mt-auto
                                        flex-col opacity-100 translate-y-0
                                        md:flex-row md:items-center md:justify-between
                                        md:opacity-0 md:translate-y-10
                                        md:group-hover:opacity-100 md:group-hover:translate-y-0
                                        transition-all duration-500
                                    `}>
                                        
                                        <div className="flex flex-col md:flex-row md:gap-8 gap-2 flex-1">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase text-gray-400">Time</span>
                                                <span className="font-semibold whitespace-nowrap">{event.time}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase text-gray-400">Location</span>
                                                <span className="font-semibold">{event.location}</span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full md:w-auto md:ml-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
                                            onClick={() => handleRegister(event._id || event.id)}
                                        >
                                            Register ➡️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-20 text-gray-500 font-bold">
                            No events found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* --- AI RECOMMENDATION MODAL (PREMIUM COLOR GRADING) --- */}
            {showRecs && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    {/* Backdrop with deeper blur and color tint */}
                    <div 
                        className={`absolute inset-0 backdrop-blur-md transition-opacity ${isDarkMode ? 'bg-black/80' : 'bg-gray-900/20'}`}
                        onClick={() => setShowRecs(false)}
                    ></div>

                    {/* Modal Content - High Depth & Premium Feel */}
                    <div className={`relative w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6 md:p-8 border transition-all ${
                        isDarkMode 
                        ? 'bg-[#0a0a0a] border-purple-500/20 shadow-[0_0_40px_rgba(139,92,246,0.1)]' 
                        : 'bg-white/80 backdrop-blur-2xl border-white/40 shadow-2xl'
                    }`}>
                        
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                             <h2 className="text-3xl md:text-4xl font-black tracking-tight relative">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                    🤖 AI's Top Picks
                                </span>
                                {isDarkMode && <div className="absolute -inset-1 blur-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 -z-10"></div>}
                            </h2>
                            <button onClick={() => setShowRecs(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {aiLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
                                    <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-blue-500/30"></div>
                                </div>
                                <p className={`text-lg font-medium animate-pulse ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>crunching data to find your perfect matches...</p>
                            </div>
                        ) : (
                            <>
                                {recommendedEvents.length === 0 ? (
                                    <div className="text-center py-16 flex flex-col items-center">
                                        <div className="text-7xl mb-6 grayscale opacity-80">🤷‍♂️</div>
                                        <h3 className={`text-2xl font-black mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            No perfect matches yet.
                                        </h3>
                                        <p className={`max-w-md text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Our AI couldn't find an exact fit based on your profile right now. Try exploring all events!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {recommendedEvents.map((event) => (
                                            <div key={event._id || event.id} className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 group hover:-translate-y-1 border ${
                                                isDarkMode 
                                                ? 'bg-gray-900/50 border-white/5 hover:border-purple-500/30 hover:bg-gray-900/80 hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)]' 
                                                : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200'
                                            }`}>
                                                
                                                {/* Card Image & Badge */}
                                                <div className="h-44 overflow-hidden relative">
                                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase backdrop-blur-md border shadow-lg ${
                                                        isDarkMode
                                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                                        : 'bg-emerald-500 text-white border-emerald-400'
                                                    }`}>
                                                        {event.matchScore}% Match
                                                    </div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <h3 className={`text-xl font-extrabold mb-3 leading-tight line-clamp-2 ${isDarkMode ? 'text-white group-hover:text-purple-300' : 'text-gray-900 group-hover:text-blue-700'} transition-colors`}>
                                                        {event.title}
                                                    </h3>
                                                    
                                                    {/* Premium AI Reason Box */}
                                                    <div className={`p-4 rounded-xl mb-5 text-sm leading-relaxed flex-grow border-l-[3px] relative overflow-hidden ${
                                                        isDarkMode 
                                                        ? 'bg-violet-500/10 border-violet-400 text-violet-100' 
                                                        : 'bg-blue-50/80 border-blue-400 text-blue-900'
                                                    }`}>
                                                        {isDarkMode && <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none"></div>}
                                                        <span className="font-bold mr-1 opacity-70">AI Insight:</span>
                                                        <span className="italic">"{event.aiReason}"</span>
                                                    </div>

                                                    <button 
                                                        onClick={() => {
                                                            setShowRecs(false); 
                                                            handleRegister(event._id || event.id);
                                                        }}
                                                        className={`w-full py-3 rounded-xl text-sm font-black tracking-wider uppercase transition-all active:scale-95 relative overflow-hidden group/btn ${
                                                            isDarkMode 
                                                            ? 'bg-white text-black hover:bg-gray-200' 
                                                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20'
                                                        }`}
                                                    >
                                                       View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomePage;