CollabAI – AI Powered Workspace SaaS

An AI-powered real-time collaborative workspace built using Next.js, Firebase & Google Gemini API.

CollabAI allows users to:

-Create real-time collaborative pages

-Generate AI-powered content

-Summarize text using Gemini

-Plan daily schedules using AI

-Save task history

-Manage workspace documents

🌐 Live Features

🔐 Authentication (Email/Password)

📄 Real-time Workspace (Firestore Live Sync)

✨ AI Content Generation (Gemini)

🧠 AI Summarization

🗓 AI Daily Planner

📋 Checklist Generator

📂 Sidebar Page Management

🔗 Shareable Page Links

☁️ Firestore Data Storage

🏗 Tech Stack
Frontend
-Next.js 16 (App Router)
-React
-Tailwind CSS
-Lucide Icons

Backend
-Next.js API Routes
-Firebase Firestore
-Firebase Authentication

AI Integration
-Google Gemini API

📁 Folder Structure

``` saas_capstone/
│
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── planner/
│   │       │   └── route.js
│   │       ├── summarize/
│   │       │   └── route.js
│   │       └── generate/
│   │           └── route.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── login/
│   │   └── page.js
│   │
│   ├── page/
│   │   └── [pageId]/
│   │       └── page.js
│   │
│   ├── dailyplanner/
│   │   └── page.js
│   │
│   ├── checklist/
│   │   └── page.js
│   │
│   ├── layout.js
│   └── page.js
│
├── lib/
│   ├── firebase.js
│   ├── auth.js
│   └── firestore.js
│
├── public/
│
├── .env.local
├── package.json
└── README.md
```
👩‍💻 Developed By

-Thanushree Bhat K G

