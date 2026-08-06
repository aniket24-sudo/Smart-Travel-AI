// ==========================================
// 1. AI TRAVEL PLANNER LOGIC
// ==========================================
// Notice we get the API key from config.js now!
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const generateBtn = document.getElementById('generate-btn');
const loadingDiv = document.getElementById('loading');
const outputDiv = document.getElementById('itinerary-output');

generateBtn.addEventListener('click', async () => {
    
    // Check Auth
    if (!localStorage.getItem('currentUser')) {
        alert("Please login first to generate an itinerary!");
        loginModal.classList.remove('hidden'); 
        return;
    }

    const destination = document.getElementById('destination').value;
    const days = document.getElementById('days').value;
    const budget = document.getElementById('budget').value;
    const vibe = document.getElementById('vibe').value; 

    if (!destination || !days || !budget) {
        alert("Please fill in all fields (Destination, Days, and Budget)!");
        return;
    }

    loadingDiv.classList.remove('hidden');
    outputDiv.innerHTML = '';
    generateBtn.disabled = true;

    const prompt = `You are a travel API. Please suggest an itinerary for ${destination} for ${days} days with a budget of ${budget} INR. 
    CRITICAL INSTRUCTION: The user wants a "${vibe}" travel experience. Tailor every activity specifically to this vibe.
    Return a valid JSON array. Each object must have these exact keys: "day", "morning", "afternoon", "evening", and "cost".`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(`API Error: ${data.error?.message || "Unknown error occurred"}`);
        
        const aiText = data.candidates[0].content.parts[0].text;
        const itineraryArray = JSON.parse(aiText);

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
        console.error("Full error details:", error);
        outputDiv.innerHTML = `<p style="color: red; text-align: center; padding: 1rem; background: #fee2e2; border-radius: 8px;">
            <strong>Something went wrong:</strong><br> ${error.message}
        </p>`;
    } finally {
        loadingDiv.classList.add('hidden');
        generateBtn.disabled = false;
    }
});


// ==========================================
// 2. NAVBAR & MODAL POPUP LOGIC
// ==========================================
const navHome = document.getElementById('nav-home');
const navAbout = document.getElementById('nav-about');
const navFeedback = document.getElementById('nav-feedback');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');

const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const feedbackModal = document.getElementById('feedback-modal');

const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');
const closeFeedbackBtn = document.getElementById('close-feedback');

// Smooth Scroll Links
navHome.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

// Open Modals
navLogin.addEventListener('click', (e) => { e.preventDefault(); loginModal.classList.remove('hidden'); });
navRegister.addEventListener('click', (e) => { e.preventDefault(); registerModal.classList.remove('hidden'); });
navFeedback.addEventListener('click', (e) => { e.preventDefault(); feedbackModal.classList.remove('hidden'); });

// Close Modals
closeLoginBtn.addEventListener('click', () => loginModal.classList.add('hidden'));
closeRegisterBtn.addEventListener('click', () => registerModal.classList.add('hidden'));
closeFeedbackBtn.addEventListener('click', () => feedbackModal.classList.add('hidden'));


// ==========================================
// 3. AUTHENTICATION LOGIC (NOW 100% MONGODB!)
// ==========================================
const registerInputs = document.querySelectorAll('#register-modal input');
const registerBtn = document.querySelector('#register-modal button');

const loginInputs = document.querySelectorAll('#login-modal input');
const loginBtn = document.querySelector('#login-modal button');

// --- DATABASE REGISTRATION ---
registerBtn.addEventListener('click', async () => {
    const fullName = registerInputs[0].value.trim();
    const email = registerInputs[1].value.trim();
    const password = registerInputs[2].value.trim();

    if (!fullName || !email || !password) {
        alert("Please fill in all fields to register.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration Successful! You are saved in the cloud. Please login.");
            registerInputs[0].value = ''; 
            registerInputs[1].value = ''; 
            registerInputs[2].value = '';
            registerModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
        } else {
            alert("Database Error: " + data.message);
        }
    } catch (error) {
        console.error("Backend connection failed:", error);
        alert("Could not connect to the database. Is your server running?");
    }
});

// --- DATABASE LOGIN ---
loginBtn.addEventListener('click', async () => {
    const email = loginInputs[0].value.trim();
    const password = loginInputs[1].value.trim();

    if (!email || !password) return alert("Please enter both email and password.");

    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Welcome back, ${data.user.fullName}!`);
            
            // Save the user session locally so the website remembers they are logged in during this visit
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            loginModal.classList.add('hidden');
            loginInputs[0].value = ''; loginInputs[1].value = '';
            
            navLogin.textContent = `Hi, ${data.user.fullName}`;
            navRegister.textContent = "Logout";
            navRegister.onclick = function(e) {
                 e.preventDefault();
                 localStorage.removeItem('currentUser');
                 alert("You have been logged out.");
                 location.reload(); 
            };
        } else {
            // This catches wrong passwords or missing accounts from the database
            alert("Login Failed: " + data.message); 
        }
    } catch (error) {
        console.error("Backend connection failed:", error);
        alert("Could not connect to the database. Is your server running?");
    }
});

// --- KEEP USER LOGGED IN ON REFRESH ---
window.onload = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (loggedInUser) {
        navLogin.textContent = `Hi, ${loggedInUser.fullName}`;
        navRegister.textContent = "Logout";
        navRegister.onclick = function(e) {
             e.preventDefault();
             localStorage.removeItem('currentUser');
             alert("You have been logged out.");
             location.reload(); 
        };
    }
};

// ==========================================
// 4. FEEDBACK LOGIC (DATABASE)
// ==========================================
const submitFeedbackBtn = document.getElementById('submit-feedback-btn');

submitFeedbackBtn.addEventListener('click', async () => {
    const rating = document.getElementById('feedback-rating').value;
    const message = document.getElementById('feedback-text').value.trim();

    if (!message) {
        alert("Please write a message before submitting.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, message })
        });

        if (response.ok) {
            alert("Thank you! Your feedback has been saved to the database.");
            document.getElementById('feedback-rating').value = '5';
            document.getElementById('feedback-text').value = '';
            feedbackModal.classList.add('hidden');
        } else {
            alert("Error saving feedback to the database.");
        }
    } catch (error) {
        console.error("Backend connection failed:", error);
        alert("Could not connect to the database. Is your server running?");
    }
});