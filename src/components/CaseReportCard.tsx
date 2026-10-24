import React, { useState } from 'react';
import { CaseReport, StudentAttempt } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  FileText,
  Compass,
  Printer,
  CheckCircle,
  ExternalLink,
  Info,
} from 'lucide-react';

interface CaseReportCardProps {
  report: CaseReport;
  student: StudentAttempt;
  onOpenEvidenceModal: () => void;
}

export const CaseReportCard: React.FC<CaseReportCardProps> = ({
  report,
  student,
  onOpenEvidenceModal,
}) => {
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);

  const getVerdictTheme = () => {
    if (report.concern_verdict.includes('High Concern')) {
      return {
        badge: 'bg-rose-50 text-rose-800 border-rose-300',
        banner: 'bg-rose-50/70 border-rose-200 text-rose-950',
        icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
        actionTheme: 'bg-rose-600 hover:bg-rose-700 text-white',
      };
    }
    if (report.concern_verdict.includes('Low Concern')) {
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        banner: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        actionTheme: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      };
    }
    return {
      badge: 'bg-amber-50 text-amber-800 border-amber-300',
      banner: 'bg-amber-50/70 border-amber-200 text-amber-950',
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      actionTheme: 'bg-amber-600 hover:bg-amber-700 text-white',
    };
  };

  const getConfidenceBadge = () => {
    if (report.confidence_level === 'High') {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (report.confidence_level === 'Medium') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const theme = getVerdictTheme();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Report Top Header */}
      <div className={`p-5 border-b ${theme.banner}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
              {theme.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Forensic Integrity Brief: {student.name}
                </h3>
                {student.isPlant && (
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700">
                    Case {student.isPlant}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Zero suspicion-score mandate: Cross-source evidence synthesis & mitigating balance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${theme.badge}`}>
              {report.concern_verdict}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getConfidenceBadge()}`}>
              Confidence: {report.confidence_level}
            </span>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-2 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Investigator Synthesis & Why It Was Flagged
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">{report.summary}</p>
        </div>
      </div>

      {/* Two Column Evidence Breakdown: Evidence For vs Counter-Evidence */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Ranked Discrepancies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Flagged Discrepancies ({report.evidence_for.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">Ranked by anomaly severity</span>
          </div>

          <div className="space-y-2.5">
            {report.evidence_for.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/20 text-xs flex flex-col space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950 flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item.source}</span>
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-rose-200/80 leading-normal">
                  {item.data_point}
                </div>
                <div className="text-slate-700 text-xs leading-normal pt-0.5">{item.finding}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter Evidence & Mitigating Factors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mitigating Factors & Baseline Proof ({report.counter_evidence.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">Presumption of innocence</span>
          </div>

          <div className="space-y-2.5">
            {report.counter_evidence.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/20 text-xs flex flex-col space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item.source}</span>
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200/80 leading-normal">
                  {item.data_point}
                </div>
                <div className="text-slate-700 text-xs leading-normal pt-0.5">{item.finding}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Recommendation Card */}
      <div className="p-5 bg-indigo-50/40 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Recommended Next Action for Teacher</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </h4>
            <p className="text-xs text-slate-800 mt-0.5 leading-relaxed font-medium">
              {report.recommended_action}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto flex-shrink-0">
          <button
            onClick={onOpenEvidenceModal}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View Raw Telemetry Diff</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          {!resolutionStatus ? (
            <button
              onClick={() =>
                setResolutionStatus(
                  report.concern_verdict.includes('Low Concern')
                    ? 'Flag Cleared with No Penalty'
                    : report.concern_verdict.includes('High Concern')
                    ? 'Referred to Academic Board'
                    : 'Scheduled for 5-Min Oral Check-in'
                )
              }
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer ${theme.actionTheme}`}
            >
              {report.concern_verdict.includes('Low Concern')
                ? 'Exonerate & Clear Flag'
                : report.concern_verdict.includes('High Concern')
                ? 'Issue Referral Notice'
                : 'Schedule Check-in'}
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{resolutionStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
