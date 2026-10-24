import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  KeyRound,
  FileCheck2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Clock,
  Laptop,
  Database,
  Lock,
  Scale,
  Users,
  Award,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onStartTrial: () => void;
  onEnterJoinCode: () => void;
  onExploreTeacher: () => void;
  onExploreInvestigator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartTrial,
  onEnterJoinCode,
  onExploreTeacher,
  onExploreInvestigator,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quickCode, setQuickCode] = useState('');

  const faqs = [
    {
      q: 'Is student camera footage ever recorded or stored on external servers?',
      a: 'Never. Voir Dire executes all computer vision and face-presence models strictly client-side inside the local browser sandbox. Only numerical focus telemetry and violation timestamps are logged, guaranteeing complete student privacy.',
    },
    {
      q: 'Can teachers customize the monitoring rules per exam?',
      a: 'Yes. Instructors can toggle strict fullscreen enforcement, require camera presence, set custom time limits, and configure maximum allowable tab-switch tolerances before automated submission.',
    },
    {
      q: 'How does the forensic AI engine prevent false cheating accusations?',
      a: 'Unlike traditional proctoring software that flags students blindly, Voir Dire assesses mitigating factors: verifying whether a window blur matched physical campus Wi-Fi drops, checking historical student GPA baselines, and auditing keystroke derivation dynamics.',
    },
    {
      q: 'Can instructors export marks and audit logs for academic boards?',
      a: 'Yes. Every exam session generates an immutable timeline and an exportable CSV spreadsheet containing complete student marks, time durations, and proctoring telemetry.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden bg-mesh-emerald">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Now with AI face-presence proctoring</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          The integrity engine for{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            modern online learning
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Per-student forensic timelines, client-side webcam biometric verification, and explainable multi-source evidence reports give educators the receipts to defend every score.
        </p>

        {/* CTA Button Island */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onStartTrial}
            className="btn-island-primary cursor-pointer text-sm font-bold"
          >
            <span>Start Free Student Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onEnterJoinCode}
            className="btn-island-ghost cursor-pointer text-sm font-semibold"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Enter 6-Digit Join Code</span>
          </button>

          <button
            onClick={onExploreInvestigator}
            className="btn-island-ghost cursor-pointer text-sm font-semibold border-indigo-500/30 text-indigo-300 hover:text-white"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>AI Forensic Investigator</span>
          </button>
        </div>

        {/* Quick Join Code Bar */}
        <div className="mt-6 flex items-center justify-center gap-2 max-w-xs mx-auto">
          <input
            type="text"
            placeholder="e.g. 849201"
            value={quickCode}
            onChange={(e) => setQuickCode(e.target.value)}
            maxLength={6}
            className="w-32 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-center font-mono text-sm tracking-widest text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={onEnterJoinCode}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer"
          >
            Join
          </button>
        </div>

        {/* HARDWARE BEZEL LIVE MONITORING SHOWCASE */}
        <div className="mt-14 max-w-5xl mx-auto bezel">
          <div className="bezel-core p-4 sm:p-6 text-left">
            {/* Bezel Window Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  voirdire-sentinel://secure-session/CS-301
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MONITORING · 24 STUDENTS</span>
                </span>
              </div>
            </div>

            {/* Inner Dashboard Live Mockup */}
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Question & Exam Active View */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    CS-301 · Question 3 of 5
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Time Left: 18:42</span>
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                  What is the worst-case time complexity of inserting into a balanced AVL tree?
                </h3>

                {/* Simulated Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-400 flex items-center justify-between">
                    <span>A. O(1) Constant Time</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-sm font-bold text-emerald-300 flex items-center justify-between shadow-glow-emerald">
                    <span>B. O(log n) Logarithmic</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-400 flex items-center justify-between">
                    <span>C. O(n) Linear Time</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-400 flex items-center justify-between">
                    <span>D. O(n log n) Quasilinear</span>
                  </div>
                </div>

                {/* Real-time Telemetry Stream */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Keystroke: 54 WPM (Organic)</span>
                  </span>
                  <span>Tab Switches: 0</span>
                  <span>Window Blur: 0s</span>
                  <span className="text-cyan-400">Cohort Lexical Overlap: 4.2% (Nominal)</span>
                </div>
              </div>

              {/* Biometric Sentinel Face Tracking Preview */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-inner">
                <div className="relative w-44 h-36 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/40 flex items-center justify-center">
                  {/* Futuristic Face Silhouette & Scanlines */}
                  <svg className="w-28 h-28 text-emerald-500/30" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="40" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M25 85 C25 65 75 65 75 85" stroke="currentColor" strokeWidth="2" />
                    {/* Crosshair corners */}
                    <path d="M22 25 L32 25 M22 25 L22 35" stroke="#10b981" strokeWidth="2" />
                    <path d="M78 25 L68 25 M78 25 L78 35" stroke="#10b981" strokeWidth="2" />
                    <path d="M22 75 L32 75 M22 75 L22 65" stroke="#10b981" strokeWidth="2" />
                    <path d="M78 75 L68 75 M78 75 L78 65" stroke="#10b981" strokeWidth="2" />
                  </svg>

                  {/* Top verified badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-950/90 border border-emerald-400 text-[9px] font-bold text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>FACE VERIFIED</span>
                  </div>

                  <div className="absolute bottom-2 right-2 text-[9px] font-mono text-emerald-300/80 bg-slate-950/80 px-1 rounded">
                    GAZE: 100% FOCUS
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs font-bold text-slate-200">Biometric Sentinel</p>
                  <p className="text-[10px] text-slate-400">Zero Raw Video Saved · Private AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
            Seamless Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2">
            How Voir Dire Defends Academic Fair Play
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            From the moment students join to the final graded submission, every signal is checked and balanced.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-105 transition-transform">
              01
            </div>
            <h3 className="font-display text-lg font-bold text-white">Instant 6-Digit Join Code</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Students enter a simple PIN. We verify enrolled identity, test the local camera, and initialize secure fullscreen mode in seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-105 transition-transform">
              02
            </div>
            <h3 className="font-display text-lg font-bold text-white">Client-Side Biometric Shield</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Lightweight browser AI tracks face-presence and gaze focus in real-time, enforcing fullscreen lock and logging tab-switch interruptions.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-105 transition-transform">
              03
            </div>
            <h3 className="font-display text-lg font-bold text-white">Forensic Evidence Synthesis</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Flagged events connect directly to the Quiz Shield Investigator, synthesizing network telemetry, keystroke rhythm, and syllabus vector similarity.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Eye className="w-7 h-7 text-emerald-400 mb-4" />
            <h4 className="font-display font-bold text-white text-base">Private Computer Vision</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Zero video streams leave the student device. Face detection runs purely in local WebAssembly for maximum student privacy and GDPR compliance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Scale className="w-7 h-7 text-indigo-400 mb-4" />
            <h4 className="font-display font-bold text-white text-base">Balanced Reasoning AI</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Audits counter-evidence: honors exceptional student baseline velocity, accounts for network Wi-Fi drops, and eliminates false positives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <FileCheck2 className="w-7 h-7 text-cyan-400 mb-4" />
            <h4 className="font-display font-bold text-white text-base">Exportable Board Receipts</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Export one-click marks CSV spreadsheets and granular second-by-second telemetry audits ready for academic dean review.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Lock className="w-7 h-7 text-amber-400 mb-4" />
            <h4 className="font-display font-bold text-white text-base">Secure Fullscreen Lockdown</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Auto-detects escape attempts, multi-monitor dragging, and split-screen aids, recording every blur interval with pinpoint accuracy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Database className="w-7 h-7 text-rose-400 mb-4" />
            <h4 className="font-display font-bold text-white text-base">Leak & Repository Correlation</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Cross-references anomalous solving velocity against online leaked answer repositories to substantiate uncharacteristically fast submissions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Award className="w-7 h-7 text-emerald-400 mb-4" />
            <h4 className="font-display font-bold text-white text-base">Interactive Course Studio</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Teachers can author MCQ, code snippet, and essay challenges with automated grading, passing thresholds, and custom proctoring tolerances.
            </p>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL PRICING SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
          Flat-Rate Institution Licensing
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2">
          One Licence For Your Entire University
        </h2>
        <p className="text-slate-400 mt-3 text-sm max-w-xl mx-auto">
          No per-teacher fees. No nickel-and-diming per exam attempt. Deploy campus-wide with confidence.
        </p>

        <div className="mt-12 max-w-md mx-auto p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/40 shadow-glow-emerald text-left">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              Campus Enterprise
            </span>
            <span className="text-slate-400 text-xs font-mono">Annual or Monthly</span>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-5xl font-black text-white">$499</span>
            <span className="text-slate-400 text-sm">/ month flat</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Unlimited students · Unlimited faculty · Unlimited proctored exams</p>

          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Biometric Sentinel face proctoring</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Multi-Source Quiz Shield Forensic AI Engine</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Teacher Question Studio & CSV Marks Export</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Real-Time Admin Integrity Audit Log Stream</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero-Storage Client-Side Privacy Guarantee</span>
            </li>
          </ul>

          <button
            onClick={onStartTrial}
            className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Launch Interactive Demo Platform
          </button>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-emerald-400 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="/eraedu-mark.svg" alt="Voir Dire Logo" className="w-5 h-5" />
            <span className="font-display font-bold text-slate-300">Voir Dire Platform</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={onStartTrial} className="hover:text-emerald-400 cursor-pointer">Student Portal</button>
            <button onClick={onExploreTeacher} className="hover:text-emerald-400 cursor-pointer">Teacher Studio</button>
            <button onClick={onExploreInvestigator} className="hover:text-emerald-400 cursor-pointer">Forensic AI</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
