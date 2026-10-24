import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Clock,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Search,
  Check,
  Eye,
  Maximize2,
  FileCode,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Course, CourseTopic, QuizExam, StudentQuizAttempt, QuizQuestion } from '../types';
import { COURSES_CATALOG, QUIZZES_CATALOG, INITIAL_STUDENT_ATTEMPTS } from '../mockData';
import { FaceDetectionCamera } from './FaceDetectionCamera';

interface StudentPortalProps {
  onInvestigateCase?: (caseId: string) => void;
  onOpenJoinModal?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onInvestigateCase,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'courses' | 'exam' | 'results' | 'history'>('overview');
  const [courses, setCourses] = useState<Course[]>(COURSES_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected course for syllabus modal
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizExam | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [timeLeftSec, setTimeLeftSec] = useState<number>(1200); // 20 mins default
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [violations, setViolations] = useState<{ tabSwitches: number; fullscreenExits: number; cameraViolations: number }>({
    tabSwitches: 0,
    fullscreenExits: 0,
    cameraViolations: 0,
  });
  const [showTabWarning, setShowTabWarning] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);

  // Completed Attempt for Results view
  const [lastAttempt, setLastAttempt] = useState<StudentQuizAttempt | null>(INITIAL_STUDENT_ATTEMPTS[0]);
  const [attemptsHistory, setAttemptsHistory] = useState<StudentQuizAttempt[]>(INITIAL_STUDENT_ATTEMPTS);

  // 6-digit Join Code input
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [joinCodeError, setJoinCodeError] = useState<string | null>(null);

  // Categories
  const categories = ['All', 'Computer Science', 'Artificial Intelligence', 'Cybersecurity', 'Mathematics', 'Software Engineering'];

  // Start exam by Quiz object
  const startExam = (quiz: QuizExam) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeftSec(quiz.timeLimitMin * 60);
    setViolations({ tabSwitches: 0, fullscreenExits: 0, cameraViolations: 0 });
    setIsExamRunning(true);
    setActiveSubTab('exam');
    setActiveCourseModal(null);

