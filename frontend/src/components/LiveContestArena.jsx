import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Cpu, 
  Database, 
  Layers, 
  Network, 
  Cloud,
  Code2,
  Sparkles,
  ChevronRight,
  Send,
  RotateCcw
} from 'lucide-react';

const SUBJECT_COLORS = {
  FSD: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', icon: Layers },
  DSA: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: Cpu },
  DBMS: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: Database },
  CN: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: Network },
  CC: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: Cloud }
};

export default function LiveContestArena() {
  const { activeContest, currentUser, liveEvaluation, setLiveEvaluation } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Set initial problem
  useEffect(() => {
    if (activeContest && activeContest.problems && activeContest.problems.length > 0 && !selectedProblem) {
      setSelectedProblem(activeContest.problems[0]);
      setCode(activeContest.problems[0].starterCode || '');
    }
  }, [activeContest]);

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode || '');
    setSubmissionResult(null);
  };

  const filteredProblems = activeContest?.problems?.filter((p) => {
    if (selectedSubject === 'ALL') return true;
    return p.subject === selectedSubject;
  }) || [];

  const handleSubmit = async () => {
    if (!selectedProblem || !currentUser) return;
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contestId: activeContest.id,
          problemId: selectedProblem.id,
          userId: currentUser.id,
          userName: currentUser.name,
          userBatch: currentUser.batch,
          userSection: currentUser.section,
          code,
          language
        })
      });

      const data = await res.json();
      // Set local waiting status
      setSubmissionResult({
        status: 'PENDING',
        message: 'Queued in Async Evaluation Pipeline...'
      });
    } catch (err) {
      console.error('Submission failed', err);
      setIsSubmitting(false);
    }
  };

  // Sync with live evaluation results via WebSocket
  useEffect(() => {
    if (liveEvaluation && selectedProblem && liveEvaluation.problemTitle === selectedProblem.title) {
      setSubmissionResult(liveEvaluation);
      if (liveEvaluation.status === 'COMPLETED') {
        setIsSubmitting(false);
      }
    }
  }, [liveEvaluation, selectedProblem]);

  if (!activeContest) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        Loading active contest arena...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Contest Banner & Timer */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Active Live Contest
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {activeContest.durationMinutes} Minutes Window
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeContest.title}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {activeContest.description}
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Core Domains</div>
              <div className="text-base font-bold text-indigo-400">5 CS Subjects</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Live Contenders</div>
              <div className="text-base font-bold text-emerald-400">{activeContest.participantsCount} Online</div>
            </div>
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">Filter Domain:</span>
          {['ALL', 'FSD', 'DSA', 'DBMS', 'CN', 'CC'].map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Problems List & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Contest Challenges ({filteredProblems.length})
            </h2>
          </div>

          <div className="space-y-2">
            {filteredProblems.map((problem) => {
              const isSelected = selectedProblem?.id === problem.id;
              const subConfig = SUBJECT_COLORS[problem.subject] || SUBJECT_COLORS.FSD;
              const Icon = subConfig.icon;

              return (
                <div
                  key={problem.id}
                  onClick={() => handleSelectProblem(problem)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg ${subConfig.bg} ${subConfig.text} border ${subConfig.border} mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {problem.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${subConfig.bg} ${subConfig.text}`}>
                            {problem.subject}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {problem.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="text-[10px] text-indigo-400 font-semibold font-mono">
                            {problem.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Problem Description Card */}
          {selectedProblem && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Problem Specification
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedProblem.description}
                </p>
              </div>

              {selectedProblem.sampleInput && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Sample Input:</span>
                  <div className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800/60 overflow-x-auto">
                    {selectedProblem.sampleInput}
                  </div>
                </div>
              )}

              {selectedProblem.sampleOutput && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Expected Output:</span>
                  <div className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800/60 overflow-x-auto">
                    {selectedProblem.sampleOutput}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Test Cases: {selectedProblem.testCases?.length || 3} verified</span>
                <span className="text-indigo-400 font-mono font-medium">Auto-scored by Evaluation Engine</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Code Sandbox & Real-Time Test Runner (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl flex flex-col h-full">
            
            {/* Editor Toolbar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">solution.js</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="javascript">JavaScript (Node v20)</option>
                  <option value="python">Python 3.11</option>
                  <option value="sql">SQL / Postgres</option>
                </select>

                <button
                  onClick={() => setCode(selectedProblem?.starterCode || '')}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition"
                  title="Reset starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="p-3 bg-slate-950 flex-1">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Implement your solution logic here..."
                rows={14}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-indigo-100 resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Async Test Pipeline: Verified against edge cases</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isSubmitting
                    ? 'bg-indigo-900 text-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing in Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run & Submit to Benchmark</span>
                  </>
                )}
              </button>
            </div>

            {/* Real-Time Async Evaluation Stage Indicator */}
            {submissionResult && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {submissionResult.status === 'PENDING' && (
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    )}
                    {submissionResult.status === 'EVALUATING' && (
                      <Cpu className="w-4 h-4 text-cyan-400 animate-bounce" />
                    )}
                    {submissionResult.status === 'ACCEPTED' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {submissionResult.status === 'WRONG_ANSWER' && (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    {submissionResult.status === 'TIME_LIMIT_EXCEEDED' && (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}

                    <span className="text-xs font-bold text-slate-100">
                      Pipeline State: {submissionResult.status}
                    </span>
                  </div>

                  {submissionResult.score !== undefined && (
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      +{submissionResult.score} Points
                    </div>
                  )}
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      submissionResult.status === 'PENDING' ? 'w-1/3 bg-amber-400' :
                      submissionResult.status === 'EVALUATING' ? 'w-2/3 bg-cyan-400' :
                      submissionResult.status === 'ACCEPTED' ? 'w-full bg-emerald-400' : 'w-full bg-rose-500'
                    }`}
                  ></div>
                </div>

                {/* Metrics */}
                {submissionResult.status === 'ACCEPTED' || submissionResult.status === 'PARTIAL_ACCEPTED' ? (
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Test Cases</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {submissionResult.testCasesPassed} / {submissionResult.totalTestCases} Passed
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Execution Time</div>
                      <div className="text-xs font-bold text-cyan-400 font-mono">
                        {submissionResult.executionTimeMs} ms
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Memory Consumed</div>
                      <div className="text-xs font-bold text-indigo-400 font-mono">
                        {submissionResult.memoryMb} MB
                      </div>
                    </div>
                  </div>
                ) : submissionResult.status === 'WRONG_ANSWER' ? (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    Test cases failed. Code length is too short or doesn't meet the algorithmic specification.
                  </div>
                ) : null}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
