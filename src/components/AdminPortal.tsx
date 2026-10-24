import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  Laptop,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { IntegrityEvent } from '../types';
import { INITIAL_INTEGRITY_EVENTS, COURSES_CATALOG } from '../mockData';

interface AdminPortalProps {
  onInvestigateCase: (studentCaseId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onInvestigateCase }) => {
  const [activeTab, setActiveTab] = useState<'integrity' | 'overview' | 'courses' | 'audit'>('integrity');
  const [events, setEvents] = useState<IntegrityEvent[]>(INITIAL_INTEGRITY_EVENTS);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredEvents = events.filter((e) => {
    const matchesSev = severityFilter === 'all' || e.severity === severityFilter;
    const matchesSearch =
      e.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.quizTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.type.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
            Institution Security & Forensic Audit Stream
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Admin Integrity Sentinel
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SENTINEL DAEMON: ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800/80 pt-4 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('integrity')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'integrity'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Real-Time Integrity Events ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          System Health Overview
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'courses'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Institution Courses ({COURSES_CATALOG.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'audit'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          IP & Device Audit Logs
        </button>
      </div>

      {/* ======================================================== */}
      {/* INTEGRITY EVENTS TAB */}
      {/* ======================================================== */}
      {activeTab === 'integrity' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search examinee, event type, or quiz..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {(['all', 'high', 'medium', 'low'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sev} Severity
                </button>
              ))}
            </div>
          </div>

          {/* Events Stream Cards */}
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const isHigh = evt.severity === 'high';
              const isMed = evt.severity === 'medium';

              return (
                <div
                  key={evt.id}
                  className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isHigh
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-sm'
                      : isMed
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : isMed
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {evt.severity} severity · {evt.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{evt.timestamp}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">
                      {evt.studentName}{' '}
                      <span className="text-slate-400 font-normal text-xs">({evt.studentEmail})</span>
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {evt.details}
                    </p>

                    <p className="text-[11px] text-slate-400 font-mono">
                      Associated Exam: <span className="text-slate-300">{evt.quizTitle}</span>
                    </p>
                  </div>

                  {/* Action Bridge to Quiz Shield Investigator */}
                  <div className="flex-shrink-0 self-end md:self-center">
                    {evt.investigationId ? (
                      <button
                        onClick={() => onInvestigateCase(evt.investigationId!)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition shadow-md shadow-indigo-950/50 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-200" />
                        <span>Investigate with Shield AI →</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-500 text-xs font-mono">
                        Auto-Resolved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SYSTEM HEALTH OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Enrolled Examinees</span>
              <p className="font-display text-3xl font-extrabold text-white mt-2">3,420</p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                99.4% Clean Standing
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Active Proctored Sessions</span>
              <p className="font-display text-3xl font-extrabold text-emerald-400 mt-2">24</p>
              <span className="text-[11px] text-cyan-400 font-semibold mt-1 inline-block">
                Real-Time Telemetry
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Monitored Subnets</span>
              <p className="font-display text-3xl font-extrabold text-white mt-2">42</p>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
                Campus & Remote
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Audit Logs</span>
              <p className="font-display text-3xl font-extrabold text-cyan-400 mt-2">12,840</p>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
                Immutable Ledger
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COURSES DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'courses' && (
        <div className="mt-8 space-y-4 animate-in fade-in duration-200">
          <h3 className="font-display text-xl font-bold text-white">Campus Course Registries</h3>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Enrolled</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {COURSES_CATALOG.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{c.code}</td>
                    <td className="py-3 px-4 font-bold text-white">{c.title}</td>
                    <td className="py-3 px-4 text-slate-400">{c.category}</td>
                    <td className="py-3 px-4 text-slate-300">{c.instructor}</td>
                    <td className="py-3 px-4 font-mono">{c.enrolledCount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IP & DEVICE AUDIT LOGS */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="mt-8 space-y-4 animate-in fade-in duration-200">
          <h3 className="font-display text-xl font-bold text-white">Network IP & Device User-Agent Logs</h3>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
            <p className="text-emerald-400 font-bold">[TELEMETRY STREAM] Audit Daemon listening on port 3000</p>
            <p>198.51.100.42 - Marcus Vance (Chrome 122 on Windows) - Gateway match: Elena Rostova</p>
            <p>198.51.100.18 - Amina Chen (Safari on macOS Sonoma) - 0 tab blur, continuous focus</p>
            <p>198.51.100.89 - Jordan Miller (Firefox on Ubuntu) - DHCP packet drop at 02:18 PM</p>
            <p>198.51.100.104 - Alex Rivera (Edge on Windows 11) - Verified biometric stream active</p>
          </div>
        </div>
      )}
    </div>
  );
};
