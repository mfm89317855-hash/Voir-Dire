import React from 'react';
import { X, Trophy, CheckCircle, Shield, Lightbulb, Brain } from 'lucide-react';

interface PitchGuideModalProps {
  onClose: () => void;
}

export const PitchGuideModal: React.FC<PitchGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-indigo-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Hackathon Track Guide: &apos;The Agent That Can Explain Why&apos;
              </h3>
              <p className="text-xs text-slate-600">
                Judging criteria, explainability rationale & planted demo walkthrough
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700">
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1.5">
            <div className="font-bold text-indigo-950 flex items-center space-x-1.5 text-sm">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>Core Problem & Principle</span>
            </div>
            <p>
              Traditional proctoring platforms output an opaque <strong>&quot;Suspicion Score: 87%&quot;</strong>. This destroys teacher-student trust, introduces false accusations, and offers zero explainability.
            </p>
            <p className="font-semibold text-indigo-900">
              VERITAS enforces a strict rule: NEVER output merely a suspicion score. Instead, it investigates across 5 data layers and produces an evidence-backed case report explaining WHY.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>The 3 Planted Cases to Demo for Judges</span>
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40">
                <span className="font-bold text-rose-900">Case A (Marcus Vance) — Clear Cheater</span>
                <p className="text-slate-600 mt-0.5">
                  Anomalous 19s and 24s solves on complex graph proofs, 300+ chars pasted in &lt;200ms, 98.7% identical code with peer Elena Rostova including shared variable typo <code>min_pivott_val</code>, and co-located IP address.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40">
                <span className="font-bold text-emerald-900">Case B (Amina Chen) — The Fairness Demo (False Positive)</span>
                <p className="text-slate-600 mt-0.5">
                  Flagged by a naive speed heuristic (14 min vs 45 min). The agent refutes cheating: 3.98 GPA, Putnam competitor, organic 88 WPM typing with scratchpad proofs, 0 tab blurs. Agent verdict: <strong>Low Concern (False Positive)</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/40">
                <span className="font-bold text-amber-900">Case C (Jordan Miller) — Ambiguous / Inconclusive</span>
                <p className="text-slate-600 mt-0.5">
                  5-minute pause and window blur on essay Q6. The agent connects this with campus library Wi-Fi DHCP reconnects and 68% packet loss at that timestamp. Verdict: <strong>Inconclusive</strong> with low confidence; recommends no punitive accusation.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gemini 3.8 Flash Agent Architecture</span>
            </div>
            <p className="text-slate-600">
              The agent sequentially queries each telemetry layer (Timing, Cohort Similarity, Browser Focus, Network Hardware, Question Leaks), displays a live investigation trace, and calls Google Gemini with strict JSON schema enforcement.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
          >
            Got it, Let&apos;s Demo
          </button>
        </div>
      </div>
    </div>
  );
};
