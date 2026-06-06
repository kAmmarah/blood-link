# BloodLink 🩸

> Real-time blood donor matching for Karachi's emergency medical network — powered by AI over WhatsApp.

**Live:** [blood-link-eight-beta.vercel.app](https://blood-link-eight-beta.vercel.app) · **Repo:** [github.com/kAmmarah/blood-link](https://github.com/kAmmarah/blood-link)

Built for **GDG AI Build Hackathon 2026** in partnership with Al-Khidmat Foundation.

---

## The Problem

When a patient urgently needs blood in Karachi, the search is chaotic. Families post in WhatsApp groups, call hospital admins, and message Facebook pages — forwarding contacts of donors who turn out to be unreachable, ineligible, or in the wrong part of the city.

Al-Khidmat maintains a verified donor network of 25,000+ volunteers across blood groups and neighbourhoods. The bottleneck is not the data — it is the interface. Accessing that network currently requires going through a human coordinator, which doesn't scale during emergencies, late nights, or when multiple requests come in simultaneously.

**BloodLink solves this with a single WhatsApp message.**

---

## How It Works

A requester types a message in any language — Urdu, Roman Urdu, or English:

> *"AB negative chahiye jaldi — patient at Liaquat National, 3 units urgent"*

From that single message, the system:

1. **Parses intent** — Claude AI extracts blood group, unit count, hospital, urgency level, and location
2. **Ranks donors** — scores 200+ donors by proximity, eligibility, last-donation date, and response history
3. **Notifies the hospital** — Hospital Connect confirms the time slot in parallel
4. **Contacts donors in waves** — first wave of 8–10 high-ranked donors; auto-escalates if needed
5. **Understands natural replies** — *"kal subah aa sakta hoon"* is parsed as a scheduled commitment; *"I gave last month"* silently updates eligibility
6. **Confirms the match** — both donor and hospital receive a summary; coordinator dashboard logs everything

**Result:** donor arrives at hospital, patient gets blood, zero manual steps by any coordinator.

---

## Features

| Feature | Description |
|---|---|
| **Hospital Connect** | Hospitals submit blood requests with blood group, units, and urgency. Live status board shows all active requests in real time. |
| **Donor Portal** | Donors register with blood group, area, and last donation date. Receive alerts when their group is needed nearby. Confirm or skip with one tap. |
| **AI Agent** | Multilingual chat interface powered by Claude. Answers queries about donor availability, hospital needs, and registration in Urdu, Roman Urdu, or English. |
| **Coordinator Dashboard** | Full situational awareness — all hospitals, all requests, donor availability by blood group, fulfillment progress, and live filters. |

---

## Tech Stack

### Frontend
- **React 18** — component-driven UI across all four surfaces
- **Vite 5** — ES module-native bundler, sub-second dev server, optimised production builds

### AI Layer
- **Anthropic Claude API** (`claude-3-haiku-20240307`) — multilingual NLU for intent extraction, donor ranking logic, and conversational donor follow-up
- Proxied through a **Vercel serverless function** (`/api/chat`) — API key never exposed to the browser

### Infrastructure
- **Vercel** — zero-config deployment from GitHub, global CDN edge delivery
- **React Context API** (`AppDataContext`) — shared state for requests and donors across all components
- **Synthetic donor dataset** — 200+ records spanning blood groups, Karachi neighbourhoods, and donation history; no real PII used

### Architecture

```
WhatsApp message
      ↓
  Claude API  ←→  /api/chat (Vercel serverless)
      ↓
  React UI (4 surfaces)
      ↓
  AppDataContext (shared state)
      ↓
  Coordinator Dashboard (live tracking)
      ↓
  Match confirmed ✓
```

---

## Project Structure

```
blood-link/
├── api/
│   └── chat.js                  # Vercel serverless proxy for Claude API
├── src/
│   ├── components/
│   │   ├── AIChatAgent.jsx       # Multilingual AI chat interface
│   │   ├── HospitalConnect.jsx   # Blood request submission + live board
│   │   ├── DonorRegistration.jsx # Donor onboarding + alert system
│   │   └── CoordinatorDashboard.jsx  # Full ops view
│   ├── data/
│   │   └── AppDataContext.jsx    # Global state — requests + donors
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Local Development

```bash
git clone https://github.com/kAmmarah/blood-link.git
cd blood-link
npm install
```

Create a `.env` file at the root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### Production Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variable: `ANTHROPIC_API_KEY` = your key (no `VITE_` prefix — it's server-side)
4. Deploy

The `/api/chat.js` serverless function is picked up automatically by Vercel.

---

## Why This Matters

Al-Khidmat's volunteer network is the moat. No fintech, no startup, no app has 25,000+ verified donors with on-ground trust across Karachi's neighbourhoods. The bottleneck was never the data — it was the interface between a stressed family and that network.

BloodLink is that interface.

---

## Team

Built at GDG AI Build Hackathon 2026 · Karachi, Pakistan
