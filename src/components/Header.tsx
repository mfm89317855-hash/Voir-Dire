import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Check,
  GraduationCap,
  BookOpen,
  Sliders,
  Search,
  KeyRound,
  FileText,
  User,
  Bell,
} from 'lucide-react';
import { UserRole } from '../types';

export interface CoolNameOption {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  origin: string;
}

export const COOL_NAMES: CoolNameOption[] = [
  {
    id: 'voirdire',
    name: 'Voir Dire Sentinel',
    tagline: 'Speaking the Truth in Academic Assessments',
    badge: 'Flagship Platform',
    origin: 'Examinations founded on verifiable truth, continuous biometric proctoring, and forensic intelligence.',
  },
  {
    id: 'veritas',
    name: 'VERITAS',
    tagline: 'Autonomous Forensic Evidence Agent',
    badge: 'Latin for Truth & Objectivity',
    origin: 'Classical academic heritage of discovering what actually happened with balanced multi-source proof.',
  },
  {
    id: 'aegis',
    name: 'AEGIS EXAMINER',
    tagline: 'The Shield of Academic Fairness',
    badge: 'Protective & Impartial',
    origin: 'Guards honest students from blunt algorithmic false positives while detecting true breaches.',
  },
  {
    id: 'claritas',
    name: 'CLARITAS',
    tagline: 'The Explainable Reasoning Agent',
    badge: 'Illumination & Clarity',
    origin: 'Brings light to opaque telemetry, explaining WHY with verifiable receipts and cohort benchmarks.',
  },
];

export type NavigationTab = 'landing' | 'student' | 'teacher' | 'admin' | 'investigator';

interface HeaderProps {
  currentName?: CoolNameOption;
  onSelectName?: (nameOption: CoolNameOption) => void;
  onOpenPitchGuide?: () => void;
  onOpenEvidenceModal?: () => void;
  hasSelectedStudent?: boolean;
  activeTab?: NavigationTab;
  onSelectTab?: (tab: NavigationTab) => void;
  currentRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onQuickJoinCode?: () => void;
  notificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentName = COOL_NAMES[0],
  onSelectName,
  onOpenPitchGuide,
  onOpenEvidenceModal,
  hasSelectedStudent = false,
  activeTab = 'landing',
  onSelectTab,
  currentRole = 'student',
  onChangeRole,
  onQuickJoinCode,
  notificationsCount = 2,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name Selector */}
        <div className="relative flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => onSelectTab?.('landing')}
            className="flex items-center space-x-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow-emerald flex items-center justify-center flex-shrink-0 border border-emerald-400/30 group-hover:scale-105 transition-transform">
              <img
                src="/eraedu-mark.svg"
                alt="Voir Dire Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback icon if image hasn't loaded
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Voir Dire
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Sentinel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Modern Learning & Integrity Shield
              </p>
            </div>
          </button>

          {/* Engine Persona Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-emerald-300 hover:border-emerald-500/30 transition cursor-pointer"
              title="Switch AI forensic reasoning persona"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">{currentName.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute top-10 left-0 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-emerald-500/30 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Forensic AI Persona
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Select Persona</span>
                  </div>
                  <div className="space-y-1">
                    {COOL_NAMES.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onSelectName?.(opt);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-2.5 ${
                          currentName.id === opt.id
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            currentName.id === opt.id ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'
                          }`}
                        >
                          {currentName.id === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs">{opt.name}</span>
                            <span className="text-[10px] text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{opt.tagline}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Central Platform Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner">
          <button
            onClick={() => onSelectTab?.('landing')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab?.('student')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'student'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>
          <button
            onClick={() => onSelectTab?.('teacher')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher Studio</span>
          </button>
          <button
            onClick={() => onSelectTab?.('admin')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Admin & Audit</span>
          </button>
          <button
            onClick={() => onSelectTab?.('investigator')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'investigator'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Investigator</span>
          </button>
        </nav>

        {/* Right Action Tools: Role Switcher & Join Code */}
        <div className="flex items-center space-x-3">
          {/* 1-Click Role Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => {
                onChangeRole?.('student');
                onSelectTab?.('student');
              }}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => {
                onChangeRole?.('teacher');
                onSelectTab?.('teacher');
              }}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                currentRole === 'teacher'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => {
                onChangeRole?.('admin');
                onSelectTab?.('admin');
              }}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Quick Join Code Button */}
          {onQuickJoinCode && (
            <button
              onClick={onQuickJoinCode}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Join Code</span>
            </button>
          )}

          {/* Evidence modal & Pitch Guide triggers */}
          {onOpenEvidenceModal && hasSelectedStudent && (
            <button
              onClick={onOpenEvidenceModal}
              className="hidden xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Telemetry</span>
            </button>
          )}

          {/* Notification Icon */}
          <div className="relative p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <Bell className="w-4 h-4" />
            {notificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {notificationsCount}
              </span>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 pl-1 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-emerald-300 font-bold text-xs">
                {currentRole === 'student' ? 'AR' : currentRole === 'teacher' ? 'AT' : 'AD'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
