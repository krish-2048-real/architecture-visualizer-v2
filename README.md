# 🏗️ Architecture Visualizer

**Navigate complex codebases in seconds with a beautiful, interactive directory tree.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Now-success?style=for-the-badge)](https://architecture-visualizer-v2.vercel.app)

---

## 💡 The Problem
When joining a new project or reviewing large codebases, developers waste hours just trying to understand the folder structure. Navigating through standard file explorers or terminal commands is clunky and lacks a high-level, visual overview.

## 🚀 The Solution
**Architecture Visualizer** is a lightning-fast, full-stack application that dynamically scans and maps out project directories into a beautiful, interactive, and collapsible hierarchy tree. 

### ✨ Key Features
* **Interactive Tree View**: Browse your project structure with expandable/collapsible folders
* **Smart Filtering**: Automatically ignores common directories like `node_modules`, `.venv`, `.git`
* **Dark Mode UI**: Sleek, distraction-free interface built for developers
* **Cloud Deployed**: Fully hosted on Vercel (Edge) and Render

---

## 🔗 Live Links
* **Live Web App:** https://architecture-visualizer-v2.vercel.app
* **Backend API:** https://arch-backend-2tiz.onrender.com

---

## 🛠️ Tech Stack
* **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
* **Backend:** Python, Flask, Flask-CORS
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## ⚙️ How to Run Locally

*(Note: The application is live at the link above. These instructions are only for developers who wish to clone and run the code on their local machines).*

1. Clone the repo:
   git clone https://github.com/krish-2048-real/architecture-visualizer-v2.git

2. Start Backend:
   cd backend
   python -m venv .venv
   # Windows: .venv\Scripts\activate | Mac/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   python app.py

3. Start Frontend:
   cd frontend
   npm install
   npm run dev

---

## 🔌 API Endpoints

### GET /api/files
Returns the hierarchical file structure of the project.

### GET /api/health
Health check endpoint to verify the API is running.

---

## 🛡️ Configuration & Smart Filtering

The backend automatically ignores heavy or sensitive directories to optimize performance:
- node_modules, .next, dist, build
- .venv, venv, env, __pycache__, .pytest_cache, .mypy_cache
- .git, .egg-info, bob_sessions

The following files are also ignored:
- .DS_Store, Thumbs.db, .env
- Hidden files (starting with .) are ignored by default, except .gitignore.

---

## 🔮 Future Enhancements
* 📊 File statistics (size, count, types)
* 🔍 Search and filter functionality
* 📁 File content preview
* 💾 Export tree structure to JSON/Markdown

---
*Built with ❤️ using Flask and Next.js*
