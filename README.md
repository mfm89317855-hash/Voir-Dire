# Voir Dire — Modern Learning Platform & Academic Integrity Shield

A modern online learning platform with live AI proctoring, face-presence verification, and explainable multi-source academic integrity forensics.

Inspired by [era-edu-mtoc.vercel.app](https://era-edu-mtoc.vercel.app/).

## Key Platform Features

- **Marketing & Landing Experience**:
  - Live hardware monitoring bezel preview with automated biometric face tracking.
  - Institutional flat-rate licensing model.
  - Interactive FAQ accordion & feature matrix.
- **Student Assessment & Learning Suite**:
  - Direct 6-digit exam join codes (`849201`, `312904`, `551829`).
  - Active Biometric Sentinel with real-time face verification canvas HUD.
  - Secure fullscreen lock and tab-blur violation detection.
  - Multi-format questions: Multiple Choice, Algorithmic Code challenges, Short answer proofs.
  - Question countdown timer, instant grade scoring, and concept explanations.
  - Course catalog with category filters and interactive syllabus topics.
- **Teacher Course & Exam Studio**:
  - Course authoring with category validation.
  - Question bank creator (MCQ, Code Snippet, Points, Difficulty, Tags, Rubric notes).
  - Proctoring rule manager (toggle strict camera presence, tab tolerances, time limits).
  - Student submissions review table with **Export Student Marks to CSV**.
  - Cohort score distribution histograms & difficulty anomaly detection.
- **Admin Integrity Stream**:
  - Real-time telemetry log (`TAB_SWITCH`, `FULLSCREEN_EXIT`, `LOOKING_AWAY`, `RAPID_PASTE`, `NETWORK_CO_LOCATION`).
  - Severity filtering (High, Medium, Low).
  - One-click **"Investigate with Shield AI"** direct bridge to the deep forensic case engine.
- **Multi-Source Forensic AI Investigator**:
  - Dual-sided analysis weighing both evidence of collusion and mitigating factors (e.g. library Wi-Fi drops, high student GPA baseline).
  - Sequential hypothesis formulation across 5 telemetry feeds.
  - Powered by Gemini 3.8 Flash with robust offline fallback engine.

## Running Locally

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. (Optional) Set your `GEMINI_API_KEY` in `.env`:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
