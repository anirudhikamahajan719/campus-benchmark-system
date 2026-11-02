# Campus Competitive Learning & Skill Benchmarking System

> **FSD-II Capstone Project**  
> Designed to solve inconsistent practice across core Computer Science subjects (**FSD**, **DSA**, **DBMS**, **CN**, **CC**) through structured competitive benchmarking, real-time evaluation pipelines, and institutional analytics.

---

## 🎯 Problem Statement & Solution

### The Core Problem
Students practice inconsistently across foundational computer science subjects. Prior to this platform:
* There was no unified system to track multidimensional skill progression across subjects.
* No platform allowed running structured campus contests spanning **Full Stack Development (FSD)**, **Algorithms (DSA)**, **Database Systems (DBMS)**, **Computer Networks (CN)**, and **Cloud Computing (CC)**.
* Faculty and department heads lacked cohort benchmarking data (comparing Section A vs Section B vs Section C).

### The Solution
A real-time, event-driven web platform that:
1. **Runs Scheduled & Live Contests** featuring challenges across all 5 core CS domains.
2. **Evaluates Submissions Asynchronously** using an event-driven worker pipeline that tests solutions against sample and hidden test cases, recording execution time and memory.
3. **Calculates Live Leaderboards** updated in real-time over WebSockets with tie-breaker logic based on penalty time and problem solve counts.
4. **Benchmarks Batches & Sections** with interactive cohort analytics to diagnose curriculum bottlenecks.
5. **Provides Students with a 5-Axis Competency Radar** comparing their skills against the campus benchmark, accompanied by personalized learning recommendations.

---

## 🏗️ System Architecture & Microservices

The application is structured around a modular microservices pattern:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React + Vite Client                            │
│    (Arena Sandbox, Live Leaderboard, Radar Analytics, Faculty Admin)   │
└──────────────────┬───────────────────────────────▲────────────────────┘
                   │ HTTP REST (Port 5000)          │ WebSocket (ws://)
                   ▼                               │ (Live Updates)
┌──────────────────────────────────────────────────┴────────────────────┐
│                    API Gateway & Microservices Router                  │
├───────────────────┬───────────────────┬───────────────────────────────┤
│ 1. Auth Service   │ 2. Contest Service│ 3. Submission Service         │
│ (JWT + RBAC)      │ (Lifecycle Engine)│ (Ingestion Pipeline)          │
├───────────────────┼───────────────────┼───────────────────────────────┤
│ 4. Evaluation Svc │ 5. Leaderboard Svc│ 6. Analytics Service          │
│ (Async Worker Q)  │ (Ranking Engine)  │ (Radar & Cohort Aggregator)   │
├───────────────────┴───────────────────┴───────────────────────────────┤
│ 7. Notification Service (WebSocket Broadcast Stream)                  │
└───────────────────────────────────┬───────────────────────────────────┘
                                    ▼
                         Persistence Data Store
```

### Microservices Breakdown
* **Auth Service**: JWT authentication with Role-Based Access Control (`student`, `faculty`, `admin`).
* **Contest Service**: Manages contest lifecycle (`UPCOMING`, `LIVE`, `COMPLETED`), duration clocks, and challenge pool.
* **Submission Service**: Handles code submissions and ingests them into the evaluation pipeline.
* **Evaluation Service**: Asynchronous queue processor simulating a sandboxed execution runner. Tests solutions, scores partial/full marks, and computes execution time (ms) and memory (MB).
* **Leaderboard Service**: Computes real-time rankings with tie-breakers (highest score ➔ most problems solved ➔ fastest submission clock).
* **Analytics Service**: Aggregates 5-subject proficiency radars and cohort benchmarks (Batch 2025 vs Batch 2026, Section A vs Section B).
* **Notification Service**: Broadcasts live alert notifications across WebSockets to all connected peers.

---

## ⚡ Tech Stack

* **Frontend**:
  * React 18 & Vite
  * Tailwind CSS (Dark Mode & Glassmorphic UI)
  * Lucide Icons
  * Recharts (5-Domain Radar Charts & Cohort Comparative Bar Charts)
* **Backend**:
  * Node.js & Express
  * WebSockets (`ws` library for sub-second real-time broadcasts)
  * JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
  * Asynchronous Worker Queue
  * File-backed Persistent Store (`db.json`)

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js (v18+ or v20+)
* npm (v9+)

### One-Click Launch (Windows)
Run the included launcher in PowerShell or Command Prompt:
```powershell
.\start-dev.ps1
```
*(Or double click `start-dev.bat`)*

### Manual Startup

#### 1. Start the Backend (Port 5000)
```bash
cd backend
npm start
```

#### 2. Start the Frontend (Port 3000)
In a separate terminal:
```bash
cd frontend
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 🧪 Demo Guide for Evaluators

1. **Live Code Arena**:
   - Filter by domain tabs: `FSD`, `DSA`, `DBMS`, `CN`, `CC`.
   - Select a problem (e.g. *State Hydration & Token Refresh Queue* or *Minimum Latency Data Stream Aggregator*).
   - Click **Run & Submit to Benchmark**.
   - Watch the pipeline transition in real time: `Pending in Queue` ➔ `Evaluating Test Cases` ➔ `Accepted (+100 pts)`.
2. **Instant Live Leaderboard**:
   - Notice the live rank updates without refreshing the page!
   - Filter by **Batch 2025** or **Section A / Section B**.
3. **Institutional Skill Benchmarking**:
   - View the comparative bar chart across all 5 CS subjects comparing Section A vs Section B.
   - Inspect detected learning gaps and curriculum recommendations.
4. **Student Competency Radar**:
   - Switch to the **My Skills & Radar** tab to view your 5-axis competency overlay against campus averages and rule-based advice.
5. **Switch Roles (Student / Faculty / Admin)**:
   - Click the profile pill on the top right to instantly switch between students (`Aarav Sharma`, `Priya Patel`) and faculty (`Dr. Amandeep Kaur`).
   - In the **Faculty & Admin** tab, publish new contests and add challenge problems.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate with JWT token |
| `GET` | `/api/auth/users` | List students and faculty profiles |
| `GET` | `/api/contests?status=LIVE` | Retrieve contests (LIVE, UPCOMING, COMPLETED) |
| `POST` | `/api/contests` | Create a new structured contest |
| `POST` | `/api/contests/:id/problems` | Add a challenge problem with test cases |
| `POST` | `/api/submissions` | Enqueue a submission for async evaluation |
| `GET` | `/api/leaderboard/:contestId` | Get live contest rankings with tie-breakers |
| `GET` | `/api/analytics/batch-benchmark`| Cohort comparison data across FSD, DSA, DBMS, CN, CC |
| `GET` | `/api/analytics/student/:id` | 5-axis radar data and personalized recommendations |
| `GET` | `/api/notifications` | Active system announcements and event logs |
| `WS` | `ws://localhost:5000` | Real-time WebSocket event subscription |
