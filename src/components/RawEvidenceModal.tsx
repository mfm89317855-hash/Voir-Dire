import React, { useState } from 'react';
import { StudentAttempt } from '../types';
import { X, Code2, Wifi, Activity, Database, Check, AlertCircle } from 'lucide-react';

interface RawEvidenceModalProps {
  student: StudentAttempt;
  onClose: () => void;
}

export const RawEvidenceModal: React.FC<RawEvidenceModalProps> = ({
  student,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'session' | 'network' | 'history'>('code');

  const ds = student.dataSources;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Raw Evidence & Telemetry Inspector: {student.name}</span>
                {student.isPlant && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Case {student.isPlant} Receipts
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Verifiable underlying data queried by the agent during investigation
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-white px-4 text-xs font-medium space-x-2">
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3 flex items-center space-x-1.5 border-b-2 cursor-pointer font-semibold ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code / Essay Overlap Diff</span>
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`py-3 px-3 flex items-center space-x-1.5 border-b-2 cursor-pointer font-semibold ${
              activeTab === 'session'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Session & Keystroke Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`py-3 px-3 flex items-center space-x-1.5 border-b-2 cursor-pointer font-semibold ${
              activeTab === 'network'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Network & Hardware Fingerprint</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 flex items-center space-x-1.5 border-b-2 cursor-pointer font-semibold ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Question Bank & SIS Baseline</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800">Matched Target: </span>
                  <span className="text-slate-600">
                    {ds.similarity.matchedStudentName || 'Cohort Corpus'}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded border border-indigo-200">
                  {ds.similarity.cohortComparison}
                </div>
              </div>

              {ds.similarity.matchedSnippet ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Submission */}
                  <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 p-2.5 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                      <span>{student.name}&apos;s Recorded Input</span>
                      <span className="text-[10px] font-mono text-slate-500">Student Submission</span>
                    </div>
                    <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed h-64 select-text">
                      <code>{ds.similarity.matchedSnippet.studentCode}</code>
                    </pre>
                  </div>

                  {/* Compared Peer or Source */}
                  <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 p-2.5 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                      <span>Comparison Reference ({ds.similarity.matchedStudentName})</span>
                      <span className="text-[10px] font-mono text-slate-500">Vector Corpus Match</span>
                    </div>
                    <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed h-64 select-text">
                      <code>{ds.similarity.matchedSnippet.peerCode}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg text-slate-600">
                  No abnormal verbatim similarity detected for this attempt.
                </div>
              )}

              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-slate-700">
                <span className="font-bold text-indigo-900">Agent Cross-Check Observation: </span>
                {ds.similarity.verbatimPhrases}
              </div>
            </div>
          )}

          {activeTab === 'session' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Total Focus Switches</span>
                  <span className="text-lg font-bold text-slate-900">
                    {ds.sessionEvents.totalTabSwitches} switches
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Total Blurred Time</span>
                  <span className="text-lg font-bold text-slate-900">
                    {ds.sessionEvents.totalTimeBlurredSec} seconds
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 border-b border-slate-200 font-bold text-slate-800">
                  Chronological Telemetry Event Log
                </div>
                <div className="divide-y divide-slate-100 font-mono text-[11px]">
                  {ds.sessionEvents.eventLog.map((ev, i) => (
                    <div key={i} className="p-2.5 flex items-start space-x-3 hover:bg-slate-50">
                      <span className="text-slate-400 font-semibold w-16">{ev.time}</span>
                      <span className="font-bold text-slate-800 w-44">{ev.event}</span>
                      <span className="text-slate-600 flex-1">{ev.targetWindow}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px]">
                <span className="font-bold text-slate-900 font-sans block mb-1">Keystroke Cadence Analysis:</span>
                {ds.timing.keyKeystrokeMetric}
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">IP Address & Gateway</span>
                <span className="text-slate-900 font-bold text-sm">{ds.deviceAndHistory.ipAddress}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Device & Browser User Agent</span>
                <span className="text-slate-900">{ds.deviceAndHistory.userAgent}</span>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-slate-800 font-sans">
                <span className="font-bold text-indigo-950 block mb-1">Forensic Network Assessment:</span>
                {student.isPlant === 'A' && (
                  <p>
                    <strong>High Corroboration:</strong> Marcus Vance and Elena Rostova communicated through the identical <code>/24</code> residential gateway subnet within a 4-minute submission window.
                  </p>
                )}
                {student.isPlant === 'B' && (
                  <p>
                    <strong>Legitimate Static Connection:</strong> Amina Chen submitted from her designated University Honors Dorm static IP, exactly matching 18 prior semester examinations.
                  </p>
                )}
                {student.isPlant === 'C' && (
                  <p>
                    <strong>Documented Infrastructure Drop:</strong> The West Wing campus router log recorded 68% packet loss and forced DHCP renewal at 02:18 PM, perfectly explaining the 90s window blur without foul play.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Cumulative SIS GPA</span>
                  <span className="text-lg font-bold text-slate-900">
                    {ds.deviceAndHistory.historicalGPA.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Historical Exam Averages</span>
                  <span className="text-lg font-bold text-slate-900">
                    {ds.deviceAndHistory.pastQuizAverages.join('%, ')}%
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Question Bank Health & Leaks</span>
                <p className="text-slate-600 text-xs">{ds.questionBankNotes.leakStatus}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Faculty & Course Notes</span>
                <p className="text-slate-600 text-xs">{ds.questionBankNotes.facultyNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
