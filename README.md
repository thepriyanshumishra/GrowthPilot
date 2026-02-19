# 🚀 GrowthPilot: AI-Powered Career Accelerator

<div align="center">
  <img src="public/logo.png" alt="GrowthPilot Banner" width="120" />
</div>

<p align="center">
  <em>Navigate your career growth with precision using AI-native roadmaps, daily tactical tasks, and an embedded voice coach.</em>
</p>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-white?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Groq](https://img.shields.io/badge/AI-Groq_Llama_3-orange?style=for-the-badge)](https://groq.com/)

</div>

---

## 📖 Overview

**GrowthPilot** is a high-performance career engineering platform designed to transform ambitious professionals into industry leaders. It goes beyond generic advice by generating bespoke learning roadmaps, atomic daily tasks, and providing 24/7 contextual AI coaching based on your specific profile and target roles.

---

## ✨ Key Features

### 🧠 Deep AI Profiling
- **Conversational Intake**: An intuitive onboarding flow powered by **Llama-3.3-70B** that maps your current skills, career goals, and experience level.
- **Resume Parsing**: Instantly extracts structured semantic data from your resume to identify skill gaps.

### 🗺️ Dynamic Precision Roadmaps
- **Tactical Milestone Generation**: Converts vague career aspirations into 4-6 high-impact, actionable milestones.
- **Atomic Daily Tasks**: Breaks massive milestones down into bite-sized tasks taking less than 45 minutes to complete.
- **Dependency Graph**: Ensures you learn prerequisite concepts before tackling advanced topics.

### 💬 The 24/7 AI Career Coach
- **Context-Aware Mentorship**: Your AI coach remembers your entire roadmap, past struggles, and current focus, acting as a true companion rather than a generic chatbot.
- **Voice Mode**: Practice mock interviews and review concepts hands-free with fully integrated voice chat.

### 🎮 Gamified Execution Layer
- **Pomodoro Mission Control**: Integrated focus timer (Pomodoro, Short Burst, Deep Work) with ambient sounds to keep you engaged.
- **XP & Milestones**: Earn points, unlock badges, and track your daily streak to maintain momentum.

---

## 🛠️ Architecture & Tech Stack

- **Frontend & Server**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **AI Inference Engine**: [Groq SDK](https://groq.com/) (Llama-3.3-70b-versatile) for blazing-fast LLM responses.
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) mapped to the server via NextAuth/Custom endpoints.
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- A [Supabase](https://supabase.com/) project (PostgreSQL)
- A [Groq](https://groq.com/) API Key for the AI Engine
- A [Firebase](https://firebase.google.com/) Project for Authentication

### 2. Environment Configuration
Create a `.env` file in the root directory and populate it with your specific keys:

```bash
# Database (Supabase)
# Note: Use the Transaction Pooler URL (usually port 6543)
DATABASE_URL="postgresql://[USER]:[PASS]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require"

# AI Inference (Groq)
GROQ_API_KEY="gsk_..."

# Authentication (Firebase Admin)
# Paste the ENTIRE contents of your Firebase Service Account JSON file here
FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", "project_id": "...", ...}'
```

### 3. Installation & Database Sync

```bash
# Clone the repository
git clone https://github.com/thepriyanshumishra/GrowthPilot.git
cd GrowthPilot

# Install dependencies
npm install

# Push database schema to Supabase
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Run development server
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deployment Guide (Vercel)

GrowthPilot is heavily optimized for edge networks and serverless deployment via Vercel.

1. **Link Repository**: Go to the Vercel dashboard and import your GitHub repository.
2. **Environment Variables**: Add all variables from your `.env` file (`DATABASE_URL`, `GROQ_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`) to the Vercel project settings. *Make sure the entire JSON string for Firebase is pasted exactly.*
3. **Build Command**: Vercel will automatically run `npm run build`. If you need Prisma to run migrations on deployment, override the build command with:
   ```bash
   npx prisma generate && npx prisma migrate deploy && next build
   ```
4. **Deploy**: Hit Deploy. The app will be live within seconds.

---

## 📂 Project Structure

```text
GrowthPilot/
├── app/                  # Next.js App Router (Pages, Layouts, APIs)
│   ├── (dashboard)/      # Protected routes (Dashboard, Roadmap, Chat)
│   ├── api/              # Backend endpoints
│   ├── auth/             # Login/Signup/Firebase handling
│   └── onboarding/       # AI Profiling flow
├── components/           # Reusable UI Architecture
│   ├── dashboard/        # Complex stateful dashboard widgets
│   ├── ui/               # Base shadcn component library
│   └── chat/             # Chat interface and voice processing
├── lib/                  # Core Utilities & Connections
│   ├── ai/               # Groq Prompts, RAG Logic, Agent actions
│   ├── prisma.ts         # Database singleton
│   └── firebase-admin.ts # Server-side Auth verify logic
├── prisma/               # Schema definitions
└── scripts/              # Useful utilities (DB probing, testing)
```

---

## 🤝 Contributing

We welcome contributions to GrowthPilot! 

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request for review.

---

## 📄 License & Credits

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Built with ⚡ and ❤️ for Hackathons.
