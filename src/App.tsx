import { useState } from 'react';
import { STUDENTS_DATA, QUIZZES, QUIZZES_CATALOG } from './mockData';
import { StudentAttempt, TraceStep, CaseReport, UserRole, QuizExam } from './types';
import { Header, COOL_NAMES, CoolNameOption, NavigationTab } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { JoinCodeModal } from './components/JoinCodeModal';
import { StudentList } from './components/StudentList';
import { InvestigationTrace } from './components/InvestigationTrace';
import { CaseReportCard } from './components/CaseReportCard';
import { RawEvidenceModal } from './components/RawEvidenceModal';
import { PitchGuideModal } from './components/PitchGuideModal';
import {
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Clock,
  Layers,
  FileCode,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

const INITIAL_STEPS: TraceStep[] = [
  {
    id: 'step_plan',
    name: 'Formulating Investigation Hypothesis & Scope',
    icon: 'brain-circuit',
    source: 'Agent Core',
    status: 'pending',
  },
  {
    id: 'step_timing',
    name: 'Source 1: Question Timing & Keystroke Dynamics',
    icon: 'clock',
    source: 'Telemetry Stream',
    status: 'pending',
  },
  {
    id: 'step_similarity',
    name: 'Source 2: Cohort Lexical & Code Vector Similarity',
    icon: 'copy',
    source: 'Vector Index',
    status: 'pending',
  },
  {
    id: 'step_session',
    name: 'Source 3: Tab & Focus-Switch Event Daemon Logs',
    icon: 'layout-list',
    source: 'Browser Daemon',
    status: 'pending',
  },
  {
    id: 'step_device',
    name: 'Source 4: Subnet IP, Hardware & Student Historical Baseline',
    icon: 'laptop',
    source: 'Identity & SIS',
    status: 'pending',
  },
  {
    id: 'step_bank',
    name: 'Source 5: Question Bank Leak Health & Faculty Registry',
    icon: 'database',
    source: 'Faculty Registry',
    status: 'pending',
  },
  {
    id: 'step_synthesis',
    name: 'Cross-Source Synthesis & Mitigating Reason Formulation',
    icon: 'scale',
    source: 'Reasoning Engine',
    status: 'pending',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<CoolNameOption>(COOL_NAMES[0]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('case-a');
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [steps, setSteps] = useState<TraceStep[]>(INITIAL_STEPS);
  const [report, setReport] = useState<CaseReport | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [showPitchGuide, setShowPitchGuide] = useState<boolean>(false);

  const selectedStudent: StudentAttempt =
    STUDENTS_DATA.find((s) => s.id === selectedStudentId) || STUDENTS_DATA[0];
  const selectedQuiz = QUIZZES[selectedStudent.quizId];

  const handleSelectStudent = (id: string) => {
    if (isInvestigating) return;
    setSelectedStudentId(id);
    setSteps(INITIAL_STEPS);
    setReport(null);
  };

  // Switch to forensic investigator with specific student pre-loaded
  const handleInvestigateCase = (caseId: string) => {
    setSelectedStudentId(caseId);
    setSteps(INITIAL_STEPS);
    setReport(null);
    setActiveTab('investigator');
  };

  const getStepTelemetrySnippet = (student: StudentAttempt, stepId: string) => {
    const ds = student.dataSources;
    switch (stepId) {
      case 'step_plan':
        return `Formulating investigation vector for trigger '${student.flagTrigger || 'Routine submission audit'}'. Hypothesis: Evaluate if velocity spike represents illicit assistance or verified high competence.`;
      case 'step_timing':
        return `Elapsed: ${student.timeTakenMin}m (${ds.timing.totalSeconds}s total). Keystroke metric: "${ds.timing.keyKeystrokeMetric}"`;
      case 'step_similarity':
        return `Cohort comparison: ${ds.similarity.cohortComparison}. Identified match: "${ds.similarity.verbatimPhrases}"`;
      case 'step_session':
        return `Session telemetry: ${ds.sessionEvents.totalTabSwitches} tab blurs (${ds.sessionEvents.totalTimeBlurredSec}s blurred). Chronological events logged: ${ds.sessionEvents.eventLog.length}.`;
      case 'step_device':
        return `Network Gateway: ${ds.deviceAndHistory.ipAddress}. SIS Cumulative GPA: ${ds.deviceAndHistory.historicalGPA}. Pacing baseline: "${ds.deviceAndHistory.historicalPacing}"`;
      case 'step_bank':
        return `Leak status: "${ds.questionBankNotes.leakStatus}". Faculty note: "${ds.questionBankNotes.facultyNote}"`;
      case 'step_synthesis':
        return `Synthesizing all 5 telemetry dimensions. Weighing suspicious correlation against mitigating baseline factors.`;
      default:
        return 'Telemetry inspected.';
    }
  };

  const runInvestigation = async () => {
    if (isInvestigating) return;
    setIsInvestigating(true);
    setReport(null);

    // Reset steps to pending
    const currentSteps: TraceStep[] = INITIAL_STEPS.map((s) => ({
      ...s,
      status: 'pending',
      snippet: undefined,
    }));
    setSteps([...currentSteps]);

    // Sequential step-by-step query simulation
    for (let i = 0; i < currentSteps.length; i++) {
      currentSteps[i] = {
        ...currentSteps[i],
        status: 'running',
        snippet: getStepTelemetrySnippet(selectedStudent, currentSteps[i].id),
      };
      setSteps([...currentSteps]);

      await new Promise((resolve) => setTimeout(resolve, 520));

      currentSteps[i] = {
        ...currentSteps[i],
        status: 'completed',
      };
      setSteps([...currentSteps]);
    }

    // Call backend API /api/investigate or fallback
    try {
      const response = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: selectedStudent,
          quiz: selectedQuiz,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.report) {
          setReport(data.report);
          setIsInvestigating(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API route call error; generating client-side report fallback:', err);
    }

    // Client-side fallback report
    const fallback = generateClientReport(selectedStudent);
    setReport(fallback);
    setIsInvestigating(false);
  };

  const generateClientReport = (student: StudentAttempt): CaseReport => {
    if (student.isPlant === 'A') {
      return {
        summary:
          'Marcus Vance was flagged due to an unnatural 19s and 24s completion speed on complex algorithmic proofs (Q7 & Q9) paired with instantaneous multi-line clipboard pastes. Cross-referencing telemetry across data sources confirms that his code has a 98.7% identical match with peer Elena Rostova (including a shared variable typo `min_pivott_val`), submitted from an identical gateway IP address 4 minutes apart.',
        confidence_level: 'High',
        concern_verdict: 'High Concern (Substantiated)',
        evidence_for: [
          {
            source: 'Timing & Keystroke Telemetry',
            data_point: '19s on Q7, 24s on Q9 (class avg: 490s & 540s); 300+ chars pasted in <200ms',
            finding:
              'Impossible manual composition speed; complete algorithmic solutions injected instantaneously without organic drafting.',
          },
          {
            source: 'Cohort Vector Similarity',
            data_point: '98.7% verbatim overlap with peer Elena Rostova',
            finding:
              'Shared idiosyncratic variable naming (`min_pivott_val`) and custom helper routine not taught in syllabus.',
          },
          {
            source: 'Device & Network Correlation',
            data_point: 'Co-located IP: 198.51.100.42 shared with Elena Rostova',
            finding:
              'Both students executed the exam on the same local physical network with a 4-minute submission lag.',
          },
          {
            source: 'Question Bank Health',
            data_point: 'Q7 & Q9 confirmed leaked on CourseHero repository 48h prior',
            finding:
              'The exact two questions completed anomalously fast match leaked external answer keys.',
          },
        ],
        counter_evidence: [
          {
            source: 'Pacing Baseline',
            data_point: 'Normal timing on Questions 1 through 4 (62-180 seconds)',
            finding:
              'The initial portion of the exam displays standard baseline pacing before the sudden anomaly on Q7.',
          },
        ],
        recommended_action:
          'Initiate formal academic integrity review. Interview Marcus and Elena together regarding shared network session and identical source code.',
      };
    } else if (student.isPlant === 'B') {
      return {
        summary:
          'Amina Chen was flagged automatically by a naive heuristic due to finishing in 14 minutes (vs. 45-minute limit). However, multi-source investigation refutes cheating: Amina has a 3.98 GPA, is a Putnam math competitor, maintained 100% active window focus with zero tab switches, typed at an organic 88 WPM with step-by-step scratchpad proofs, and has zero peer code overlap.',
        confidence_level: 'High',
        concern_verdict: 'Low Concern (False Positive)',
        evidence_for: [
          {
            source: 'Pacing Metric',
            data_point: '14 minutes total elapsed time (3.2x faster than cohort average)',
            finding: 'Triggered standard automated outlier threshold for swift completion.',
          },
        ],
        counter_evidence: [
          {
            source: 'Keystroke & Scratchpad Dynamics',
            data_point:
              '88 WPM continuous typing flow with 14 organic backspaces and integrated scratchpad proofs',
            finding:
              'Reflects genuine real-time intellectual derivation rather than copying or external injection.',
          },
          {
            source: 'Session & Focus Events',
            data_point: '0 tab switches, 0 seconds blurred, continuous fullscreen lock',
            finding:
              'Zero interaction with external software or secondary browser windows throughout entire session.',
          },
          {
            source: 'Student SIS Baseline',
            data_point: '3.98 cumulative GPA, past exam averages of 100%, 96%, 99%',
            finding:
              'Pacing and flawless accuracy are completely concordant with established four-semester academic history.',
          },
          {
            source: 'Cohort Similarity Index',
            data_point: '0% peer overlap; matches standard Gallian/Strang canonical textbook proofs',
            finding:
              'Answers represent classic mathematical rigor, not collusion or illicit answer repositories.',
          },
        ],
        recommended_action:
          'Clear flag immediately with no student penalty. Mark as an unproblematic false positive caused by exceptional student proficiency.',
      };
    } else if (student.isPlant === 'C') {
      return {
        summary:
          'Jordan Miller was flagged for an idle gap and lexical similarity on Question 6 following a window blur. Cross-source correlation reveals the blur coincided with campus library Wi-Fi DHCP drops and packet loss. While the essay phrasing matches open scientific definitions, it also matches standard biology textbooks. Evidence is ambiguous and does not justify an accusation.',
        confidence_level: 'Low',
        concern_verdict: 'Inconclusive / Mixed Evidence',
        evidence_for: [
          {
            source: 'Session Telemetry',
            data_point: '90s window blur at 02:20 PM followed by rapid prose typing',
            finding:
              'Student left active browser view for 1.5 minutes prior to completing the complex essay section.',
          },
          {
            source: 'Similarity Engine',
            data_point:
              '62% lexical overlap with online open-access Nature Education summary',
            finding:
              'Specific phrasing describing homology-directed repair mirrors online educational material.',
          },
        ],
        counter_evidence: [
          {
            source: 'Campus Network Infrastructure',
            data_point:
              'Library West Wing Wi-Fi router recorded 68% packet loss and DHCP re-auth at 02:18 PM',
            finding:
              'The window blur is corroborated by a documented physical network drop, consistent with reconnecting Wi-Fi.',
          },
          {
            source: 'Historical Performance',
            data_point:
              "83% test score is consistent with student's historical 3.10 GPA and 78-82% quiz trajectory",
            finding: 'No uncharacteristic performance leap; score aligns closely with prior unflagged work.',
          },
          {
            source: 'Keystroke Cadence',
            data_point:
              'Organic typing cadence of 45 WPM with backspaces, not a sudden paste event',
            finding: 'Text was typed manually rather than copied directly from external clipboard.',
          },
        ],
        recommended_action:
          'Do not issue an academic penalty. Conduct an informal 5-minute verbal check-in to ask the student to explain the Q6 repair mechanism verbally.',
      };
    }

    return {
      summary: `${student.name}'s attempt exhibits standard pacing, expected error corrections, and healthy keystroke variation. No cross-student code matches or illicit network signatures were detected.`,
      confidence_level: 'High',
      concern_verdict: 'Low Concern (False Positive)',
      evidence_for: [
        {
          source: 'Pacing',
          data_point: `${student.timeTakenMin}m duration`,
          finding: 'Within normal bell-curve distribution.',
        },
      ],
      counter_evidence: [
        {
          source: 'Session Logs',
          data_point: 'Clean session telemetry',
          finding: 'No anomalous tab switching or focus loss.',
        },
        {
          source: 'Similarity Index',
          data_point: '< 35% lexical overlap',
          finding: 'Completely standard cohort dispersion.',
        },
      ],
      recommended_action: 'No action necessary. Maintain regular grade recording.',
    };
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Universal Header with Navigation & Role Switcher */}
      <Header
        currentName={currentName}
        onSelectName={setCurrentName}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        onQuickJoinCode={() => setShowJoinModal(true)}
        onOpenPitchGuide={() => setShowPitchGuide(true)}
        onOpenEvidenceModal={() => setShowEvidenceModal(true)}
        hasSelectedStudent={Boolean(selectedStudent)}
        notificationsCount={2}
      />

      {/* ======================================================== */}
      {/* LANDING PAGE VIEW */}
      {/* ======================================================== */}
      {activeTab === 'landing' && (
        <LandingPage
          onStartTrial={() => {
            setCurrentRole('student');
            setActiveTab('student');
          }}
          onEnterJoinCode={() => setShowJoinModal(true)}
          onExploreTeacher={() => {
            setCurrentRole('teacher');
            setActiveTab('teacher');
          }}
          onExploreInvestigator={() => setActiveTab('investigator')}
        />
      )}

      {/* ======================================================== */}
      {/* STUDENT PORTAL VIEW */}
      {/* ======================================================== */}
      {activeTab === 'student' && (
        <StudentPortal
          onInvestigateCase={handleInvestigateCase}
          onOpenJoinModal={() => setShowJoinModal(true)}
        />
      )}

      {/* ======================================================== */}
      {/* TEACHER STUDIO VIEW */}
      {/* ======================================================== */}
      {activeTab === 'teacher' && (
        <TeacherPortal onInvestigateCase={handleInvestigateCase} />
      )}

      {/* ======================================================== */}
      {/* ADMIN & AUDIT VIEW */}
      {/* ======================================================== */}
      {activeTab === 'admin' && (
        <AdminPortal onInvestigateCase={handleInvestigateCase} />
      )}

      {/* ======================================================== */}
      {/* DEEP FORENSIC INVESTIGATOR VIEW */}
      {/* ======================================================== */}
      {activeTab === 'investigator' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-200">
          {/* Left Column: Student List */}
          <StudentList
            students={STUDENTS_DATA}
            quizzes={QUIZZES}
            selectedStudentId={selectedStudentId}
            onSelectStudent={handleSelectStudent}
            isInvestigating={isInvestigating}
          />

          {/* Right Column: Case Investigation & Trace */}
          <section className="flex-1 flex flex-col space-y-5 min-w-0">
            {/* Selected Case Header Card */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {selectedStudent.name}
                    </h2>
                    {selectedStudent.isPlant === 'A' && (
                      <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-rose-500/30">
                        Planted Case A: Concordant Collusion
                      </span>
                    )}
                    {selectedStudent.isPlant === 'B' && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                        Planted Case B: False Positive (Fairness Demo)
                      </span>
                    )}
                    {selectedStudent.isPlant === 'C' && (
                      <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-500/30">
                        Planted Case C: Ambiguous / Low Confidence
                      </span>
                    )}
                    {!selectedStudent.isPlant && (
                      <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        Cohort Submission
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedQuiz?.title} • Time Limit: {selectedQuiz?.timeLimitMin}m • Class Avg:{' '}
                    {selectedQuiz?.avgClassScore}%
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                  <div className="px-1.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Score
                    </span>
                    <span className="text-base font-bold text-white">{selectedStudent.score}%</span>
                  </div>
                  <div className="w-px h-6 bg-slate-800"></div>
                  <div className="px-1.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Duration
                    </span>
                    <span className="text-base font-bold text-white">
                      {selectedStudent.timeTakenMin}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Heuristic Trigger Banner */}
              <div className="mt-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl p-3 text-xs flex items-start space-x-2.5 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Initial Heuristic Flag: </span>
                  <span>
                    {selectedStudent.flagTrigger ||
                      'Nominal attempt. No heuristic violations detected within 1.5 standard deviations.'}
                  </span>
                </div>
              </div>

              {/* 5 Data Source Badges Peek */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400 inline" />
                  <span>5 Telemetry Feeds Available:</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  1. Timing ({selectedStudent.dataSources.timing.totalSeconds}s)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  2. Overlap Index ({selectedStudent.dataSources.similarity.cohortComparison.slice(0, 24)}...)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  3. Focus Log ({selectedStudent.dataSources.sessionEvents.totalTabSwitches} blurs)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  4. Identity/IP ({selectedStudent.dataSources.deviceAndHistory.historicalGPA} GPA)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  5. Question Bank Registry
                </span>
              </div>
            </div>

            {/* Action Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-emerald-500/20 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {currentName.name} Correlator (Gemini 3.8 Flash)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    Plans hypothesis, sequentially gathers receipts across 5 feeds, and weighs both sides.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEvidenceModal(true)}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Inspect Raw Telemetry</span>
                  <span className="sm:hidden">Raw Data</span>
                </button>

                <button
                  onClick={runInvestigation}
                  disabled={isInvestigating}
                  className={`px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer active:scale-98 ${
                    isInvestigating ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isInvestigating ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Investigating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Multi-Source Investigation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Autonomous Investigation Trace */}
            <InvestigationTrace
              steps={steps}
              isInvestigating={isInvestigating}
              isCompleted={Boolean(report)}
            />

            {/* Formatted Case Report Card */}
            {report && (
              <CaseReportCard
                report={report}
                student={selectedStudent}
                onOpenEvidenceModal={() => setShowEvidenceModal(true)}
              />
            )}

            {!report && !isInvestigating && (
              <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/40 p-6 text-xs text-slate-400">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                Click <strong>&quot;Run Multi-Source Investigation&quot;</strong> above to watch the agent formulate a hypothesis, query the 5 data sources sequentially, and compile an evidence-backed case report.
              </div>
            )}
          </section>
        </main>
      )}

      {/* 6-Digit Join Code Modal */}
      <JoinCodeModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinSuccess={(quiz: QuizExam) => {
          setCurrentRole('student');
          setActiveTab('student');
        }}
      />

      {/* Raw Evidence Modal */}
      {showEvidenceModal && (
        <RawEvidenceModal
          student={selectedStudent}
          onClose={() => setShowEvidenceModal(false)}
        />
      )}

      {/* Pitch Guide Modal */}
      {showPitchGuide && (
        <PitchGuideModal onClose={() => setShowPitchGuide(false)} />
      )}
    </div>
  );
}
