

# 📦 FutureFeed Prototype (ff-prototype)

<img width="914" height="782" alt="image" src="https://github.com/user-attachments/assets/170dc89b-c053-446e-bdf3-dbae084307fe" />


A lightweight full-stack prototype for managing structured requirements, evidence tracking, and task completion workflows.

Built with a **React (Vite) frontend** and a **Go backend API**, using JSON-based persistence for rapid prototyping. Requires Node.js.

---

# 🛠️ Quickstart

```
npm install concurrently --save-dev
npm run dev:all
```
## Instructions:
1. Type input
2. Click <kbd>Save</kbd>
3. Scroll
4. Repeat
5. Click <kbd>Submit</kbd>.


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
