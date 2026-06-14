<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:16213e,100:0f3460&height=200&section=header&text=🏨%20Prestige%20Hotel&fontSize=50&fontColor=e94560&fontAlignY=38&desc=Luxury%20Hotel%20Booking%20Management%20System&descAlignY=58&descSize=18&descColor=a8b2d8&animation=fadeIn" width="100%"/>

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini%20AI-2.4-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

<br/>

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ██╗  ██╗ ██████╗ ████████╗███████╗██╗                ║
║   ██║  ██║██╔═══██╗╚══██╔══╝██╔════╝██║                ║
║   ███████║██║   ██║   ██║   █████╗  ██║                ║
║   ██╔══██║██║   ██║   ██║   ██╔══╝  ██║                ║
║   ██║  ██║╚██████╔╝   ██║   ███████╗███████╗           ║
║   ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝           ║
║                                                          ║
║         AI-Powered Luxury Hotel Management               ║
╚══════════════════════════════════════════════════════════╝
```

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔑 Environment Setup](#-environment-setup)
- [📋 Available Scripts](#-available-scripts)
- [🤖 AI Concierge](#-ai-concierge)
- [👥 Portals](#-portals)
- [📊 Dashboard](#-dashboard)

---

## ✨ Features

<div align="center">

| 🏨 Feature | 📝 Description |
|---|---|
| 🤖 **AI Concierge** | Google Gemini powered smart assistant for guests |
| 📅 **Room Booking** | Real-time availability & reservation system |
| 👑 **Admin Portal** | Full hotel management & analytics dashboard |
| 🛎️ **Customer Portal** | Seamless guest booking & profile management |
| 📊 **Live Dashboard** | Revenue charts & occupancy metrics via Recharts |
| 🔔 **Notifications** | Real-time alerts & notification console |
| 🔐 **Hotel Manager** | Dedicated portal for hotel managers |
| 💻 **Code Explorer** | Built-in source code viewer |

</div>

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    TECH STACK                           │
├──────────────────┬──────────────────────────────────────┤
│   FRONTEND       │   React 19 + TypeScript 5.8          │
│   STYLING        │   Tailwind CSS v4 + Lucide Icons      │
│   BUILD TOOL     │   Vite 6.2                           │
│   ANIMATIONS     │   Motion (Framer Motion)             │
│   CHARTS         │   Recharts 3.8                       │
│   BACKEND        │   Express 4.21 + Node.js             │
│   AI ENGINE      │   Google Gemini AI (@google/genai)   │
│   BUNDLER        │   ESBuild + TSX                      │
└──────────────────┴──────────────────────────────────────┘
```

---

## 🏗️ Project Structure

```
Hotel-Booking-Management-System/
│
├── 📄 App.tsx                    # Main app entry & routing
├── 🤖 AiConcierge.tsx            # Gemini AI chatbot component
├── 👑 AdminPortal.tsx            # Admin management panel
├── 🛎️  CustomerPortal.tsx         # Guest-facing booking portal
├── 🏨 HotelManagerPortal.tsx     # Hotel manager dashboard
├── 📊 DashboardWidgets.tsx       # Charts & analytics widgets
├── 🔔 NotificationConsole.tsx    # Real-time notifications
├── 🔍 CodeExplorer.tsx           # Source code viewer
├── 🖥️  server.ts                  # Express backend server
├── 📝 types.ts                   # TypeScript type definitions
├── 🗂️  sourceCodeTemplates.ts     # Code template utilities
├── ⚙️  vite.config.ts             # Vite configuration
├── 🎨 index.css                  # Global styles
├── 📦 package.json               # Dependencies
└── 📖 README.md                  # You are here!
```

---

## ⚡ Quick Start

### Prerequisites

Make sure you have **Node.js** installed on your machine.

```bash
# Check Node.js version (v18+ recommended)
node --version
```

### Installation

**Step 1 — Clone the repository**
```bash
git clone https://github.com/waizkktom123/Hotel-Booking-Management-System.git
```

**Step 2 — Navigate into the project**
```bash
cd Hotel-Booking-Management-System
```

**Step 3 — Install dependencies**
```bash
npm install
```

**Step 4 — Set up your environment** *(see below)*

**Step 5 — Run the development server**
```bash
npm run dev
```

> 🎉 Open your browser at `http://localhost:5173`

---

## 🔑 Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> 🔗 Get your free Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | TypeScript type check |
| `npm run clean` | Remove build artifacts |

---

## 🤖 AI Concierge

The AI Concierge is powered by **Google Gemini 2.4** and provides:

- 💬 Natural language booking assistance
- 🏨 Room recommendations based on preferences
- 📅 Availability queries
- 🍽️ Restaurant & amenity information
- 🗺️ Local area suggestions

---

## 👥 Portals

### 🛎️ Customer Portal
Guests can browse rooms, make bookings, view their reservation history, and interact with the AI Concierge.

### 👑 Admin Portal
Full control over reservations, room management, staff, and revenue analytics.

### 🏨 Hotel Manager Portal
Day-to-day operational management including check-ins, check-outs, and housekeeping.

---

## 📊 Dashboard

Built with **Recharts 3.8**, the dashboard provides:

- 📈 Revenue trends (daily/weekly/monthly)
- 🛏️ Occupancy rate visualization
- 📉 Booking analytics
- 🔔 Real-time notification feed

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f3460,50:16213e,100:1a1a2e&height=120&section=footer&animation=fadeIn" width="100%"/>

**Made with ❤️ by [waizkktom123](https://github.com/waizkktom123)**

⭐ Star this repo if you found it helpful!

</div>
