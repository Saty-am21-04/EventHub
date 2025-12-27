import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import html2canvas from "html2canvas"; 
import PaymentModal from "./PaymentModal"; 
import LoadingScreen from "./LoadingScreen";
// FIX 1: Corrected import name to match the likely filename
import SmartRegisterModal from "./SmartRegisterModal";
import { API_URL } from "../config";

// --- 1. BACK TO TOP BUTTON ---
const BackToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setIsVisible(true);
      else setIsVisible(false);
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
        group fixed bottom-8 right-8 z-[100] border-none outline-none cursor-pointer
        w-[50px] h-[50px] rounded-full bg-[rgb(20,20,20)]
        shadow-[0px_0px_0px_4px_rgba(180,160,255,0.253)]
        flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out
        hover:w-[140px] hover:rounded-[50px] hover:bg-[rgb(181,160,255)]
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
      `}
    >
      <svg className="w-[12px] fill-white transition-all duration-300 group-hover:-translate-y-[200%]" viewBox="0 0 384 512">
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
      </svg>
      <span className="absolute text-white font-semibold text-[13px] opacity-0 translate-y-[200%] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        Back to Top
      </span>
    </button>
  );
};

// --- 2. BACK BUTTON ---
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/')} className="group relative block w-[56px] h-[56px] overflow-hidden outline-none bg-transparent border-none cursor-pointer z-50">
      <div className="absolute inset-[7px] border-4 border-[#f0eeef] rounded-full transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-75 group-hover:opacity-0"></div>
      <div className="absolute inset-[7px] border-4 border-[#96daf0] rounded-full scale-125 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-100 group-hover:opacity-100"></div>
      <div className="absolute top-0 left-0 flex transition-transform duration-700 group-hover:-translate-x-[56px]">
        <div className="w-[56px] h-[56px] flex items-center justify-center">
           <svg viewBox="0 0 46 40" className="w-5 h-5 fill-[#f0eeef] rotate-180 mt-1"><path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path></svg>
        </div>
        <div className="w-[56px] h-[56px] flex items-center justify-center">
           <svg viewBox="0 0 46 40" className="w-5 h-5 fill-[#f0eeef] rotate-180 mt-1"><path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path></svg>
        </div>
      </div>
    </button>
  );
};

// --- 3. DOWNLOAD BUTTON ---
const DownloadBtn = ({ onClick }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = () => {
    setIsDownloading(true);
    onClick();
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <button 
      onClick={handleClick}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full 
        bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white 
        shadow-[0_4px_10px_rgba(0,0,0,0.2)] 
        transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_15px_rgba(59,130,246,0.3)]
        active:scale-95
        ${isDownloading ? 'cursor-wait opacity-80' : 'cursor-pointer'}
      `}
      title="Download Ticket"
    >
      {isDownloading ? (
        <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      )}
    </button>
  );
};