    // Request fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}
  };

  // Join quiz by 6-digit PIN
  const handleJoinByPin = (pin: string) => {
    setJoinCodeError(null);
    const trimmed = pin.trim();
    const foundQuiz = QUIZZES_CATALOG.find((q) => q.code === trimmed);

    if (foundQuiz) {
      startExam(foundQuiz);
    } else {
      setJoinCodeError(`Code "${trimmed}" not recognized. Try demo codes: 849201, 312904, or 551829`);
    }
  };

  // Timer loop
  useEffect(() => {
    if (!isExamRunning || timeLeftSec <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamRunning, timeLeftSec]);

  // Window Focus / Blur & Fullscreen violation detection
  useEffect(() => {
    if (!isExamRunning) return;

    const handleWindowBlur = () => {
      setViolations((v) => ({ ...v, tabSwitches: v.tabSwitches + 1 }));
      setShowTabWarning(true);
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setViolations((v) => ({ ...v, fullscreenExits: v.fullscreenExits + 1 }));
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isExamRunning]);

  // Handle Question Answer Selection
  const handleSelectAnswer = (qNum: number, answer: any) => {
    setUserAnswers((prev) => ({ ...prev, [qNum]: answer }));
  };

  // Final Submit
  const handleSubmitExam = (isAuto = false) => {
    if (!activeQuiz) return;
    setIsExamRunning(false);
    setShowSubmitConfirm(false);

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    // Calculate score
    let earned = 0;
    let total = 0;
    activeQuiz.questions.forEach((q) => {
      total += q.points;
      if (userAnswers[q.qNum] === q.correctAnswer) {
        earned += q.points;
      }
    });

    const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
    const passed = percentage >= activeQuiz.passingScore;
    const timeSpent = activeQuiz.timeLimitMin * 60 - timeLeftSec;

    const newAttempt: StudentQuizAttempt = {
      id: `att-${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      courseCode: activeQuiz.courseCode,
      studentId: 'usr-student-01',
      studentName: 'Alex Rivera',
      studentEmail: 'alex.rivera@stanford.edu',
      score: earned,
      totalPoints: total,
      percentage,
      passed,
      startTime: new Date(Date.now() - timeSpent * 1000).toLocaleTimeString(),
      timeTakenSec: timeSpent,
      submittedAt: new Date().toLocaleTimeString(),
      answers: userAnswers,
      violationsCount: violations,
      integrityStatus: violations.tabSwitches > 1 || violations.cameraViolations > 2 ? 'Flagged for Review' : 'Verified Clean',
    };

    setLastAttempt(newAttempt);
    setAttemptsHistory((prev) => [newAttempt, ...prev]);
    setActiveSubTab('results');
  };

  // Toggle Enroll
  const toggleEnroll = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, isEnrolled: !c.isEnrolled, enrolledCount: c.isEnrolled ? c.enrolledCount - 1 : c.enrolledCount + 1 }
          : c
      )
    );
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Student Learning Environment
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Student Assessment Portal
          </h1>
        </div>

        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeSubTab === 'overview' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeSubTab === 'courses' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Course Catalog
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeSubTab === 'history' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Quiz History ({attemptsHistory.length})
          </button>
          {lastAttempt && (
            <button
              onClick={() => setActiveSubTab('results')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeSubTab === 'results' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Latest Results
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* OVERVIEW TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'overview' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-200">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Exams Completed</span>
              <p className="font-display text-3xl font-extrabold text-white mt-2">
                {attemptsHistory.length}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                100% Passed
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Average Grade</span>
              <p className="font-display text-3xl font-extrabold text-emerald-400 mt-2">
                {Math.round(
                  attemptsHistory.reduce((acc, curr) => acc + curr.percentage, 0) /
                    Math.max(1, attemptsHistory.length)
                )}
                %
              </p>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
                Cohort Percentile: 94th
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Enrolled Courses</span>
              <p className="font-display text-3xl font-extrabold text-white mt-2">
                {courses.filter((c) => c.isEnrolled).length}
              </p>
              <span className="text-[11px] text-cyan-400 font-semibold mt-1 inline-block">
                Active Semesters
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Integrity Standing</span>
              <p className="font-display text-2xl font-extrabold text-emerald-400 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Verified</span>
              </p>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
                0 Unresolved Flags
              </span>
            </div>
          </div>

          {/* Quick PIN Entrance Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-glow-emerald flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                Direct Exam Access
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                Have a 6-digit Exam PIN from your instructor?
              </h3>
              <p className="text-xs text-slate-400 max-w-lg">
                Enter your code to instantly verify camera permissions and start taking your proctored assessment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              <input
                type="text"
                placeholder="e.g. 849201"
                maxLength={6}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full sm:w-36 px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-center font-mono font-bold text-base text-emerald-400 tracking-widest placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleJoinByPin(joinCodeInput)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Launch Exam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          {joinCodeError && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
              {joinCodeError}
            </p>
          )}

          {/* Enrolled Courses & Next Milestones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-white">Your Enrolled Courses</h3>
              <button
                onClick={() => setActiveSubTab('courses')}
                className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All Courses</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses
                .filter((c) => c.isEnrolled)
                .map((course) => (
                  <div
                    key={course.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono text-emerald-400 font-bold">{course.code}</span>
                        <span className="text-slate-400">{course.duration}</span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                          <span>Syllabus Progress</span>
                          <span className="text-emerald-400">{course.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {course.topics.length} Syllabus Modules
                      </span>
                      <button
                        onClick={() => setActiveCourseModal(course)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition cursor-pointer"
                      >
                        View Topics & Quizzes
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COURSES CATALOG TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'courses' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses, codes, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-emerald-400 font-bold">{course.code}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white mt-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                    <span>Instructor: <strong className="text-slate-200">{course.instructor}</strong></span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveCourseModal(course)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    Syllabus ({course.topics.length})
                  </button>

                  <button
                    onClick={() => toggleEnroll(course.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      course.isEnrolled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {course.isEnrolled ? 'Enrolled ✓' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QUIZ TAKING / PROCTORED EXAM ROOM */}
      {/* ======================================================== */}
      {activeSubTab === 'exam' && activeQuiz && (
        <div className="mt-6 space-y-6 animate-in fade-in duration-200">
          {/* Exam Header HUD */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {activeQuiz.courseCode} · Live Proctored Exam
              </span>
              <h2 className="font-display text-xl font-bold text-white">{activeQuiz.title}</h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Countdown Timer */}
              <div
                className={`px-4 py-2 rounded-xl border flex items-center space-x-2 font-mono text-lg font-black ${
                  timeLeftSec < 180
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-slate-950 border-emerald-500/40 text-emerald-400'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>
                  {Math.floor(timeLeftSec / 60)}:
                  {timeLeftSec % 60 < 10 ? `0${timeLeftSec % 60}` : timeLeftSec % 60}
                </span>
              </div>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                Finish & Submit
              </button>
            </div>
          </div>

          {/* Main Proctoring Area: Question Left, Sentinel Right */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Question Runner (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Question Navigation Pills */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
                {activeQuiz.questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.qNum] !== undefined;
                  const isCurrent = currentQIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`w-9 h-9 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                          : isAnswered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {q.qNum}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Card */}
              {activeQuiz.questions[currentQIndex] && (
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">
                      Question {activeQuiz.questions[currentQIndex].qNum} of{' '}
                      {activeQuiz.questions.length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {activeQuiz.questions[currentQIndex].points} Points ·{' '}
                      {activeQuiz.questions[currentQIndex].difficulty}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white leading-relaxed">
                    {activeQuiz.questions[currentQIndex].prompt}
                  </h3>

                  {/* Code snippet display if applicable */}
                  {activeQuiz.questions[currentQIndex].codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300/90 leading-relaxed">
                      <pre>{activeQuiz.questions[currentQIndex].codeSnippet}</pre>
                    </div>
                  )}

                  {/* Options selection */}
                  {activeQuiz.questions[currentQIndex].options && (
                    <div className="space-y-3 pt-2">
                      {activeQuiz.questions[currentQIndex].options?.map((opt, optIdx) => {
                        const isSelected =
                          userAnswers[activeQuiz.questions[currentQIndex].qNum] === opt;

                        return (
                          <button
                            key={optIdx}
                            onClick={() =>
                              handleSelectAnswer(activeQuiz.questions[currentQIndex].qNum, opt)
                            }
                            className={`w-full p-4 rounded-xl border text-left text-sm transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-glow-emerald font-semibold'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span>{opt}</span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                  : 'border-slate-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Question Bottom Navigation */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                      ← Previous
                    </button>

                    {currentQIndex < activeQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQIndex((i) => i + 1)}
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSubmitConfirm(true)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold transition cursor-pointer"
                      >
                        Review & Submit →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Proctoring Sentinel Column (1 col) */}
            <div className="space-y-4">
              <FaceDetectionCamera
                isExamActive={isExamRunning}
                onViolation={(type) => {
                  setViolations((v) => ({ ...v, cameraViolations: v.cameraViolations + 1 }));
                }}
              />

              {/* Proctoring HUD Summary */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Integrity Sentinel Stream
                </span>

                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Fullscreen Lock</span>
                    <span className="font-bold text-emerald-400">ENFORCED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tab Interceptions</span>
                    <span className={violations.tabSwitches > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {violations.tabSwitches} / {activeQuiz.proctoring.maxTabSwitches} Max
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Camera Alerts</span>
                    <span className={violations.cameraViolations > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {violations.cameraViolations}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                  Client-side neural sentinel actively monitoring gaze vectors.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RESULTS VIEW */}
      {/* ======================================================== */}
      {activeSubTab === 'results' && lastAttempt && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-200">
          {/* Header Score Banner */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-glow-emerald text-center max-w-2xl mx-auto space-y-4">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center font-display text-2xl font-black ${
                lastAttempt.passed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400 shadow-glow-emerald'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-400'
              }`}
            >
              {lastAttempt.percentage}%
            </div>

            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  lastAttempt.passed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {lastAttempt.passed ? 'PASSED BENCHMARK' : 'FAILED THRESHOLD'}
              </span>
              <h2 className="font-display text-2xl font-extrabold text-white mt-3">
                {lastAttempt.quizTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Completed on {lastAttempt.submittedAt} · Time: {Math.round(lastAttempt.timeTakenSec / 60)}m {lastAttempt.timeTakenSec % 60}s
              </p>
            </div>

            {/* Proctoring Verification Badge */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Integrity: {lastAttempt.integrityStatus}</span>
              </span>
              <span className="text-slate-400">
                Tab Switches: {lastAttempt.violationsCount.tabSwitches}
              </span>
              <span className="text-slate-400">
                Camera Alerts: {lastAttempt.violationsCount.cameraViolations}
              </span>
            </div>
          </div>

          {/* Breakdown Review of Questions */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="font-display text-xl font-bold text-white">Question Explanations & Review</h3>

            {/* Review active quiz questions if available */}
            {QUIZZES_CATALOG.find((q) => q.id === lastAttempt.quizId)?.questions.map((q) => {
              const studentAns = lastAttempt.answers[q.qNum];
              const isCorrect = studentAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border text-sm space-y-3 ${
                    isCorrect
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Question {q.qNum}</span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{isCorrect ? 'Correct (+20 pts)' : 'Incorrect (0 pts)'}</span>
                    </span>
                  </div>

                  <p className="font-medium text-white">{q.prompt}</p>

                  <div className="text-xs space-y-1.5 pt-1">
                    <p className="text-slate-400">
                      Your Answer:{' '}
                      <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                        {studentAns !== undefined ? String(studentAns) : 'Unanswered'}
                      </strong>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-400">
                        Correct Answer: <strong>{String(q.correctAnswer)}</strong>
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-emerald-400">Concept Explanation: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QUIZ HISTORY TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'history' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          <h3 className="font-display text-xl font-bold text-white">Your Historical Exam Record</h3>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Exam Title</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Integrity Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attemptsHistory.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{att.quizTitle}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{att.courseCode} · {att.submittedAt}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      <span className={att.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {Math.round(att.timeTakenSec / 60)} mins
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          att.integrityStatus === 'Verified Clean'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {att.integrityStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {att.evidenceStudentId && onInvestigateCase ? (
                        <button
                          onClick={() => onInvestigateCase(att.evidenceStudentId!)}
                          className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold hover:bg-indigo-500/30 transition cursor-pointer"
                        >
                          Investigate Case →
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setLastAttempt(att);
                            setActiveSubTab('results');
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                        >
                          View Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB SWITCH VIOLATION WARNING MODAL */}
      {/* ======================================================== */}
      {showTabWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/50 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="font-display text-xl font-bold text-white">
              Tab Switch Violation Detected
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You navigated away from the proctored exam window. This focus-switch event has been logged to your immutable forensic audit trail.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400">
              Total Violations: {violations.tabSwitches} / {activeQuiz?.proctoring.maxTabSwitches || 2}
            </div>

            <button
              onClick={() => setShowTabWarning(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              I Understand & Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBMIT CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {showSubmitConfirm && activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-display text-xl font-bold text-white">
              Confirm Final Exam Submission
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once submitted, your answers will be locked and automatically evaluated against the official benchmark key.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Questions Answered:</span>
                <span className="font-bold text-emerald-400">
                  {Object.keys(userAnswers).length} / {activeQuiz.questions.length}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Time Remaining:</span>
                <span className="font-mono text-slate-200">
                  {Math.floor(timeLeftSec / 60)}m {timeLeftSec % 60}s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Back to Questions
              </button>
              <button
                onClick={() => handleSubmitExam(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SYLLABUS / COURSE DETAIL MODAL */}
      {/* ======================================================== */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-emerald-400 font-bold text-xs">
                  {activeCourseModal.code} · {activeCourseModal.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  {activeCourseModal.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Instructor: {activeCourseModal.instructor} · {activeCourseModal.duration}
                </p>
              </div>

              <button
                onClick={() => setActiveCourseModal(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Topics breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Course Syllabus & Topic Exams
              </h4>

              {activeCourseModal.topics.map((topic, tIdx) => {
                const topicQuiz = QUIZZES_CATALOG.find((q) => q.topicId === topic.id);

                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center font-mono">
                          {tIdx + 1}
                        </span>
                        <h5 className="font-bold text-sm text-white">{topic.title}</h5>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 pl-7">{topic.summary}</p>
                    </div>

                    {topicQuiz ? (
                      <button
                        onClick={() => startExam(topicQuiz)}
                        className="self-end sm:self-center px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Exam</span>
                      </button>
                    ) : (
                      <span className="self-end sm:self-center text-[10px] text-slate-500 font-mono">
                        Coming soon
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
