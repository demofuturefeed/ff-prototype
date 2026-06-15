# 📦 FutureFeed Prototype (ff-prototype)

A lightweight full-stack prototype for managing structured requirements, evidence tracking, and task completion workflows.

- ⚡ Frontend: React (Vite)
- 🐹 Backend: Go (net/http)
- 📊 Data: JSON-based persistence (prototype stage)
- 🔗 API: REST-style endpoints

---

# 🚀 Features

- Category-based requirement tracking
- Evidence entry per requirement
- One-time save-and-lock workflow
- Progress tracking (percentage + completion count)
- Submission flow with completion alert (trophy case)
- Locked vs editable UI states
- Go backend API with JSON storage

---

# 📁 Project Structure
├── api.go # Go backend server
├── requirements.json # backend data source
├── vite.config.js # Vite config
├── eslint.config.js # ESLint rules
├── package.json
├── package-lock.json

├── index.html # Vite entry HTML
├── public/
│ └── favicon.svg

├── src/
│ ├── App.jsx # main React app
│ ├── main.jsx # React entry point
│ ├── styles.css # global styles
│
│ ├── components/
│ │ └── RequirementCard.jsx
│
│ └── api/
│ ├── requirements.js # API helper layer
│ └── requirements.json # legacy/local mock data (optional)