Smart Travel AI ✈️🤖


Smart Travel AI is a full-stack, AI-powered web application that generates highly personalized, day-by-day travel itineraries. By leveraging the Google Gemini API, the platform processes user constraints—such as destination, budget, trip duration, and desired travel "vibe"—to dynamically construct structured travel plans.

✨ Key Features
AI-Generated Itineraries: Utilizes generative AI and strict prompt engineering to deliver structured JSON schedules (morning, afternoon, evening activities, and daily cost estimates).

Secure User Authentication: Custom-built RESTful API utilizing Node.js and Express to handle user registration and login securely.

Cloud Data Storage: Fully integrated with MongoDB Atlas via Mongoose to store user credentials and application feedback persistently, bypassing local storage limitations.

Asynchronous UI: Seamless frontend experience using Vanilla JavaScript and the Fetch API to render AI responses and handle database queries without page reloads.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript

Backend: Node.js, Express.js

Database: MongoDB Atlas, Mongoose

External APIs: Google Gemini 3.5 Flash API

🚀 For Getting Started
Follow these steps to run the project locally on your machine.

1. Clone the Repository
Bash
git clone https://github.com/aniket24-sudo/Smart-Travel-AI.git
cd Smart-Travel-AI
2. Install Dependencies
Navigate into the backend directory and install the required Node modules.

Bash
cd backend
npm install
3. Environment Variables
Create a .env file in your backend directory and add your secure keys:

Ini, TOML
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
4. Run the Server
Start the Express backend to establish the database connection.

Bash
node server.js
Note: Ensure your terminal displays successful connections to both 127.0.0.1:5000 and MongoDB before proceeding.

5. Launch the Frontend
Open the index.html file located in the root directory using Live Server (or your preferred local development server) to interact with the web application.

👨‍💻 Developer
Aniket Kushwaha
B.Tech Computer Science & Engineering (AI)