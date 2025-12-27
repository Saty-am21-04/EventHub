import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myTickets, setMyTickets] = useState([]); // State for booked tickets

  // Default User State
  const [user, setUser] = useState({
    name: "Satyam Mondal",
    email: "student@college.edu",
    role: "Student Developer",
    bio: "Passionate about cybersecurity and full-stack development. Ready to hack the future!",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" 
  });

  // Load User & Tickets from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    const savedTickets = localStorage.getItem("myBookings");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTickets) setMyTickets(JSON.parse(savedTickets));
    
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(user));
    setIsEditing(false);
    alert("Profile Updated Successfully! 💾");
  };

  const cancelBooking = (id) => {
      if(window.confirm("Are you sure you want to cancel this booking?")) {
          const updated = myTickets.filter(t => t.id !== id);
          setMyTickets(updated);
          localStorage.setItem("myBookings", JSON.stringify(updated));
      }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Profile...</div>;

  return (
    <div className="min-h-screen relative font-sans flex flex-col items-center py-12 px-4">
      
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', filter: 'brightness(0.3)' }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900/90 via-blue-900/20 to-gray-900/90"></div>

      {/* --- SECTION 1: PROFILE CARD --- */}
      <div className="relative z-10 w-full max-w-4xl bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row mb-12">
        {/* Left: Avatar */}
        <div className="md:w-1/3 bg-gray-900/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-700/50 relative">
            <div className="relative group w-40 h-40 mb-6">
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full border-4 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform duration-500 group-hover:scale-105" />
                {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Change 📷</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                )}
            </div>
            <h2 className="text-2xl font-black text-white text-center mb-1">{user.name}</h2>
            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">{user.role}</p>
            <div className="flex gap-3 w-full">
                <button onClick={() => navigate('/')} className="flex-1 py-2 rounded-xl bg-gray-700/50 text-gray-300 text-sm font-bold hover:bg-gray-700 transition-all">← Home</button>
                <button onClick={() => { localStorage.removeItem("userToken"); navigate('/login'); }} className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all">Log Out</button>
            </div>
        </div>

        {/* Right: Details */}
        <div className="md:w-2/3 p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">Profile Details</h1>
                <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg ${isEditing ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    {isEditing ? "Save Changes 💾" : "Edit Profile ✏️"}
                </button>
            </div>
            <div className="space-y-6">
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Full Name</label><input type="text" name="name" value={user.name} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border ${isEditing ? 'border-blue-500/50 text-white' : 'border-transparent text-gray-300'} outline-none focus:border-blue-500 transition-all`} /></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label><input type="email" name="email" value={user.email} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border ${isEditing ? 'border-blue-500/50 text-white' : 'border-transparent text-gray-300'} outline-none focus:border-blue-500 transition-all`} /></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Role / Title</label><input type="text" name="role" value={user.role} onChange={handleChange} disabled={true} className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border ${isEditing ? 'border-blue-500/50 text-white' : 'border-transparent text-gray-300'} outline-none focus:border-blue-500 transition-all`} /></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Bio</label><textarea name="bio" rows="3" value={user.bio} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border ${isEditing ? 'border-blue-500/50 text-white' : 'border-transparent text-gray-300'} outline-none focus:border-blue-500 transition-all resize-none`} /></div>
            </div>
        </div>
      </div>

      {/* --- SECTION 2: MY BOOKINGS --- */}
      <div className="relative z-10 w-full max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
              <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">My Bookings ({myTickets.length})</h2>
          </div>

          {myTickets.length === 0 ? (
              <div className="text-gray-500 text-center py-12 bg-gray-800/30 rounded-3xl border border-gray-700/50 border-dashed">
                  <p className="text-lg">No bookings found. Time to explore!</p>
                  <button onClick={() => navigate('/')} className="mt-4 text-blue-400 hover:text-white underline">Browse Events</button>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myTickets.map((ticket, index) => (
                      <div key={index} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-lg group relative overflow-hidden">
                          {/* Top Stripe based on ticket type */}
                          <div className={`absolute top-0 left-0 w-full h-1 ${ticket.type === 'VIP' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                          
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h3 className="font-bold text-white text-lg leading-tight mb-1">{ticket.eventName}</h3>
                                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{ticket.type} PASS</span>
                              </div>
                              <div className="bg-gray-900 p-2 rounded-lg">
                                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.id}`} alt="QR" className="w-8 h-8 opacity-80" />
                              </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-400 mb-6">
                              <div className="flex items-center gap-2"><span>📅</span> <span>{ticket.eventDate}</span></div>
                              <div className="flex items-center gap-2"><span>📍</span> <span className="truncate">{ticket.eventLocation}</span></div>
                          </div>

                          <div className="flex gap-3">
                              <button onClick={() => navigate(`/register/${ticket.eventId}`)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-xs font-bold transition-colors">
                                  View Ticket
                              </button>
                              <button onClick={() => cancelBooking(ticket.id)} className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-colors border border-red-500/20">
                                  Cancel
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

    </div>
  );
};

export default ProfilePage;