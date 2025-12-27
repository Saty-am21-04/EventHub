import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const AdminGate = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Get current user info
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    useEffect(() => {
        // Allow if user is ALREADY an admin OR moderator
        if (userProfile.role === 'admin' || userProfile.role === 'moderator') {
            setIsAuthenticated(true);
        }
    }, [userProfile.role]);

    const handleUnlock = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/verify-admin-access`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userProfile.email,
                    password: password
                })
            });

            const data = await res.json();

            if (res.ok) {
                // 1. Update Local Storage with the SPECIFIC role returned by DB (admin or moderator)
                const updatedProfile = { ...userProfile, role: data.role }; 
                localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                
                // 2. Unlock the Gate
                setIsAuthenticated(true);
                alert(`🔓 Access Granted as ${data.role.toUpperCase()}!`);
            } else {
                alert("❌ Access Denied: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Server Error");
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return children;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 text-center">
                <div className="text-6xl mb-4">🛡️</div>
                <h1 className="text-2xl font-black mb-2">Restricted Access</h1>
                <p className="text-gray-400 mb-6">
                    Enter your <strong>Admin</strong> or <strong>Moderator</strong> password to continue.
                </p>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Enter Access Password" 
                        className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-blue-500 outline-none text-center tracking-widest"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all active:scale-95"
                    >
                        {loading ? "Verifying..." : "Unlock Dashboard"}
                    </button>
                </form>

                <button 
                    onClick={() => navigate('/')} 
                    className="mt-6 text-sm text-gray-500 hover:text-white underline"
                >
                    Return Home
                </button>
            </div>
        </div>
    );
};

export default AdminGate;