// --- 4. SHARE BUTTON ---
const ShareBtn = ({ eventName }) => {
  const shareText = `I just got my ticket for ${eventName}! Join me there.`;
  const shareUrl = window.location.href; 

  return (
    <div className="relative inline-block group z-40">
      <div className="flex items-center justify-center bg-gradient-to-br from-[#6e8efb] to-[#a777e3] text-white px-4 py-2 rounded-full cursor-pointer shadow-[0_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-gradient-to-br hover:from-[#a777e3] hover:to-[#6e8efb] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:scale-105 active:scale-95 active:shadow-[0_5px_10px_rgba(0,0,0,0.15)] relative overflow-hidden">
        <span className="text-sm font-semibold mr-2 tracking-wide group-hover:tracking-wider transition-all duration-300">Share</span>
        <svg className="fill-white w-5 h-5 transition-transform duration-400 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:rotate-180 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.3 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] transform scale-75 group-hover:scale-100 origin-bottom flex gap-3 min-w-[140px] justify-center">
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/95 drop-shadow-sm"></div>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-400 hover:text-white transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg></a>
        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-green-500 hover:text-white transition-colors"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.239a9.961 9.961 0 004.779 1.224h.004c5.507 0 9.99-4.478 9.99-9.984C22.005 6.661 17.518 2 12.012 2zm0 18.288h-.004a8.296 8.296 0 01-4.225-1.166l-.303-.18-3.142.744.838-3.056-.197-.314a8.291 8.291 0 01-1.269-4.328c.001-4.573 3.733-8.296 8.302-8.296 2.217 0 4.302.863 5.869 2.432 1.567 1.568 2.429 3.654 2.428 5.874-.001 4.574-3.734 8.29-8.298 8.29zm4.538-6.213c-.249-.124-1.472-.726-1.699-.809-.228-.083-.394-.124-.56.125-.166.249-.642.809-.787.975-.145.166-.29.187-.539.062-.249-.124-1.051-.387-2.003-1.235-.742-.662-1.243-1.48-1.389-1.73-.145-.249-.015-.383.109-.507.111-.11.249-.29.373-.436.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.124-.56-1.348-.767-1.846-.201-.485-.406-.419-.56-.426l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.85-.871 2.073 0 1.224.891 2.406 1.015 2.572.124.166 1.754 2.678 4.249 3.755 2.495 1.077 2.495.718 2.951.676.456-.041 1.472-.601 1.679-1.181.207-.58.207-1.078.145-1.181-.062-.104-.228-.166-.477-.29z"></path></svg></a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gradient-to-br hover:from-[#0077b5] hover:to-[#005e94] hover:-translate-y-1 hover:scale-110 hover:shadow-md transition-all duration-300 group/icon"><svg className="w-5 h-5 fill-gray-700 group-hover/icon:fill-white transition-colors" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg></a>
      </div>
    </div>
  );
};

// --- MAIN EVENT PASS COMPONENT ---
const EventPass = () => {
    const { eventID } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAI, setShowAI] = useState(false);
    const navigate = useNavigate();
    
    const [isFull, setIsFull] = useState(false);
    // --- STATE ---
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [tickets, setTickets] = useState([]);
    const [age, setAge] = useState("");
    const [ticketType, setTicketType] = useState("General");
    const [showPayment, setShowPayment] = useState(false); 
    
    const isNameValid = /^[A-Za-z\s]{6,}$/.test(name);
    // --- UPDATED EMAIL VALIDATION ---
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const isAgeValid = age >= 18 && age <= 25;
    const isFormValid = isNameValid && isEmailValid && isAgeValid;

    // const event = events.find(e => e.id === parseInt(eventID));
    
    // --- SMART AUTO-FILL LOGIC ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/events/${eventID}`);

                if(!res.ok) {
                    setEvent(null);
                    setLoading(false);
                    return;
                }

                const eventData = await res.json();
                setEvent(eventData);

                const bookRes = await fetch(`${API_URL}/api/admin/bookings`);
                const allBookings = await bookRes.json();

                const eventBookingsCount = allBookings.filter(b => b.eventID === parseInt(eventID)).length;

                if (eventBookingsCount >= (eventData.maxCapacity || 50)) {
                    setIsFull(true);
                }
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setEvent(null);
                setLoading(false);
            }
        };
        fetchData();

        const savedUser = JSON.parse(localStorage.getItem("userProfile") || "{}");
        const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
        
        // 2. Set displayed tickets
        const eventTickets = allBookings.filter(t => t.eventId === parseInt(eventID));
        setTickets(eventTickets);

        // 3. Check if LOGGED-IN user is ALREADY registered
        const isUserRegistered = allBookings.some(ticket => 
            ticket.eventId === parseInt(eventID) && 
            ticket.email === savedUser.email
        );

        if (isUserRegistered) {
            // Already registered? CLEAR FIELDS so they can register a friend
            setName("");
            setEmail("");
        } else {
            // Not registered? AUTO-FILL from profile
            setName(savedUser.name || "");
            setEmail(savedUser.email || "");
        }
    }, [eventID]);

    if (loading) return <LoadingScreen />;

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">Event not found 😕</h1>
                <button onClick={() => navigate('/')} className="text-blue-400 hover:underline">Go Home</button>
            </div>
        );
    }

    const getTicketTheme = (type) => {
        switch (type) {
            case "VIP": return { border: "border-purple-500", headerBg: "bg-gradient-to-r from-purple-700 to-indigo-900", badge: "bg-purple-900/30 text-purple-300 border border-purple-500/50", shadow: "shadow-purple-500/20" };
            case "Backstage": return { border: "border-yellow-500", headerBg: "bg-gradient-to-r from-yellow-700 to-yellow-900", badge: "bg-yellow-900/30 text-yellow-300 border border-yellow-500/50", shadow: "shadow-yellow-500/20" };
            default: return { border: "border-blue-500", headerBg: "bg-gradient-to-r from-blue-700 to-cyan-800", badge: "bg-blue-900/30 text-blue-300 border border-blue-500/50", shadow: "shadow-blue-500/20" };
        }
    };

    const generateTicket = () => {
        const newTicket = {
            id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            eventId: event.id,          
            eventName: event.title,     
            eventDate: event.date,      
            eventLocation: event.location, 
            name: name,
            email: email,
            age: age,
            type: ticketType
        };

        fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTicket)
        })
        .then(res => res.json())
        .then(data => {
            
            const updatedTickets = [...tickets, newTicket];
            setTickets(updatedTickets);
            
            const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
            localStorage.setItem("myBookings", JSON.stringify([...allBookings, newTicket]));
            
            alert("Ticket Generated & Saved to Cloud! 🎉");

            // --- CLEAR FIELDS AFTER REGISTRATION ---
            setAge("");
            setTicketType("General");
            
            setName("");
            setEmail("");
            
            setShowPayment(false);             
        });

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check for duplicates before paying/generating
        const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
        const isDuplicate = allBookings.some(ticket => 
            ticket.eventId === event.id && 
            ticket.email.toLowerCase() === email.toLowerCase()
        );

        if (isDuplicate) {
            alert("⚠️ This email is already registered for this event.");
            return;
        }

        if (event.price > 0) {
            setShowPayment(true);
        } else {
            generateTicket();
        }
    };

    const removeTicket = (idToRemove) => {
        // 1. Find ticket to be deleted
        const ticketToDelete = tickets.find(t => t.id === idToRemove);

        const updatedTickets = tickets.filter(ticket => ticket.id !== idToRemove);
        setTickets(updatedTickets);
        const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
        const remainingBookings = allBookings.filter(t => t.id !== idToRemove);
        localStorage.setItem("myBookings", JSON.stringify(remainingBookings));

        // --- CHECK: IF DELETED TICKET BELONGS TO USER, RE-FILL FORM ---
        const savedUser = JSON.parse(localStorage.getItem("userProfile") || "{}");
        if (ticketToDelete && ticketToDelete.email === savedUser.email) {
            setName(savedUser.name || "");
            setEmail(savedUser.email || "");
        }
    };

    const handleDownload = async (elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 100)); 
            const canvas = await html2canvas(element, {
                backgroundColor: null, 
                scale: 2,
                useCORS: true, 
                logging: false,
            });
            const link = document.createElement("a");
            link.download = `Ticket-${elementId}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Could not download ticket.");
        }
    };

    const handleAIFill = (data) => {
        // Map AI fields to your Form state
        if (data.name) setName(data.name);
        if (data.email) setEmail(data.email);
        
        // If AI returns extracted age (check your backend controller prompt!), set it
        if (data.age) setAge(data.age); 
        if (data.year) setAge(data.year); // Fallback if backend sends 'year' instead of 'age'

        // Optional: Map 'eventInterest' to Ticket Type if you get fancy later
        // if (data.eventInterest && data.eventInterest.toLowerCase().includes('vip')) setTicketType('VIP');
        
        alert("✨ AI Magic applied! Please review the details.");
    };

    return (
        // FIX 1: 'min-h-screen' ensures full height. 'pb-40' gives huge bottom space for mobile.
        // 'justify-start' for mobile (so content starts at top), 'md:justify-center' for desktop.
        <div className="min-h-screen h-full relative font-sans pt-24 pb-40 px-4 sm:px-6 lg:px-8 flex flex-col justify-start md:justify-center items-center">
            
            {showPayment && (
                <PaymentModal 
                    event={event} 
                    onClose={() => setShowPayment(false)} 
                    onSuccess={generateTicket} 
                />
            )}

            <div className="absolute top-6 left-6 z-50">
               <BackButton />
            </div>

            <BackToTopBtn />

            <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', filter: 'brightness(0.3)' }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900/90 via-blue-900/20 to-gray-900/90"></div>

            <div className="relative z-10 w-full max-w-5xl">
                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl mb-16 overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-5/12 relative h-48 md:h-auto group overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                            <h2 className="text-2xl font-black uppercase leading-tight mb-3 drop-shadow-md">{event.title}</h2>
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                                <span className="bg-blue-600 px-3 py-1 rounded-full shadow-lg">📅 {event.date}</span>
                                <span className="bg-purple-600 px-3 py-1 rounded-full shadow-lg">📍 {event.location}</span>
                                {event.price > 0 && <span className="bg-green-600 px-3 py-1 rounded-full shadow-lg">₹{event.price}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-7/12 p-6 md:p-10 bg-gray-900/60">
                        <div className="mb-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-400 mb-1 tracking-widest uppercase">Registration</h3>
                                    <h1 className="text-3xl font-black text-white">Get Your Pass 🎟️</h1>
                                </div>
                                
                                {/* --- NEW AI BUTTON --- */}
                                {/* FIX 2: Removed inline comment from props */}
                                <button 
                                    type="button" 
                                    onClick={() => setShowAI(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <span>✨</span> AI Fill
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">Fill in your details or use AI to auto-complete.</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Full Name</label>
                                <input type="text" value={name} placeholder="e.g. Satyam Mondal" onChange={(e) => setName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border bg-gray-800/50 text-white placeholder-gray-500 outline-none transition-all duration-300 ${name && !isNameValid ? 'border-red-500/50 focus:border-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} />
                                {name && !isNameValid && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">⚠️ Name must be 6+ chars & no numbers</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">College Email</label>
                                <input type="text" value={email} placeholder="student@college.org.in" onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-3 rounded-xl border bg-gray-800/50 text-white placeholder-gray-500 outline-none transition-all duration-300 ${email && !isEmailValid ? 'border-red-500/50 focus:border-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} />
                                {/* UPDATED ERROR MESSAGE */}
                                {email && !isEmailValid && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">⚠️ Email must end with @college.org.in</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Age</label>
                                    <input type="number" value={age} placeholder="18-25" onChange={(e) => setAge(e.target.value)} className={`w-full px-4 py-3 rounded-xl border bg-gray-800/50 text-white placeholder-gray-500 outline-none transition-all duration-300 ${age && !isAgeValid ? 'border-red-500/50 focus:border-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Ticket Type</label>
                                    <select value={ticketType} onChange={(e) => setTicketType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:border-blue-500 outline-none cursor-pointer appearance-none">
                                        <option value="General" className="bg-gray-900">General</option>
                                        <option value="VIP" className="bg-gray-900">VIP ✨</option>
                                        <option value="Backstage" className="bg-gray-900">Backstage 🔒</option>
                                    </select> 
                                </div>
                            </div>
                            {age && !isAgeValid && <p className="text-red-400 text-xs ml-1 font-medium">⚠️ Age must be 18-25</p>}
                            
                            {/* FIX 3: Corrected spacing in className ternary to avoid concatenated string error */}
                            <button type="submit" disabled={!isFormValid || isFull} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all duration-200 uppercase tracking-widest mt-4 mb-4 ${isFull ? 'bg-red-900 text-red-400 cursor-not-allowed' : isFormValid ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] hover:shadow-blue-500/25 active:scale-95' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                                {isFull ? "⚠️ EVENT FULL / SOLD OUT" : (event.price > 0 ? `Pay ₹${event.price} & Generate` : 'Generate Ticket 🎟️')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {showAI && (
                <SmartRegisterModal 
                    onClose={() => setShowAI(false)}
                    onFill={handleAIFill}
                />
            )}
            
            {tickets.length > 0 && (
                <div className="relative z-10 max-w-7xl mx-auto w-full animate-fade-in-up">                
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="h-px bg-gray-700 w-20"></div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Your Tickets ({tickets.length})</h2>
                        <div className="h-px bg-gray-700 w-20"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
                        {tickets.map((ticket) => {
                            const theme = getTicketTheme(ticket.type);
                            return (
                                <div id={ticket.id} key={ticket.id} className={`bg-gray-800 rounded-3xl overflow-hidden border-2 flex flex-col transform transition hover:-translate-y-2 duration-300 ${theme.border} ${theme.shadow} relative group`}>
                                    <div className={`${theme.headerBg} text-white p-5 text-center relative overflow-hidden`}>
                                        <button onClick={() => removeTicket(ticket.id)} data-html2canvas-ignore="true" className="absolute top-3 right-3 text-white/60 hover:text-white hover:bg-red-500 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 z-20 focus:outline-none" title="Remove Ticket">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        </button>
                                        <h2 className="text-2xl font-black uppercase tracking-widest relative z-10">{ticket.type}</h2>
                                        <p className="text-[10px] tracking-[0.3em] opacity-70 relative z-10">OFFICIAL ACCESS</p>
                                    </div>
                                    <div className="p-6 space-y-5 flex-grow relative bg-gray-900/50 backdrop-blur-sm">
                                        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-900 rounded-full border-r border-gray-700"></div>
                                        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-900 rounded-full border-l border-gray-700"></div>
                                        <div className="border-b border-dashed border-gray-700 pb-4">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Attendee</p>
                                            <p className="text-xl font-bold text-white truncate">{ticket.name}</p>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div className="w-2/3">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Contact</p>
                                                <p className="text-xs text-gray-300 break-words font-medium">{ticket.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Age</p>
                                                <p className="text-lg font-bold text-white">{ticket.age}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-800 p-4 border-t-2 border-dashed border-gray-700 text-center relative">
                                        <div className="flex justify-center items-center gap-3 mb-3 flex-wrap">
                                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.id}`} alt="QR" className="h-10 w-10" crossOrigin="anonymous" />
                                            </div>
                                            <div data-html2canvas-ignore="true" className="flex items-center gap-2">
                                                <ShareBtn eventName={event.title} ticketId={ticket.id} />
                                                <div className="transform scale-75 origin-right">
                                                    <DownloadBtn onClick={() => handleDownload(ticket.id)} />
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase ${theme.badge}`}>#{ticket.id.split('-')[1]}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventPass;