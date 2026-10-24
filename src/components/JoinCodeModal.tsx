import React, { useState } from 'react';
import { KeyRound, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { QUIZZES_CATALOG } from '../mockData';
import { QuizExam } from '../types';

interface JoinCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: (quiz: QuizExam) => void;
}

export const JoinCodeModal: React.FC<JoinCodeModalProps> = ({
  isOpen,
  onClose,
  onJoinSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = pin.trim();
    const found = QUIZZES_CATALOG.find((q) => q.code === trimmed);

    if (found) {
      onJoinSuccess(found);
      onClose();
    } else {
      setError(`Exam PIN "${trimmed}" not found. Try sample active codes: 849201, 312904, or 551829.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-glow-emerald space-y-5 animate-in fade-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <KeyRound className="w-7 h-7" />
          </div>

          <h3 className="font-display text-2xl font-bold text-white">
            Enter 6-Digit Join PIN
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Input the assessment PIN provided by your university instructor or choose a live test code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. 849201"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center font-mono text-2xl font-black tracking-widest text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
              {error}
            </p>
          )}

          {/* Quick Click Demo Codes */}
          <div className="pt-1">
            <span className="text-[11px] font-bold text-slate-400 block text-center mb-2">
              Quick Test Exam Codes:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUIZZES_CATALOG.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setPin(q.code)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  {q.code} ({q.courseCode})
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Verify & Begin Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
