# 📦 FutureFeed Prototype (ff-prototype)

A lightweight full-stack prototype for managing structured requirements, evidence tracking, and task completion workflows.

Built with a **React (Vite) frontend** and a **Go backend API**, using JSON-based persistence for rapid prototyping. Requires Node.js.

---

# 🛠️ Quickstart

```
npm install concurrently --save-dev
npm run dev:all
```

---

# ⚙️ Tech Stack
 
- ⚡ Frontend: React + Vite
- 🐹 Backend: Go (net/http)
- 📊 Data Layer: JSON file storage (prototype stage)
- 🔗 API: REST-style endpoints
- 🧩 Dev Tooling: npm + concurrently

---

# 🚀 Features

- Category-based requirement tracking
- Evidence entry per requirement
- Save-and-lock workflow (prevents post-submission edits)
- Progress tracking (completion count + percentage)
- Submission flow with completion “trophy case”
- Locked vs editable UI states
- Lightweight Go backend serving JSON API
- Simple API abstraction layer on frontend

---

# 📁 Project Structure

```
├── api.go # Go backend server
├── requirements.json
├── vite.config.js
├── eslint.config.js
├── package.json
├── package-lock.json

├── index.html # Vite entry HTML
├── public/
│ └── favicon.svg

├── src/
│ ├── App.jsx
│ ├── main.jsx
│ ├── styles.css
│
│ ├── components/
│ │ └── RequirementCard.jsx
│
│ └── api/
│ ├── requirements.js
│ └── requirements.json
```
