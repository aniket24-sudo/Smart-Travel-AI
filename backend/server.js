require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 🛑 THE BYPASS: Force Node.js to use Google's DNS
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Initialize the Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import your Database Blueprints
const User = require('./models/User');
const Feedback = require('./models/Feedback');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { 
    serverSelectionTimeoutMS: 5000, 
    family: 4 
})
    .then(() => console.log("✅ Successfully connected to MongoDB Database!"))
    .catch((error) => console.error("❌ MongoDB Connection Error:", error));


// ==========================================
// 🛣️ API ROUTES (The "Doors" to your database)
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

// Route 2: Submit Feedback
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

// Start the Server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running live on http://127.0.0.1:${PORT}`);
});

// Route 3: Login an Existing User
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Search the database for this email
        const user = await User.findOne({ email: email });
        
        // 2. If the user doesn't exist, stop and send an error
        if (!user) {
            return res.status(404).json({ message: "Account not found. Please register first!" });
        }

        // 3. If the password doesn't match, stop and send an error
        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password. Try again!" });
        }

        // 4. If everything matches, send a success message and the user's name!
        res.status(200).json({ 
            message: "Login successful!", 
            user: { fullName: user.fullName, email: user.email } 
        });

    } catch (error) {
        console.log("LOGIN ERROR: ", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
});