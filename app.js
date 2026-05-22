const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Grab UI Elements
const generateBtn = document.getElementById('generate-btn');
const loadingDiv = document.getElementById('loading');
const outputDiv = document.getElementById('itinerary-output');

// When the user clicks "Generate AI Itinerary"
generateBtn.addEventListener('click', async () => {
    
    // Check if the user is logged in before allowing them to generate!
    if (!localStorage.getItem('currentUser')) {
        alert("Please login first to generate an itinerary!");
        loginModal.classList.remove('hidden'); // Force open the login modal
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
        
        if (!response.ok) {
            throw new Error(`API Error: ${data.error?.message || "Unknown error occurred"}`);
        }
        
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
const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');

// Navigation links
navHome.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
navAbout.addEventListener('click', (e) => { e.preventDefault(); alert("Smart Travel AI is an intelligent planner designed to instantly generate custom itineraries."); });
navFeedback.addEventListener('click', (e) => { e.preventDefault(); alert("Feedback system coming soon!"); });

// Open / Close Modals
navLogin.addEventListener('click', (e) => { e.preventDefault(); loginModal.classList.remove('hidden'); });
navRegister.addEventListener('click', (e) => { e.preventDefault(); registerModal.classList.remove('hidden'); });
closeLoginBtn.addEventListener('click', () => loginModal.classList.add('hidden'));
closeRegisterBtn.addEventListener('click', () => registerModal.classList.add('hidden'));


// ==========================================
// 3. AUTHENTICATION LOGIC (LOCAL STORAGE)
// ==========================================

// We need to grab the inputs and buttons from inside the newly created Modals
const registerInputs = document.querySelectorAll('#register-modal input');
const registerBtn = document.querySelector('#register-modal button');

const loginInputs = document.querySelectorAll('#login-modal input');
const loginBtn = document.querySelector('#login-modal button');

// --- REGISTER LOGIC ---
registerBtn.addEventListener('click', () => {
    // The HTML has Name, Email, Password in that order.
    const fullName = registerInputs[0].value.trim();
    const email = registerInputs[1].value.trim();
    const password = registerInputs[2].value.trim();

    if (!fullName || !email || !password) {
        alert("Please fill in all fields to register.");
        return;
    }

    // Check if the user already exists in the browser's memory
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some(user => user.email === email);

    if (userExists) {
        alert("An account with this email already exists! Please login.");
        registerModal.classList.add('hidden');
        loginModal.classList.remove('hidden');
        return;
    }

    // Save the new user!
    const newUser = { fullName, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert("Registration Successful! Please login.");
    
    // Clear the inputs and swap to the login screen
    registerInputs[0].value = ''; registerInputs[1].value = ''; registerInputs[2].value = '';
    registerModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
});

// --- LOGIN LOGIC ---
loginBtn.addEventListener('click', () => {
    const email = loginInputs[0].value.trim();
    const password = loginInputs[1].value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find a user that matches both the email and password
    const validUser = existingUsers.find(user => user.email === email && user.password === password);

    if (validUser) {
        alert(`Welcome back, ${validUser.fullName}!`);
        
        // Save the current user to keep them logged in
        localStorage.setItem('currentUser', JSON.stringify(validUser));
        
        // Hide the login modal and clear the inputs
        loginModal.classList.add('hidden');
        loginInputs[0].value = ''; loginInputs[1].value = '';
        
        // Change the navbar text to show they are logged in
        navLogin.textContent = `Hi, ${validUser.fullName}`;
        navRegister.textContent = "Logout";
        
        // Temporarily hijack the register button to act as a logout
        navRegister.removeEventListener('click', openRegisterModal); // Remove old listener (conceptually)
        navRegister.onclick = function(e) {
             e.preventDefault();
             localStorage.removeItem('currentUser');
             alert("You have been logged out.");
             location.reload(); // Refresh the page to reset the UI
        };

    } else {
        alert("Invalid email or password. Please try again.");
    }
});

<<<<<<< HEAD
// --- AUTO LOGIN ON REFRESH ---
// If the user refreshed the page but is still logged in, update the UI
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
=======
// 6. Close Modal 'X' Buttons -> Hides the Modals
closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

closeRegisterBtn.addEventListener('click', () => {
    registerModal.classList.add('hidden');
});
>>>>>>> 268173fa0474ff06624c8e5a76681c899aaf7690
