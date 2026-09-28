# ✈️ Smart Travel AI

A full-stack, AI-powered travel planning application that generates detailed, multi-day itineraries tailored to destination, budget, duration, and travel vibe. Built with a secure backend proxy to keep API keys safe and connected to a cloud database for user management.

🌐 **Live Demo:** [https://smart-travel-ai-theta.vercel.app](https://smart-travel-ai-theta.vercel.app)


## 🚀 Features

- **Custom AI Itinerary Generation:** Tailored daily travel schedules (Morning, Afternoon, Evening, Cost) powered by Google Gemini AI.
- **Secure Backend Proxy:** API requests are routed through a Node.js/Express backend on Render to keep secret keys hidden from the client side.
- **MongoDB Cloud Authentication:** User registration and login functionality backed by MongoDB Atlas.
- **User Feedback Collection:** Collects user ratings and suggestions saved directly to the database.
- **Responsive UI:** Clean, modern interface deployed on Vercel with real-time DOM updates.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Hosted on **Vercel**)
- **Backend:** Node.js, Express.js (Hosted on **Render**)
- **Database:** MongoDB Atlas with Mongoose ORM
- **AI Integration:** Google Gemini API (`@google/generative-ai`)

---

## ⚙️ Architecture & API Flow

[ Client (Vercel) ] 
       │
       ├──► POST /api/register & /api/login ──► [ Express + MongoDB Atlas ]
       │
       └──► POST /api/generate-itinerary ────► [ Express Backend ] ────► [ Gemini API ]
                                                        │
[ Dynamic Cards Rendered ] ◄─────────────────────────────┘


Developed By Aniket Kushwaha
Aniket Kushwaha
B.Tech Computer Science & Engineering (AI)