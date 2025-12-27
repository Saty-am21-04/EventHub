const express = require("express");
const router = express.Router();
// Import ALL controller functions including getEventById
const { 
    getEvents, 
    createEvent, 
    getAIRecommendations, 
    getEventById 
} = require("../controllers/eventController");

// 1. GET all events
router.get("/", getEvents);

// 2. CREATE a new event
router.post("/", createEvent);

// 3. AI Recommendations
router.post("/recommendations", getAIRecommendations);

// 4. GET Single Event by ID (👇 THIS WAS MISSING)
router.get("/:id", getEventById); 

module.exports = router;