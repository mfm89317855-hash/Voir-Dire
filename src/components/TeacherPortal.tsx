import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  Search,
  Filter,
  Check,
  Eye,
  Sliders,
  TrendingUp,
  BarChart3,
  Award,
} from 'lucide-react';
import { Course, QuizExam, QuizQuestion, StudentQuizAttempt } from '../types';
import { COURSES_CATALOG, QUIZZES_CATALOG, INITIAL_STUDENT_ATTEMPTS } from '../mockData';

interface TeacherPortalProps {
  onInvestigateCase?: (caseId: string) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onInvestigateCase }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'questions' | 'quizzes' | 'submissions' | 'analytics'>('overview');
  const [courses, setCourses] = useState<Course[]>(COURSES_CATALOG);
  const [quizzes, setQuizzes] = useState<QuizExam[]>(QUIZZES_CATALOG);
  const [submissions, setSubmissions] = useState<StudentQuizAttempt[]>(INITIAL_STUDENT_ATTEMPTS);

  // Modals
  const [showCreateCourseModal, setShowCreateCourseModal] = useState<boolean>(false);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState<boolean>(false);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState<boolean>(false);

  // Form states for new course
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Computer Science');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseMaxStudents, setNewCourseMaxStudents] = useState('150');

  // Form states for new question
  const [newQPrompt, setNewQPrompt] = useState('');
  const [newQCode, setNewQCode] = useState('');
  const [newQOption1, setNewQOption1] = useState('');
  const [newQOption2, setNewQOption2] = useState('');
  const [newQOption3, setNewQOption3] = useState('');
  const [newQOption4, setNewQOption4] = useState('');
  const [newQCorrectOpt, setNewQCorrectOpt] = useState(0);
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQDifficulty, setNewQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newQPoints, setNewQPoints] = useState(20);

  // Export CSV Handler
  const handleExportMarksCSV = () => {
    const headers = [
      'Student Name',
      'Student Email',
      'Course Code',
      'Quiz Title',
      'Score',
      'Total Points',
      'Percentage',
      'Passed',
      'Duration (sec)',
      'Tab Switches',
      'Camera Alerts',
      'Integrity Status',
      'Submission Time',
    ];

    const rows = submissions.map((s) => [
      `"${s.studentName}"`,
      `"${s.studentEmail}"`,
      `"${s.courseCode}"`,
      `"${s.quizTitle}"`,
      s.score,
      s.totalPoints,
      `${s.percentage}%`,
      s.passed ? 'TRUE' : 'FALSE',
      s.timeTakenSec,
      s.violationsCount.tabSwitches,
      s.violationsCount.cameraViolations,
      `"${s.integrityStatus}"`,
      `"${s.submittedAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `student_marks_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Course Action
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseCode) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newCourseTitle,
      code: newCourseCode.toUpperCase(),
      category: newCourseCategory,
      description: newCourseDescription || 'Comprehensive curriculum with proctored assessments.',
      instructor: 'Dr. Aris Thorne',
      duration: '10 weeks',
      totalLessons: 16,
      enrolledCount: 0,
      rating: 5.0,
      isEnrolled: true,
      progressPercent: 0,
      topics: [
        {
          id: `topic-${Date.now()}-1`,
          courseId: `course-${Date.now()}`,
          title: 'Foundational Theory & Architecture',
          duration: '45 mins',
          lessonsCount: 4,
          completed: false,
          summary: 'Introductory principles, structural invariants, and baseline complexity.',
        },
      ],
    };

    setCourses([newCourse, ...courses]);
    setShowCreateCourseModal(false);
    setNewCourseTitle('');
    setNewCourseCode('');
    setNewCourseDescription('');
  };

  // Create Question Action
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQPrompt || !newQOption1 || !newQOption2) return;

    const options = [newQOption1, newQOption2, newQOption3, newQOption4].filter(Boolean);
    const correctVal = options[newQCorrectOpt] || options[0];

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      qNum: 1,
      type: newQCode ? 'code' : 'mcq',
      prompt: newQPrompt,
      codeSnippet: newQCode || undefined,
      options,
      correctAnswer: correctVal,
      explanation: newQExplanation || 'Verified against canonical curriculum solutions.',
      points: Number(newQPoints),
      difficulty: newQDifficulty,
      tags: ['Custom Question Bank', newCourseCategory],
    };

    // Append to first quiz
    setQuizzes((prev) =>
      prev.map((q, idx) =>
        idx === 0
          ? {
              ...q,
              totalQuestions: q.totalQuestions + 1,
              questions: [...q.questions, { ...newQ, qNum: q.questions.length + 1 }],
            }
          : q
      )
    );

    setShowCreateQuestionModal(false);
    setNewQPrompt('');
    setNewQCode('');
    setNewQOption1('');
    setNewQOption2('');
    setNewQOption3('');
    setNewQOption4('');
    setNewQExplanation('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Faculty Teaching & Proctoring Suite
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Teacher Assessment Studio
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportMarksCSV}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold transition cursor-pointer"
            title="Download CSV spreadsheet of all student grades and proctoring telemetry"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Marks CSV</span>
          </button>

          <button
            onClick={() => setShowCreateCourseModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Course</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800/80 pt-4 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'courses'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'quizzes'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Active Quizzes & PINs ({quizzes.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'submissions'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Student Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'questions'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Question Bank
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Cohort Analytics
        </button>
      </div>

      {/* ======================================================== */}
      {/* OVERVIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-200">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Courses</span>
              <p className="font-display text-3xl font-extrabold text-white mt-2">
                {courses.length}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                All Active
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Examinees</span>
              <p className="font-display text-3xl font-extrabold text-white mt-2">1,420</p>
              <span className="text-[11px] text-cyan-400 font-semibold mt-1 inline-block">
                Across 5 Departments
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Class Average Score</span>
              <p className="font-display text-3xl font-extrabold text-emerald-400 mt-2">78.4%</p>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
                +4.2% vs Prior Semester
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Flags Under Audit</span>
              <p className="font-display text-3xl font-extrabold text-amber-400 mt-2">2</p>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
                Evidence Synthesis Ready
              </span>
            </div>
          </div>

          {/* Recent Student Submissions Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-white">Recent Student Submissions</h3>
              <button
                onClick={() => setActiveTab('submissions')}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                View All Submissions →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Violations</th>
                    <th className="py-3 px-4">Integrity Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{sub.studentName}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{sub.studentEmail}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{sub.quizTitle}</td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={sub.passed ? 'text-emerald-400' : 'text-rose-400'}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {Math.round(sub.timeTakenSec / 60)}m
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {sub.violationsCount.tabSwitches + sub.violationsCount.cameraViolations > 0 ? (
                          <span className="text-amber-400 font-bold">
                            {sub.violationsCount.tabSwitches} tabs, {sub.violationsCount.cameraViolations} camera
                          </span>
                        ) : (
                          <span className="text-emerald-400">0 clean</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.integrityStatus === 'Verified Clean'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {sub.integrityStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {sub.evidenceStudentId && onInvestigateCase ? (
                          <button
                            onClick={() => onInvestigateCase(sub.evidenceStudentId!)}
                            className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold hover:bg-indigo-500/30 transition cursor-pointer"
                          >
                            Investigate with AI →
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COURSES TAB */}
      {/* ======================================================== */}
      {activeTab === 'courses' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-white">Course Curriculum & Syllabus</h3>
            <button
              onClick={() => setShowCreateCourseModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition space-y-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">{course.code}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {course.category}
                  </span>
                </div>

                <h4 className="font-display text-xl font-bold text-white">{course.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{course.description}</p>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Enrolled Examinees:</span>
                    <span className="text-white font-mono">{course.enrolledCount} Students</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Syllabus Modules:</span>
                    <span className="text-white font-mono">{course.topics.length} Topics</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-medium">Instructor: {course.instructor}</span>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    Manage Exams →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QUIZZES & ACCESS PINS TAB */}
      {/* ======================================================== */}
      {activeTab === 'quizzes' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Active Proctoring Quizzes & Access PINs</h3>
              <p className="text-xs text-slate-400 mt-1">
                Provide these 6-digit codes to students for instant access to locked exam sessions.
              </p>
            </div>
            <button
              onClick={() => setShowCreateQuestionModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question Bank Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    {quiz.courseCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-white">{quiz.title}</h4>

                {/* 6-Digit PIN Showcase */}
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Student Join PIN:</span>
                  <span className="font-mono font-black text-lg text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-0.5 rounded-lg border border-emerald-500/20">
                    {quiz.code}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-mono text-slate-200">{quiz.questions.length} Items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-mono text-slate-200">{quiz.timeLimitMin} Minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass Benchmark:</span>
                    <span className="font-mono text-slate-200">{quiz.passingScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proctoring Mode:</span>
                    <span className="font-bold text-emerald-400">Strict Sentinel HUD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBMISSIONS TAB */}
      {/* ======================================================== */}
      {activeTab === 'submissions' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-white">Full Cohort Exam Submissions</h3>
            <button
              onClick={handleExportMarksCSV}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Spreadsheet</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Telemetry Logs</th>
                  <th className="py-3 px-4">Integrity Verdict</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{sub.studentName}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{sub.studentEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{sub.courseCode}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      <span className={sub.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {Math.round(sub.timeTakenSec / 60)} mins
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300">
                        {sub.violationsCount.tabSwitches} tabs · {sub.violationsCount.cameraViolations} camera alerts
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.integrityStatus === 'Verified Clean'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {sub.integrityStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {sub.evidenceStudentId && onInvestigateCase ? (
                        <button
                          onClick={() => onInvestigateCase(sub.evidenceStudentId!)}
                          className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold hover:bg-indigo-500/30 transition cursor-pointer"
                        >
                          Forensic AI →
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Normal</span>
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
      {/* QUESTION BANK TAB */}
      {/* ======================================================== */}
      {activeTab === 'questions' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-white">Faculty Question Bank & Rubrics</h3>
            <button
              onClick={() => setShowCreateQuestionModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {quizzes.flatMap((q) => q.questions).map((q, idx) => (
              <div
                key={q.id + idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 font-mono">
                    Item #{idx + 1} · {q.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {q.points} Pts
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                <p className="font-medium text-white text-sm">{q.prompt}</p>

                {q.codeSnippet && (
                  <pre className="p-3 rounded-xl bg-slate-950 text-xs font-mono text-emerald-300 border border-slate-800/80">
                    {q.codeSnippet}
                  </pre>
                )}

                <div className="text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">Answer: </span>
                  {String(q.correctAnswer)}
                </div>

                <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">Rubric Note: </strong>
                  {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COHORT ANALYTICS TAB */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-200">
          <h3 className="font-display text-xl font-bold text-white">Cohort Grade Distribution & Difficulty Index</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="font-display text-base font-bold text-white">Grade Brackets</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>90% - 100% (A Range)</span>
                    <span className="font-bold text-emerald-400">42% (596 students)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>80% - 89% (B Range)</span>
                    <span className="font-bold text-cyan-400">35% (497 students)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>70% - 79% (Passing)</span>
                    <span className="font-bold text-amber-400">18% (255 students)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Below 70% (Remediation)</span>
                    <span className="font-bold text-rose-400">5% (72 students)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="font-display text-base font-bold text-white">Question Difficulty Insights</h4>
              <p className="text-xs text-slate-400">
                Automated statistical anomaly detection across student solve times and error rates:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400">Q3 (BST Depth Recursion):</span> Solved cleanly by 89% of cohort with organic typing velocity.
                </li>
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-400">Q4 (Min-Stack O(1) Proof):</span> 34% of students confused standard queue with auxiliary stack. Recommend topic review.
                </li>
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-rose-400">Q7 (External Leak Alert):</span> Extreme velocity cluster detected on Marcus Vance & Elena Rostova. Correlated with CourseHero leak.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE COURSE MODAL */}
      {/* ======================================================== */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">Create New Course</h3>
              <button
                onClick={() => setShowCreateCourseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems & Cloud Security"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-450"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>Computer Science</option>
                    <option>Artificial Intelligence</option>
                    <option>Cybersecurity</option>
                    <option>Mathematics</option>
                    <option>Software Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summarize course outcomes and proctored grading rubrics..."
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE QUESTION MODAL */}
      {/* ======================================================== */}
      {showCreateQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">Add Question to Bank</h3>
              <button
                onClick={() => setShowCreateQuestionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  required
                  placeholder="State the problem clearly..."
                  value={newQPrompt}
                  onChange={(e) => setNewQPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="def solution(): ..."
                  value={newQCode}
                  onChange={(e) => setNewQCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Options (Select Correct)</label>
                {[newQOption1, newQOption2, newQOption3, newQOption4].map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={newQCorrectOpt === idx}
                      onChange={() => setNewQCorrectOpt(idx)}
                      className="accent-emerald-500 cursor-pointer"
                    />
                    <input
                      type="text"
                      required={idx < 2}
                      placeholder={`Option ${idx + 1}`}
                      value={
                        idx === 0
                          ? newQOption1
                          : idx === 1
                          ? newQOption2
                          : idx === 2
                          ? newQOption3
                          : newQOption4
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (idx === 0) setNewQOption1(val);
                        if (idx === 1) setNewQOption2(val);
                        if (idx === 2) setNewQOption3(val);
                        if (idx === 3) setNewQOption4(val);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Concept Explanation</label>
                <textarea
                  rows={2}
                  placeholder="Explain why the answer is correct for student review..."
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateQuestionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
