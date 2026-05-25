✈️ Smart Travel AI Planner


"gse2dif"

✨ Key Features
🤖 AI-Powered Generation: Integrates directly with the gemini-3.5-flash model to engineer prompts and return strictly formatted JSON data.

🔐 Front-End Authentication: Includes a fully functional Local Storage-based Login and Registration system to manage user sessions without a backend.

🎭 "Vibe" Customization: Users can select their travel style (e.g., Adventure, Romantic, Foodie), and the AI tailors every activity to match.

🎨 Glassmorphism UI: Features a premium, modern user interface with frosted-glass modals, dynamic background scaling, and responsive flexbox design.

⚡ Seamless Error Handling: Built-in safeguards to catch API timeouts, invalid JSON responses, and missing user inputs gracefully.

🛠️ Tech Stack
Front-End: HTML5, CSS3, Vanilla JavaScript (ES6+)

AI Integration: Google Generative AI API (Gemini 3.5 Flash)

State Management: Web Storage API (Local Storage)

Architecture: 100% Client-Side Rendering (No server required to run)

🚀 How to Run Locally
Because this project is built entirely on the front end, setting it up is incredibly easy.

Clone the repository

Bash
git clone https://github.com/your-username/smart-travel-ai.git
cd smart-travel-ai
Get your API Key

Go to Google AI Studio and create a free API key.

Add your API Key

Open app.js in your code editor.

Paste your key at the very top: const GEMINI_API_KEY = "YOUR_KEY_HERE";

Launch the App

Simply double-click index.html to open it in your browser, or use the "Live Server" extension in VS Code.

📂 Folder Structure
Plaintext
📁 Smart-Travel-AI
├── 📄 index.html      # The main layout and structure
├── 📄 style.css       # All styling, glass effects, and UI components
├── 📄 app.js          # AI logic, API calls, and Authentication system
└── 📁 Images
    └── 🖼️ Background_img.png  # Premium dynamic background
🗺️ Future Roadmap
[ ] Add "Download as PDF" functionality for offline itineraries.

[ ] Save generated trips directly to the user's Local Storage profile.

[ ] Migrate authentication to a real backend database (e.g., Firebase or MongoDB).

*** Designed and developed by Aniket Kushwaha.
