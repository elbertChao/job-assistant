# 💼 AI-Powered Job Application Assistant

LIVE DEMO (Current Completed Version): https://www.loom.com/share/bd6cdfecaded4dcd8349b41b304744d8?sid=960eb653-27a9-4e89-b6ac-789fa8618c5f
LIVE DEPLOYMENT LINK: https://job-assistant-frontend.onrender.com/
(Please be aware I am using my own personal paid OpenAI API key, be nice :) pls...)
An intelligent job application tool that helps users tailor their resumes and generate interview answers based on real job descriptions. This project uses a modern web stack (React, TypeScript, Tailwind CSS, FastAPI, Supabase, OpenAI) to simplify and optimize the job-hunting process.

---

## ✨ Core Features

- 🔍 **Resume Scoring**  
  Analyze how well your resume aligns with a job posting (via URL) and get improvement suggestions.

- 🤖 **AI-Powered Interview Answering**  
  Get personalized answers to interview questions using your resume and the job description.

- 📄 **Job Description Parsing**  
  Automatically extract relevant job description text from a URL using `newspaper3k`, `readability-lxml`, or raw HTML fallback.

- 🔐 **Authentication & User Profiles**  
  Sign up/log in and securely store your resumes and job-related data with Supabase.

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- React Router
- Supabase Auth

### Backend
- FastAPI
- Supabase Python client
- OpenAI API (for resume scoring & interview answering)
- Custom logging and job description scraping utilities

---

## 🚀 Getting Started

### 1. Clone the Repository

```
git clone https://github.com/YOUR_USERNAME/job-assistant.git
cd job-assistant
```

### 2. Install Frontend
```
cd frontend
npm install
```
Create a .env file in frontend/ with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
Then run:
```
npm run dev
```
The frontend runs at http://localhost:5173

---

### 3. Create a virtual environment (venv) & Install Backend Packages
Note: this is an example performed in Windows, Linux/Apple users may have different venv commands
```
cd ../backend
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
```
Create a .env file in backend/ with:
```
OPENAI_API_KEY=your-openai-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-role-key
```
Then run the server:
```
uvicorn main:app --reload
```
The backend runs at http://localhost:8000

---

## 🧪 API Endpoints
| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/generate/score`  | Score resume vs job URL      |
| POST   | `/api/generate/answer` | Generate AI interview answer |
| POST   | `/api/users`           | Create a new user profile    |
| GET    | `/api/users/{userId}`  | Retrieve user profile & data |

---

## 🧱 Supabase Schema Overview
Table: profiles

- `id, email, full_name, created_at`

Table: resumes

- `id, user_id, resume_text, created_at`

Table: job_applications

- `id, user_id, jd_url, score, breakdown, created_at`

---

## 🧠 Credits
Built by Elbert Chao using:

- React (TypeScript)

- OpenAI API

- Supabase

- FastAPI

- Tailwind CSS

---

## 📄 License
MIT License. See [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) for details.
