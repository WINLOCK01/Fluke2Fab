# GenAI Thought Companion – Idea-to-Insight Engine

A full-stack, AI-powered web application that takes your raw ideas, thoughts, or brain-dumps and uses advanced LLMs to transform them into structured, actionable insights. By leveraging OpenRouter, the app dynamically routes analysis to top-tier models like **Gemma 4 26B** and **Minimax**.

## 🚀 Features

- **Instant Idea Parsing**: Converts unstructured text into a five-part actionable breakdown:
  1. Summary
  2. Key Insights
  3. Action Plan
  4. Risks & Challenges
  5. Opportunities
- **Glassmorphic UI**: Beautiful, modern dashboard built with React, Vite, and Tailwind CSS v4.
- **Persistent Memory**: A complete SQLite database attached to the FastAPI backend ensures your generated ideas are saved permanently and automatically.
- **Resilient AI Pipeline**: Uses OpenRouter with a primary model (`google/gemma-4-26b-a4b-it:free`) and an automatic fallback model to ensure maximum uptime, extracting explicit JSON using robust RegEx parsing.

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript via Vite), Tailwind CSS v4, Axios, Lucide Icons.
- **Backend**: FastAPI (Python), Uvicorn.
- **Database**: SQLite (Async via `aiosqlite` and `SQLAlchemy`).
- **AI/LLM API**: OpenRouter (HTTPX).

## 📥 Setup & Installation

### 1. Requirements
Ensure you have the following installed on your machine:
- Node.js (v18+)
- Python (v3.10+)

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1    # (On Windows PowerShell)
   # Or "source venv/bin/activate" on macOS/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Secret Environment Variables:
   Open `backend/.env` and ensure your `OPENROUTER_API_KEY` is set:
   ```ini
   OPENROUTER_API_KEY=your_api_key_here
   ```
5. Start the Server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will boot up at `http://localhost:8000`. The SQLite `memory.db` database will automatically initialize itself in this folder on its first run.*

### 3. Frontend Setup
1. Open a second terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite Dev Server:
   ```bash
   npm run dev
   ```
   *The frontend will boot up at `http://localhost:5173`. Open this URL in your browser to start generating insights!*

## 🔌 API Documentation

**POST `/analyze`**
Intercepts raw user text input and coordinates with OpenRouter models to produce standard JSON output.
*Request Schema:*
```json
{
  "user_input": "string"
}
```
*Response Schema:*
```json
{
  "summary": "string",
  "insights": ["string"],
  "actions": ["string"],
  "risks": ["string"],
  "opportunities": ["string"]
}
```

## 🤝 Architecture Overrides
- **Regex Extraction Guardrails**: Exploratory and free-tier OpenRouter models occasionally output conversational padding (e.g., "Sure, here's your output:") around their JSON blocks. This backend uses explicit Regex (`re.search`) to slice exactly the `{ ... }` dictionary from the stream, mathematically avoiding frontend crashes resulting from malformed requests.
