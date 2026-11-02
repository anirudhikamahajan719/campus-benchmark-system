import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { 
  User, 
  Award, 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function StudentProfile() {
  const { currentUser } = useApp();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      setLoading(true);
      fetch(`http://localhost:5000/api/analytics/student/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          setProfileData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch student profile', err);
          setLoading(false);
        });
    }
  }, [currentUser]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading student competency radar...</div>;
  }

  if (!profileData) {
    return <div className="p-8 text-center text-slate-400">Student profile data unavailable.</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Student Profile Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser?.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-semibold">
                {currentUser?.role?.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {currentUser?.batch} • {currentUser?.section} • {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Competency Badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Skill Rating</div>
            <div className="text-xl font-black text-amber-400 font-mono">{currentUser?.rating || 1750}</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Global Rank</div>
            <div className="text-xl font-black text-indigo-400 font-mono">#{currentUser?.rank || 1}</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Submissions</div>
            <div className="text-xl font-black text-emerald-400 font-mono">{currentUser?.submissionsCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Radar Chart vs Personalized Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                5-Domain Competency Radar
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against campus benchmark average (72%)
              </p>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={profileData.radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar 
                  name="Student Proficiency" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.4} 
                />
                <Radar 
                  name="Campus Benchmark" 
                  dataKey="campusAverage" 
                  stroke="#94a3b8" 
                  fill="#94a3b8" 
                  fillOpacity={0.15} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
              <span className="text-slate-300">Your Proficiency</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-500 inline-block"></span>
              <span className="text-slate-400">Campus Benchmark (Avg)</span>
            </div>
          </div>
        </div>

        {/* Personalized Recommendation Engine & Skill Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* AI / Rule-Based Advisory Card */}
          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              Automated Skill Gap Advisory
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Focus Domain: {profileData.weakestSubject}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {profileData.recommendedAction}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 font-mono font-medium">
                Recommendation Score: {profileData.skills[profileData.weakestSubject]}%
              </span>
            </div>
          </div>

          {/* Quick Subject Score Sliders */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Subject Mastery Breakdown
            </h4>
            {Object.entries(profileData.skills).map(([subj, score]) => (
              <div key={subj} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{subj}</span>
                  <span className="text-indigo-400 font-bold">{score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Recent Submissions Log */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Recent Activity & Submission Audits
        </h3>

        <div className="divide-y divide-slate-800/60">
          {profileData.submissions?.length === 0 ? (
            <div className="py-4 text-xs text-slate-400">No submissions found yet.</div>
          ) : (
            profileData.submissions.map(sub => (
              <div key={sub.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  {sub.status === 'ACCEPTED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-200">{sub.problemTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Domain: <span className="text-indigo-400 font-semibold">{sub.subject}</span> • {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right font-mono">
                  <div className="hidden sm:block text-[11px] text-slate-400">
                    {sub.executionTimeMs} ms • {sub.memoryMb} MB
                  </div>
                  <div className="font-bold text-emerald-400">
                    +{sub.score} pts
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
