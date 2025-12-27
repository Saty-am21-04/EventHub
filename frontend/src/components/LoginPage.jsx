import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import { API_URL } from "../config";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('email'); // 'email' or 'otp'

    // --- 1. SEND OTP ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // This sends the email. 
        // NOTE: In your Supabase Dashboard -> Authentication -> Email Templates,
        // ensure "Magic Link" template includes {{ .Token }} so the user sees the code.
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            alert("Error sending OTP: " + error.message);
        } else {
            alert("✅ OTP sent! Check your email for the code.");
            setStep('otp');
        }
        setLoading(false);
    };

    // --- 2. VERIFY OTP (FIXED) ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email' 
        });

        if (error) {
            alert("Invalid OTP: " + error.message);
        } else {

            
            try {
                const response = await fetch(`${API_URL}/api/auth/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        name: "New User"
                    })
                });

                const dbUser = await response.json();

                localStorage.setItem("userToken", data.session.access_token);
                
                localStorage.setItem("userProfile", JSON.stringify({
                    _id: dbUser._id,
                    name: dbUser.name,
                    email: dbUser.email,
                    role: dbUser.role,
                    avatar: dbUser.avatar
                }));

                alert(`Welcome back, ${dbUser.name}! 🚀`);

                const destination = location.state?.from || '/';
                navigate(destination);
            } catch(err) {
                console.error("Backend Sync Error:", err);
                alert("Auth successful, but failed to sync profile.");
            }            
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans overflow-hidden">
            
            {/* --- 1. UNIFIED BACKGROUND --- */}
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
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900/90 via-blue-900/40 to-gray-900/90"></div>

            {/* --- 2. ANIMATED GLOW ORBS --- */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            {/* --- 3. LOGIN CARD --- */}
            <div className="relative z-10 w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">
                        Event<span className="text-blue-500">Hub</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        {step === 'email' ? 'Enter email to get OTP' : 'Check your inbox for the code'}
                    </p>
                </div>

                {step === 'email' ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-xs font-bold uppercase mb-2 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-500"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wide text-sm">
                            {loading ? "Sending..." : "Send OTP 📨"}
                        </button>
                    </form>
               ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-xs font-bold uppercase mb-2 ml-1">Enter OTP Code</label>
                            <input 
                                type="text" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-3 text-center tracking-widest text-2xl font-mono focus:border-green-500 outline-none"
                                placeholder="12345678" 
                                maxLength={8} 
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wide text-sm">
                            {loading ? "Verifying..." : "Verify & Login 🔓"}
                        </button>
                        <button type="button" onClick={() => setStep('email')} className="w-full text-gray-400 text-xs hover:text-white mt-4 underline">
                            Wrong email? Go back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;