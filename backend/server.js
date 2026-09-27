require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // 1. Gemini Import

const app = express();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Import Models
const User = require('./models/User');
const Feedback = require('./models/Feedback');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// ==========================================
// API ROUTES
// ==========================================

// Test Route
app.get('/', (req, res) => {
    res.send("✈️ Smart Travel AI Backend is fully operational!");
});

// Route 1: Register a New User
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const newUser = new User({ fullName, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Route 2: Login an Existing User
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "Account not found. Please register first!" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password. Try again!" });
        }

        res.status(200).json({ 
            message: "Login successful!", 
            user: { fullName: user.fullName, email: user.email } 
        });

    } catch (error) {
        console.log("LOGIN ERROR: ", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
});

// Route 3: Submit Feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { rating, message } = req.body;
        const newFeedback = new Feedback({ rating, message });
        await newFeedback.save();
        res.status(201).json({ message: "Feedback saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving feedback", error: error.message });
    }
});

// Route 4: Generate AI Itinerary (Gemini)
// Route 4: Generate AI Itinerary (Gemini)
app.post('/api/generate-itinerary', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // Verify API key exists
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is missing in backend environment variables" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const itinerary = result.response.text();

        res.json({ success: true, itinerary });
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Sends the detailed error message back to frontend for easy debugging
        res.status(500).json({ error: error.message || "Failed to generate itinerary" });
    }
});

// ==========================================
// START SERVER (MUST BE AT THE VERY BOTTOM)
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running live on port ${PORT}`);
});