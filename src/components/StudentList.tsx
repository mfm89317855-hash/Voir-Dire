import React, { useState } from 'react';
import { StudentAttempt, Quiz } from '../types';
import { AlertTriangle, Users, Search, Sparkles } from 'lucide-react';

interface StudentListProps {
  students: StudentAttempt[];
  quizzes: Record<string, Quiz>;
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  isInvestigating: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  quizzes,
  selectedStudentId,
  onSelectStudent,
  isInvestigating,
}) => {
  const [filterMode, setFilterMode] = useState<'flagged' | 'all'>('flagged');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const flaggedCount = students.filter((s) => s.status === 'flagged').length;

  const filteredStudents = students.filter((student) => {
    if (filterMode === 'flagged' && student.status !== 'flagged') return false;
    if (selectedCourse !== 'all' && student.quizId !== selectedCourse) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const quiz = quizzes[student.quizId];
      const matchName = student.name.toLowerCase().includes(q);
      const matchQuiz = quiz?.title.toLowerCase().includes(q);
      const matchCase = student.isPlant && `case ${student.isPlant.toLowerCase()}`.includes(q);
      if (!matchName && !matchQuiz && !matchCase) return false;
    }
    return true;
  });

  return (
    <div className="w-full lg:w-96 flex-shrink-0 flex flex-col space-y-3.5">
      {/* Roster Summary Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium">Class Cohort Monitored</p>
          <p className="text-xl font-bold text-slate-900 tracking-tight">
            30 Students <span className="text-xs font-normal text-slate-400">across 3 Quizzes</span>
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {flaggedCount} Flagged Attempts
          </span>
        </div>
      </div>

      {/* Primary Flagged vs All Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-medium bg-white rounded-t-xl px-2 pt-2 border-t border-x border-slate-200">
        <button
          onClick={() => setFilterMode('flagged')}
          className={`pb-2.5 px-3 flex items-center space-x-1.5 transition font-semibold cursor-pointer border-b-2 ${
            filterMode === 'flagged'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 hover:text-slate-800 border-transparent'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Flagged Cases ({flaggedCount})</span>
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`pb-2.5 px-3 flex items-center space-x-1.5 transition font-semibold cursor-pointer border-b-2 ${
            filterMode === 'all'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 hover:text-slate-800 border-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>All Submissions ({students.length})</span>
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white p-3 rounded-b-xl border border-slate-200 shadow-xs space-y-2.5 -mt-3.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, quiz, or 'Case A'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCourse('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
              selectedCourse === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setSelectedCourse('Q1')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
              selectedCourse === 'Q1'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            CS101 (Data Structures)
          </button>
          <button
            onClick={() => setSelectedCourse('Q2')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
              selectedCourse === 'Q2'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            MATH204 (Proofs)
          </button>
          <button
            onClick={() => setSelectedCourse('Q3')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
              selectedCourse === 'Q3'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            BIO110 (Genetics)
          </button>
        </div>
      </div>

      {/* Student List Scroll Container */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
            No students match your filter criteria.
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSelected = student.id === selectedStudentId;
            const quiz = quizzes[student.quizId];

            let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
            let badgeText = 'Normal';
            let borderClass = isSelected
              ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300';

            if (student.status === 'flagged') {
              if (student.isPlant === 'A') {
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                badgeText = 'Severe Velocity & Similarity';
              } else if (student.isPlant === 'B') {
                badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                badgeText = 'Speed Outlier (Potential FP)';
              } else if (student.isPlant === 'C') {
                badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                badgeText = 'Disconnection / Drift';
              }
            }

            return (
              <div
                key={student.id}
                onClick={() => !isInvestigating && onSelectStudent(student.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${borderClass} ${
                  isInvestigating ? 'opacity-80 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{student.name}</span>
                    {student.isPlant && (
                      <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-600 inline" />
                        <span>Case {student.isPlant}</span>
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>

                <div className="text-xs text-slate-500 mb-2 truncate font-medium">
                  {quiz?.title || student.quizId}
                </div>

                {student.flagTrigger && (
                  <div className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded border border-amber-100 mb-2 leading-tight">
                    <span className="font-semibold">Flag:</span> {student.flagTrigger}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                  <span>
                    Score: <b className="text-slate-800">{student.score}%</b>
                  </span>
                  <span>
                    Duration: <b className="text-slate-800">{student.timeTakenMin}m</b> / {quiz?.timeLimitMin}m
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
