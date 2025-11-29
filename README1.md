# 🛡️ VeriSense: The Multi-Platform Truth Ecosystem
> *Submitted for MumbaiHacks 2025*

**VeriSense** is a comprehensive investigation ecosystem designed to fight hyper-local misinformation. It consists of two synchronized interfaces: a **Public Telegram Bot** for instant access and a **React Web Platform** for deep analysis and community tracking.

---

## 🚨 The Problem
In India, misinformation doesn't just spread via text—it spreads via **Voice Notes** and **Images** in local languages.
- 🗣️ **Language Barrier:** Most fact-checkers only work well in English.
- 🔊 **Audio Blindspot:** Viral audio rumors cause panic (e.g., mob violence rumors) and are hard to search.
- ⚡ **Velocity:** By the time a human verifies a rumor, it has already reached millions.

---

## 💡 The Solution: A Dual-Interface Ecosystem

### 1. The Web Platform (Command Center)
Built with **React**, this is the dashboard for power users and authorities.
- **✅ Multi-Modal Verification:** Active Text and Image forensics using **Google Gemini 1.5**.
- **🤖 Embedded Bot:** Integrated Telegram interface directly within the Web UI for seamless cross-platform usage.
- **🚧 Local Radar (In Development):** A proactive heat map that aggregates checks to visualize misinformation hotspots in real-time.

### 2. The Telegram Bot (Citizen Shield)
The frontline defense for everyday users.
- **⚡ Instant Checks:** Users forward messages directly to the bot.
- **🗣️ Voice Note Specialist:** Fully active Audio-to-Text verification via **n8n**.
- **🇮🇳 Local Languages:** Responds in the user's native dialect/language.

---

## ⚙️ Architecture & Tech Stack

The system follows a **Hybrid Architecture** combining a low-code backend for orchestration with a custom React frontend.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **AI Brain** | **Google Gemini 1.5** | Multi-modal reasoning (Vision, Audio, Text) |
| **Orchestrator** | **n8n** | Workflow automation, API routing, and logic |
| **Interfaces** | **Telegram Bot API** | Public-facing chatbot |
| **Web UI** | **React.js** | Dashboard & Local Radar interface |
| **Search Tools** | **Tavily API** | Real-time fact retrieval |

---


---

## 🚀 How to Run Locally

### 1. Backend (n8n)
1.  Import `n8n_workflow.json` into your n8n instance.
2.  **Configuration:** Open the workflow and add your API Keys for:
    - Telegram Bot Token
    - Google Gemini API
    - Tavily API
3.  Activate the workflow.

### 2. Frontend (React Web UI)
1.  Navigate to the UI folder: `cd client_ui` (or root depending on your repo).
2.  Install dependencies: `npm install`
3.  Add API Key: Create a `.env` file and add `REACT_APP_GEMINI_KEY=your_key`.
4.  Run the app: `npm start`

---

## 🔮 Future Roadmap
1.  **Local Radar Launch:** Fully enable the geospatial "Rumor Map" to visualize misinformation hotspots.
2.  **Web Audio:** Bring the n8n audio processing pipeline to the Web UI drag-and-drop interface.
3.  **Trust Score:** Gamified community verification where users gain "Trust Points".

---

## 👨‍💻 Team
- **Sharath Kumar:** AI Architecture & n8n Logic
- **Sreejith:** Frontend Development
- **Dharanidhararaghuram:** Research & Backend Integration

---
*Built with ❤️ for MumbaiHacks 2025*
