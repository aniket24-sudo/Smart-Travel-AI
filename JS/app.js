// ==========================================
// 1. AI TRAVEL PLANNER LOGIC
// ==========================================

// 👇 PASTE YOUR ACTUAL API KEY HERE 👇
const GEMINI_API_KEY = "AIzaSyAKngEkpycYIA0WT9IxlL-u3wEzExOpPKQ"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Grab UI Elements
const generateBtn = document.getElementById('generate-btn');
const loadingDiv = document.getElementById('loading');
const outputDiv = document.getElementById('itinerary-output');

// When the user clicks "Generate AI Itinerary"
generateBtn.addEventListener('click', async () => {
    
    // Get values from the inputs
    const destination = document.getElementById('destination').value;
    const days = document.getElementById('days').value;
    const budget = document.getElementById('budget').value;
    const vibe = document.getElementById('vibe').value; 

    // Validation check
    if (!destination || !days || !budget) {
        alert("Please fill in all fields (Destination, Days, and Budget)!");
        return;
    }

    // UI Updates: Show loading, clear old results, disable button
    loadingDiv.classList.remove('hidden');
    outputDiv.innerHTML = '';
    generateBtn.disabled = true;

    // The AI Prompt
    const prompt = `You are a travel API. Please suggest an itinerary for ${destination} for ${days} days with a budget of ${budget} INR. 
    CRITICAL INSTRUCTION: The user wants a "${vibe}" travel experience. Tailor every activity specifically to this vibe.
    Return a valid JSON array. Each object must have these exact keys: "day", "morning", "afternoon", "evening", and "cost".`;

    try {
        // Send request to Google Gemini
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                // This forces Gemini to return perfect JSON format
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        
        // Catch API-specific errors (like bad API keys)
        if (!response.ok) {
            throw new Error(`API Error: ${data.error?.message || "Unknown error occurred"}`);
        }
        
        // Extract and parse the JSON response
        const aiText = data.candidates[0].content.parts[0].text;
        const itineraryArray = JSON.parse(aiText);

        // Build the HTML for the itinerary cards
        itineraryArray.forEach(dayPlan => {
            const dayCard = document.createElement('div');
            dayCard.classList.add('day-card');
            
            dayCard.innerHTML = `
                <h3>Day ${dayPlan.day}</h3>
                <p><strong>🌅 Morning:</strong> ${dayPlan.morning}</p>
                <p><strong>☀️ Afternoon:</strong> ${dayPlan.afternoon}</p>
                <p><strong>🌆 Evening:</strong> ${dayPlan.evening}</p>
                <p><strong>💰 Estimated Daily Cost:</strong> ₹${dayPlan.cost}</p>
            `;
            
            outputDiv.appendChild(dayCard);
        });

    } catch (error) {
        // Display errors beautifully on the screen
        console.error("Full error details:", error);
        outputDiv.innerHTML = `<p style="color: red; text-align: center; padding: 1rem; background: #fee2e2; border-radius: 8px;">
            <strong>Something went wrong:</strong><br> ${error.message}
        </p>`;
    } finally {
        // Hide loading spinner and re-enable button
        loadingDiv.classList.add('hidden');
        generateBtn.disabled = false;
    }
});


// ==========================================
// 2. NAVBAR & MODAL POPUP LOGIC
// ==========================================

// Grab Navbar Links
const navHome = document.getElementById('nav-home');
const navAbout = document.getElementById('nav-about');
const navFeedback = document.getElementById('nav-feedback');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');

// Grab Modal Elements
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');

// --- BUTTON LOGIC ---

// 1. Home Button -> Smooth scroll to top of page
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
});

// 2. About Us Button -> Informational Pop-up Alert
navAbout.addEventListener('click', (e) => {
    e.preventDefault();
    alert("Smart Travel AI is an intelligent planner designed to instantly generate custom itineraries based on your budget and vibe.");
});

// 3. Feedback Button -> Informational Pop-up Alert
navFeedback.addEventListener('click', (e) => {
    e.preventDefault();
    alert("Feedback system coming soon! For now, enjoy planning your trips.");
});

// 4. Login Button -> Opens the Login Modal
navLogin.addEventListener('click', (e) => {
    e.preventDefault(); 
    loginModal.classList.remove('hidden');
});

// 5. Register Button -> Opens the Register Modal
navRegister.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('hidden');
});

// 6. Close Modal 'X' Buttons -> Hides the Modals
closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

closeRegisterBtn.addEventListener('click', () => {
    registerModal.classList.add('hidden');
});