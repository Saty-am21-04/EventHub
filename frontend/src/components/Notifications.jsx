import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const Notifications = () => {
    const [invites, setInvites] = useState([]);
    const [revealedPassword, setRevealedPassword] = useState(null);
    const user = JSON.parse(localStorage.getItem("userProfile"));

    useEffect(() => {
        if (user?.email) fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const res = await fetch(`${API_URL}/api/user/notifications/${user.email}`);
        if (res.ok) setInvites(await res.json());
    };

    const handleAccept = async () => {
        const res = await fetch(`${API_URL}/api/user/accept-invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
        });
        
        const data = await res.json();
        if (data.success) {
            setRevealedPassword(data.accessCode); // Show the password
            setInvites([]); // Clear invites
        }
    };

    if (invites.length === 0 && !revealedPassword) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
            {revealedPassword ? (
                <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-6 rounded-2xl border border-green-500 shadow-2xl text-white max-w-sm">
                    <h3 className="font-black text-xl mb-2">🎉 You're In!</h3>
                    <p className="text-sm text-green-200 mb-4">Here is your Moderator Access Password. Copy it securely!</p>
                    
                    <div className="bg-black/50 p-4 rounded-xl border border-green-500/30 flex justify-between items-center">
                        <code className="font-mono text-lg tracking-widest text-green-400">{revealedPassword}</code>
                        <button 
                            onClick={() => {navigator.clipboard.writeText(revealedPassword); alert("Copied!")}}
                            className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-500"
                        >
                            COPY
                        </button>
                    </div>
                    <button onClick={() => setRevealedPassword(null)} className="mt-4 text-xs text-green-400 hover:text-white w-full">Close</button>
                </div>
            ) : (
                <div className="bg-gray-800 p-5 rounded-2xl border border-blue-500 shadow-2xl text-white max-w-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📩</span>
                        <h3 className="font-bold">Team Invitation</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">{invites[0].message}</p>
                    <div className="flex gap-2">
                        <button onClick={handleAccept} className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-bold text-sm transition-all">Accept</button>
                        <button onClick={() => setInvites([])} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold text-sm">Ignore</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;