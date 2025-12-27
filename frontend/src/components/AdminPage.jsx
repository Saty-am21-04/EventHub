import React, { useState, useEffect } from "react";
import { API_URL } from "../config";

// --- 1. PREMIUM STAT CARD ---
const StatCard = ({ title, value, icon, color, trend }) => {
    const theme = {
        blue: "border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-blue-400",
        purple: "border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] text-purple-400",
        green: "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-emerald-400",
        orange: "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] text-orange-400"
    };

    return (
        <div className={`bg-[#111] p-6 rounded-3xl border ${theme[color]} transition-transform hover:-translate-y-1 relative overflow-hidden group`}>
            {/* Background Glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity bg-current ${theme[color].split(' ')[2]}`}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="text-3xl filter drop-shadow-md">{icon}</span>
                <span className="text-[10px] font-black uppercase tracking-tighter bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-300">
                    {trend}
                </span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
        </div>
    );
};

const AdminPage = () => {
    // --- State Management ---
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('events'); 
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    
    // Get Current User Role
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const isSuperAdmin = userProfile.role === 'admin'; 
    const isModerator = userProfile.role === 'moderator' || isSuperAdmin;

    const [newEvent, setNewEvent] = useState({
        id: '', title: '', tagline: '', description: '', 
        date: '', time: '', location: '', image: '', price: 0, maxCapacity: 0, isOpen: true
    });

    const [searchEmail, setSearchEmail] = useState('');
    const [foundUser, setFoundUser] = useState(null);

    // Calculations
    const totalEvents = events.length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => {
        const event = events.find(e => String(e.id) === String(booking.eventId));
        return sum + (event ? Number(event.price || 0) : 0);
    }, 0);
    const vipCount = bookings.filter(b => b.type === 'VIP').length;

    // --- Data Fetching ---
    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        setLoading(true);
        try {
            const [evRes, bookRes] = await Promise.all([
                fetch(`${API_URL}/api/events`),
                fetch(`${API_URL}/api/admin/bookings`),
            ]);        
            setEvents(await evRes.json());
            setBookings(await bookRes.json());

            if (isSuperAdmin) {
                const logRes = await fetch(`${API_URL}/api/admin/logs`);
                setLogs(await logRes.json());
            }
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Logic Handlers ---
    const handleAddEvent = (e) => {        
        e.preventDefault();
        fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newEvent, id: Number(newEvent.id) })
        }).then(() => {
            refreshData();
            alert("Event Published! 🚀");
            setNewEvent({ id: '', title: '', tagline: '', description: '', date: '', time: '', location: '', image: '', price: 0, maxCapacity: 0, isOpen: true });            
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this event?")) {
            fetch(`${API_URL}/api/events/${id}`, { 
                method: 'DELETE',
                headers: { 'admin-email': userProfile.email }
            }).then(() => refreshData());
        }
    };

    const handleSearchUser = async () => {
        if(!searchEmail) return alert("Please enter an email");
        try {
            const res = await fetch(`${API_URL}/api/users/${searchEmail}`);
            if (!res.ok) throw new Error("User not found");
            const data = await res.json();
            setFoundUser(data);
        } catch (err) { 
            console.error(err); 
            alert("User not found in database.");
            setFoundUser(null);
        }
    };

  const handleRoleUpdate = async (newRole) => {
        // Optimistic UI update (makes it feel instant)
        const previousUser = { ...foundUser };
        setFoundUser({ ...foundUser, role: newRole });

        if (newRole === 'moderator') {
            try {
                const res = await fetch(`${API_URL}/api/admin/invite-moderator`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requesterEmail: userProfile.email, // Admin's email
                        targetEmail: foundUser.email
                    })
                });
                
                if (res.ok) alert(`📨 Invitation sent to ${foundUser.name}!`);
                else alert("Failed to send invitation.");
                
            } catch (err) { alert("Server Error"); }
            return;
        }
    };

    const handleDeleteUser = async () => {
        if(!window.confirm(`Are you sure you want to remove ${foundUser.name} from the system? This cannot be undone.`)) return;
        
        // Mock delete for now, you'd need a backend route for this
        // fetch(...)
        alert("User deletion logic would go here. For now, role update is the main feature.");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col md:flex-row font-sans selection:bg-blue-500/30">
            
            {/* --- SIDEBAR --- */}
            <div className="w-full md:w-72 bg-[#050505] p-8 border-r border-white/5 flex flex-col relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                
                <div className="mb-12 relative z-10">
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        Admin<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Panel</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isSuperAdmin ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {userProfile.role || "Staff"}
                        </span>
                    </div>
                </div>
                
                <nav className="space-y-3 flex-1 relative z-10">
                    <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon="📅" label="Manage Events" />
                    <TabButton active={activeTab === 'attendees'} onClick={() => setActiveTab('attendees')} icon="👥" label="Attendee List" />
                    
                    {/* ONLY SUPER ADMIN SEES THESE */}
                    {isSuperAdmin && (
                        <>
                            <div className="my-4 border-t border-white/5"></div>
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-2">Super Admin</p>
                            <TabButton active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon="🛡️" label="Access Control" />
                            <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon="📜" label="System Logs" />
                        </>
                    )}
                </nav>

                <button onClick={() => window.location.href = "/"} className="mt-auto flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors pl-2">
                    <span>←</span> Return to Website
                </button>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto relative bg-[#0a0a0a]">
                
                {/* --- DASHBOARD SUMMARY --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Events" value={totalEvents} icon="📅" color="blue" trend="Active" />
                    <StatCard title="Total Attendees" value={totalBookings} icon="🎫" color="purple" trend={`${Math.round((vipCount/totalBookings)*100 || 0)}% VIP`} />
                    <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon="💎" color="green" trend="Live" />
                    <StatCard title="Avg. Filling" value={`${totalEvents > 0 ? Math.round(totalBookings / totalEvents) : 0}`} icon="🔥" color="orange" trend="Per Event" />
                </div>
                
                {/* 1. MANAGE EVENTS (Available to Moderator & Admin) */}
                {activeTab === 'events' && (
                    <div className="animate-fade-in-up">
                        <header className="mb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tight">Event Manager</h2>
                                <p className="text-gray-500 mt-2 font-medium">Create and monitor your scheduled workshops.</p>
                            </div>
                        </header>

                        <form onSubmit={handleAddEvent} className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                            
                            <div className="md:col-span-3 mb-2">
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="text-blue-500">●</span> Host New Event
                                </h3>
                            </div>

                            <InputField label="Unique ID" type="number" placeholder="101" onChange={v => setNewEvent({...newEvent, id: v})} value={newEvent.id} />
                            <InputField label="Title" type="text" placeholder="Quantum Workshop" onChange={v => setNewEvent({...newEvent, title: v})} value={newEvent.title} />
                            <InputField label="Tagline" type="text" placeholder="Future is now" onChange={v => setNewEvent({...newEvent, tagline: v})} value={newEvent.tagline} />
                            
                            <InputField label="Date" type="text" placeholder="Dec 30, 2025" onChange={v => setNewEvent({...newEvent, date: v})} value={newEvent.date} />
                            <InputField label="Time" type="text" placeholder="10:00 AM" onChange={v => setNewEvent({...newEvent, time: v})} value={newEvent.time} />
                            <InputField label="Location" type="text" placeholder="Lab 4 / Virtual" onChange={v => setNewEvent({...newEvent, location: v})} value={newEvent.location} />
                            
                            <InputField label="Price (₹)" type="number" placeholder="0" onChange={v => setNewEvent({...newEvent, price: v})} value={newEvent.price} />
                            <InputField label="Max Capacity" type="number" placeholder="100" onChange={v => setNewEvent({...newEvent, maxCapacity: Number(v)})} value={newEvent.maxCapacity}/>
                            <InputField label="Image URL" type="text" placeholder="https://..." onChange={v => setNewEvent({...newEvent, image: v})} value={newEvent.image} />

                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1 tracking-widest">Description</label>
                                <textarea 
                                    className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all h-24 text-sm text-gray-300 placeholder-gray-700 resize-none" 
                                    onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
                                    value={newEvent.description}
                                    placeholder="Enter event details..."
                                />
                            </div>

                            <button className="md:col-span-3 bg-white text-black hover:bg-gray-200 font-black py-4 rounded-xl shadow-lg shadow-white/10 transition-all active:scale-[0.99] uppercase tracking-widest text-sm">
                                Publish Event
                            </button>
                        </form>

                        <div className="grid grid-cols-1 gap-6">
                            <h3 className="text-xl font-bold text-white mb-2 pl-1 border-l-4 border-blue-500">Active Listings <span className="text-gray-500 text-sm ml-2">({events.length})</span></h3>
                            {events.map(ev => {
                                const registeredCount = bookings.filter(b => String(b.eventId) === String(ev.id)).length;
                                const percent = Math.min(100, (registeredCount / (ev.maxCapacity || 50)) * 100);
                            
                                return (
                                    <div key={ev.id} className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-center gap-6 group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">ID: {ev.id}</span>
                                                <h4 className="font-bold text-white text-xl group-hover:text-blue-400 transition-colors">{ev.title}</h4>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4">{ev.date} • {ev.location}</p>
                                            
                                            <div className="max-w-md">
                                                <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500 mb-1">
                                                    <span>Capacity</span>
                                                    <span className={percent >= 90 ? "text-red-400" : "text-blue-400"}>{registeredCount} / {ev.maxCapacity || 50}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] ${percent >= 90 ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'}`} 
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(ev.id)} className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 2. ATTENDEE LIST (Available to Moderator & Admin) */}
                {activeTab === 'attendees' && (
                    <div className="animate-fade-in-up">
                        <header className="mb-10">
                            <h2 className="text-4xl font-black text-white">Live Tracking</h2>
                            <p className="text-gray-500 mt-2">Real-time registration feed.</p>
                        </header>
                        
                        <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-black/40 border-b border-white/5">
                                    <tr>
                                        {['Attendee', 'Event ID', 'Ticket Type', 'Registered'].map(h => (
                                            <th key={h} className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bookings.map((b, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold border border-white/10">
                                                        {b.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{b.name}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{b.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">#{b.eventId}</span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                    b.type === 'VIP' 
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]' 
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                    {b.type}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-xs font-bold text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {bookings.length === 0 && <div className="p-12 text-center text-gray-600 font-mono text-sm">No data available</div>}
                        </div>
                    </div>
                )}

                {/* 3. ACCESS CONTROL (SUPER ADMIN ONLY) */}
                {activeTab === 'access' && isSuperAdmin && (
                    <div className="max-w-3xl animate-fade-in-up">
                        <header className="mb-10">
                            <h2 className="text-4xl font-black text-white">Staff Management</h2>
                            <p className="text-gray-500 mt-2">Manage roles and permissions for the platform.</p>
                        </header>

                        <div className="bg-[#111] p-10 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="flex gap-4 mb-8 relative z-10">
                                <input 
                                    type="email" 
                                    placeholder="Enter user email..." 
                                    className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-600 transition-all"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                />
                                <button onClick={handleSearchUser} className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">Search</button>
                            </div>

                            {foundUser ? (
                                <div className="bg-black/40 p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-4 flex items-center justify-center text-3xl font-black shadow-2xl border border-white/10 text-white">
                                        {foundUser.name.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{foundUser.name}</h3>
                                    <p className="text-gray-500 text-sm mb-6 font-mono">{foundUser.email}</p>
                                    
                                    <div className="flex items-center gap-2 mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Role:</span>
                                        <span className={`font-bold uppercase text-xs ${foundUser.role === 'admin' ? 'text-red-400' : foundUser.role === 'moderator' ? 'text-blue-400' : 'text-gray-400'}`}>
                                            {foundUser.role}
                                        </span>
                                    </div>

                                    {/* Action Grid */}
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        {foundUser.role !== 'moderator' && (
                                            <button 
                                                onClick={() => handleRoleUpdate('moderator')}
                                                className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-blue-600/20 transition-all"
                                            >
                                                Make Moderator
                                            </button>
                                        )}
                                        
                                        {foundUser.role === 'moderator' && (
                                            <button 
                                                onClick={() => handleRoleUpdate('user')}
                                                className="bg-yellow-600/10 hover:bg-yellow-600 text-yellow-500 hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-yellow-600/20 transition-all"
                                            >
                                                Demote to User
                                            </button>
                                        )}

                                        <button 
                                            onClick={handleDeleteUser}
                                            className="col-span-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-red-600/20 transition-all"
                                        >
                                            Remove User from System
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-600">
                                    <p>Search for a user to manage their permissions.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 4. LOGS TAB (SUPER ADMIN ONLY) */}
                {activeTab === 'logs' && isSuperAdmin && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl font-black text-white mb-6">Security Audit Logs</h2>
                        <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden">
                            <div className="divide-y divide-white/5">
                                {logs.map((log, i) => (
                                    <div key={i} className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                                        <div>
                                            <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{log.action}</span>
                                            <p className="text-sm text-gray-400 mt-2">
                                                <span className="font-bold text-white">{log.adminEmail}</span> <span className="text-gray-600">➜</span> <span className="italic text-gray-300">{log.target}</span>
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-gray-600 font-mono border border-white/5 px-2 py-1 rounded">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

// --- Helper Components ---
const TabButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick} 
        className={`
            w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 group
            ${active ? 'text-white bg-white/5 border-r-2 border-blue-500' : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'}
        `}
    >
        <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'group-hover:scale-110 grayscale group-hover:grayscale-0'}`}>{icon}</span>
        <span className="font-bold text-sm tracking-wide">{label}</span>
    </button>
);

const InputField = ({ label, type, placeholder, onChange, value }) => (
    <div className="flex flex-col">
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 ml-1 tracking-widest">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-black/50 border border-white/10 p-3.5 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-white placeholder-gray-700" 
        />
    </div>
);

export default AdminPage;