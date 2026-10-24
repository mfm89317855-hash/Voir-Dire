import React from 'react';
import { TraceStep } from '../types';
import {
  BrainCircuit,
  Clock,
  Copy,
  LayoutList,
  Laptop,
  Database,
  Scale,
  CheckCircle2,
  Loader2,
  GitCommit,
} from 'lucide-react';

interface InvestigationTraceProps {
  steps: TraceStep[];
  isInvestigating: boolean;
  isCompleted: boolean;
}

export const InvestigationTrace: React.FC<InvestigationTraceProps> = ({
  steps,
  isInvestigating,
  isCompleted,
}) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'brain-circuit':
        return <BrainCircuit className="w-3.5 h-3.5" />;
      case 'clock':
        return <Clock className="w-3.5 h-3.5" />;
      case 'copy':
        return <Copy className="w-3.5 h-3.5" />;
      case 'layout-list':
        return <LayoutList className="w-3.5 h-3.5" />;
      case 'laptop':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'database':
        return <Database className="w-3.5 h-3.5" />;
      case 'scale':
        return <Scale className="w-3.5 h-3.5" />;
      default:
        return <GitCommit className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Autonomous Investigation Trace
            </h4>
            <p className="text-[11px] text-slate-400">
              Agent sequentially queries and cross-checks 5 independent telemetry layers
            </p>
          </div>
        </div>

        <div>
          {isInvestigating && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
              <span>Correlating Telemetry...</span>
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Synthesis Finalized</span>
            </span>
          )}
          {!isInvestigating && !isCompleted && (
            <span className="text-xs text-slate-400 font-mono">
              Ready - Click &apos;Run Multi-Source Investigation&apos;
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isCurrentRunning = step.status === 'running';
          const isDone = step.status === 'completed';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isCurrentRunning
                  ? 'bg-indigo-50/60 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                  : isDone
                  ? 'bg-slate-50/60 border-slate-200'
                  : 'bg-white/40 border-slate-100 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] transition ${
                      isCurrentRunning
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isCurrentRunning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      getStepIcon(step.icon)
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs">{step.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2 font-mono">Step {idx + 1}/7</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                  {step.source}
                </span>
              </div>

              {step.snippet && (isDone || isCurrentRunning) && (
                <div className="mt-2 text-xs font-mono text-slate-600 pl-8.5 border-l-2 border-indigo-200 ml-3 py-0.5 leading-relaxed bg-white/70 rounded-r p-1.5">
                  <span className="text-indigo-600 font-semibold mr-1.5">&gt;</span>
                  {step.snippet}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
