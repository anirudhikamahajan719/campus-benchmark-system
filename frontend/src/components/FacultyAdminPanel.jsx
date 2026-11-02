import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  Calendar, 
  Award, 
  Send, 
  CheckCircle, 
  Users, 
  Activity 
} from 'lucide-react';

export default function FacultyAdminPanel() {
  const { currentUser, contests, fetchContests, systemOverview } = useApp();
  
  // New contest state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(120);
  const [subject, setSubject] = useState('MULTI-SUBJECT');
  const [status, setStatus] = useState('UPCOMING');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Add Problem state
  const [targetContestId, setTargetContestId] = useState(contests[0]?.id || '');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemSubject, setProblemSubject] = useState('FSD');
  const [problemPoints, setProblemPoints] = useState(100);
  const [problemDiff, setProblemDiff] = useState('Medium');
  const [problemDesc, setProblemDesc] = useState('');
  const [problemCode, setProblemCode] = useState('function solution() {\n  // Implement logic\n}');

  const handleCreateContest = async (e) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          durationMinutes: duration,
          subject,
          status,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + duration * 60 * 1000).toISOString()
        })
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setSuccessMsg('Contest published successfully to students!');
        fetchContests();
      }
    } catch (err) {
      console.error('Error creating contest', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!problemTitle || !targetContestId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/contests/${targetContestId}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: problemTitle,
          subject: problemSubject,
          points: problemPoints,
          difficulty: problemDiff,
          description: problemDesc,
          starterCode: problemCode,
          testCases: [
            { id: 'tc_1', input: 'sample_input_1', expected: 'sample_output_1', isHidden: false },
            { id: 'tc_2', input: 'hidden_stress_case', expected: 'correct_result', isHidden: true }
          ]
        })
      });

      if (res.ok) {
        setProblemTitle('');
        setProblemDesc('');
        setSuccessMsg('Problem successfully added to contest problem pool!');
        fetchContests();
      }
    } catch (err) {
      console.error('Error adding problem', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Faculty & Academic Administration Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Contest lifecycle management, challenge publishing, and macro-level academic analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <span>Active Role:</span>
          <span className="font-bold text-white uppercase">{currentUser?.role}</span>
        </div>
      </div>

      {/* Campus System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {systemOverview?.totalStudents || 6}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Contests Run</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {systemOverview?.totalContests || contests.length}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Submissions Evaluated</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {systemOverview?.totalSubmissions || 48}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Acceptance Rate</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {systemOverview?.acceptanceRate || 84}%
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Two forms side-by-side: Create Contest & Add Problem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form 1: Create Contest */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" />
            Schedule New Contest
          </div>

          <form onSubmit={handleCreateContest} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Contest Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Systems & Cloud Infrastructure Sprint"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief guidelines and syllabus..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="MULTI-SUBJECT">Multi-Subject</option>
                  <option value="FSD">FSD</option>
                  <option value="DSA">DSA</option>
                  <option value="DBMS">DBMS</option>
                  <option value="CN">CN</option>
                  <option value="CC">CC</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Duration (Min)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="LIVE">Live Immediately</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Publish Contest & Notify Students
            </button>
          </form>
        </div>

        {/* Form 2: Add Problem to Contest */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            Append Problem Challenge
          </div>

          <form onSubmit={handleAddProblem} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Contest</label>
              <select
                value={targetContestId}
                onChange={(e) => setTargetContestId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
              >
                {contests.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Problem Title</label>
                <input
                  type="text"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="e.g. Distributed Lock using Redis Redlock"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Domain</label>
                <select
                  value={problemSubject}
                  onChange={(e) => setProblemSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="FSD">FSD</option>
                  <option value="DSA">DSA</option>
                  <option value="DBMS">DBMS</option>
                  <option value="CN">CN</option>
                  <option value="CC">CC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Difficulty</label>
                <select
                  value={problemDiff}
                  onChange={(e) => setProblemDiff(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="Easy">Easy (80 pts)</option>
                  <option value="Medium">Medium (100 pts)</option>
                  <option value="Hard">Hard (150 pts)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Points Awarded</label>
                <input
                  type="number"
                  value={problemPoints}
                  onChange={(e) => setProblemPoints(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Problem Statement</label>
              <textarea
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
                placeholder="Detailed algorithmic problem requirement..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Problem to Arena
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
