const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const Event = require("../models/Event");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 1. Get All Events ---
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 2. Get AI Recommendations ---
const getAIRecommendations = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Server API Configuration Error" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch events
    let allEvents = await Event.find().lean();
    
    // Filter for upcoming events
    const upcomingEvents = allEvents.filter(event => new Date(event.date) >= new Date());
    const eventsToSend = upcomingEvents.length > 0 ? upcomingEvents : allEvents.slice(0, 5);

    if (eventsToSend.length === 0) {
        return res.status(200).json([]);
    }

    const prompt = `
      Act as an event recommendation engine.
      User Interests: ${user.interests || "General Technology"}
      
      Events List:
      ${JSON.stringify(eventsToSend.map(e => ({ id: e._id, title: e.title, description: e.description, date: e.date })))}

      TASK: Pick the best 3 matches.
      CRITICAL OUTPUT RULES:
      1. Return ONLY a raw JSON array. 
      2. Schema: [{ "eventId": "exact_id_string", "matchScore": 85, "reason": "Short explanation" }]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" }); // Updated model name if needed
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    let recommendations = [];
    try {
        let cleanText = text.replace(/```json/g, "").replace(/```/g, "");
        const firstBracket = cleanText.indexOf('[');
        const lastBracket = cleanText.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanText = cleanText.substring(firstBracket, lastBracket + 1);
            recommendations = JSON.parse(cleanText);
        } else {
            return res.status(200).json([]); 
        }
    } catch (jsonError) {
        return res.status(200).json([]); 
    }

    const detailedRecommendations = recommendations.map(rec => {
      const fullEvent = allEvents.find(e => e._id.toString() === rec.eventId);
      return fullEvent ? { ...fullEvent, aiReason: rec.reason, matchScore: rec.matchScore } : null;
    }).filter(item => item !== null);

    res.status(200).json(detailedRecommendations);

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ message: "Internal AI Error" });
  }
};

// --- 3. Create New Event ---
const createEvent = async (req, res) => {
  try {
    const { 
      title, tagline, description, date, time, 
      location, price, image, maxCapacity, category, id
    } = req.body;

    if (!title || !date || !image) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const newEvent = new Event({
      id, // Custom numeric ID
      title,
      tagline,
      description,
      date,
      time,
      location,
      price,
      image,
      maxCapacity,
      category: category || "General"
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// --- 4. Get Single Event by ID (👇 THIS WAS MISSING) ---
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        let event;

        // 1. Try finding by Mongo _id (24 char hex string)
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            event = await Event.findById(id);
        }

        // 2. If not found, try finding by custom numeric 'id'
        if (!event) {
            event = await Event.findOne({ id: id }); // Assumes you have a field 'id' in schema
        }

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching single event:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Export all functions
module.exports = { getEvents, getAIRecommendations, createEvent, getEventById };