require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// --- MODELS ---
const User = require('./models/User');
const Event = require('./models/Event');
const Log = require('./models/Log');
const Booking = require('./models/Booking');

// --- ROUTES ---
const aiRoutes = require('./routes/aiRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true, 
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// --- DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Hub! 🚀"))
  .catch(err => console.error("❌ Database connection error:", err));

const saveLog = async (email, action, target) => {
    try {
        await new Log({ adminEmail: email || "System", action, target }).save();
    } catch(err) { console.error("Logging failed", err); }
};

// --- MOUNT ROUTES ---
app.use('/api/ai', aiRoutes);
app.use('/api/events', eventRoutes);

// --- AUTH ROUTES ---

// 1. Initial Social Login Sync
app.post('/api/auth/sync', async (req, res) => {
    const { email, name } = req.body;

    try {
        let user = await User.findOneAndUpdate(
            { email },
            { 
                name: name || "User", 
                email, 
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                // Role is preserved here to stop admins losing access on re-login
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, 
            avatar: user.avatar
        });
        
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Admin Gatekeeper (Password Check)
// 2. Gatekeeper (Password Check for Admin OR Moderator)
app.post('/api/auth/verify-admin-access', async (req, res) => {
    const { email, password } = req.body;
    
    const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL; 
    const ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET; 
    const MODERATOR_PASSWORD = process.env.MODERATOR_PASSWORD;

    try {
        let newRole = "";

        // SCENARIO 1: Trying to be Super Admin
        if (password === ADMIN_SECRET) {
            // Strict Check: Only the specific email can be Admin
            if (email === ADMIN_EMAIL) {
                newRole = 'admin';
            } else {
                return res.status(403).json({ message: "Only the Super Admin can use the Admin Password." });
            }
        } 
        // SCENARIO 2: Trying to be Moderator
        else if (password === MODERATOR_PASSWORD) {
            // Loose Check: Anyone with the password becomes a Moderator
            newRole = 'moderator';
        } 
        // SCENARIO 3: Wrong Password
        else {
            return res.status(401).json({ message: "Incorrect Access Password." });
        }

        // Apply the determined role
        const updatedUser = await User.findOneAndUpdate(
            { email }, 
            { role: newRole }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found. Please login normally first." });
        }

        res.json({ success: true, user: updatedUser, role: newRole });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- USER & ADMIN DATA ROUTES ---
app.post('/api/admin/invite-moderator', async (req, res) => {
    const { requesterEmail, targetEmail } = req.body;
    
    try {
        // Verify Requester is Super Admin
        const admin = await User.findOne({ email: requesterEmail, role: 'admin' });
        if (!admin) return res.status(403).json({ message: "Unauthorized." });

        // Add Notification to Target User
        const updatedUser = await User.findOneAndUpdate(
            { email: targetEmail },
            { 
                $push: { 
                    notifications: { 
                        message: "You have been invited to become a Moderator.", 
                        type: 'invite' 
                    } 
                } 
            },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found." });

        res.json({ message: "Invitation sent successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 2. GET MY NOTIFICATIONS ---
app.get('/api/user/notifications/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Return only pending notifications
        const pending = user.notifications.filter(n => n.status === 'pending');
        res.json(pending);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 3. ACCEPT INVITE & REVEAL PASSWORD ---
app.post('/api/user/accept-invite', async (req, res) => {
    const { email } = req.body;
    const MOD_PASSWORD = process.env.MODERATOR_PASSWORD; // Get from .env

    try {
        // Mark notification as accepted (or remove it)
        await User.findOneAndUpdate(
            { email },
            { $pull: { notifications: { type: 'invite' } } } // Remove the invite after accepting
        );

        // SEND THE PASSWORD TO THE FRONTEND
        res.json({ 
            success: true, 
            message: "Invitation Accepted!", 
            accessCode: MOD_PASSWORD 
        });

    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Search user by email (For Access Control)
app.get('/api/users/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') } 
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            avatar: user.avatar
        });

    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/logs', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(20);
        res.json(logs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Role (Handles Promotion, Demotion, & Moderator)
app.post('/api/admin/update-role', async (req, res) => {
    const { requesterEmail, targetEmail, newRole } = req.body;
    
    try {
        // 1. Verify Requester is Super Admin or Moderator
        const admin = await User.findOne({ email: requesterEmail, role: { $in: ['admin', 'moderator'] } });
        if (!admin) return res.status(403).json({ message: "Unauthorized. Super Admin or Moderator Only." });
        
        // 2. Perform Update
        const updated = await User.findOneAndUpdate(
            { email: targetEmail }, 
            { role: newRole }, 
            { new: true }
        );
        
        // 3. Log it
        await saveLog(requesterEmail, `ROLE_CHANGE_TO_${newRole.toUpperCase()}`, targetEmail);
        
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/register', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));