import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Database, 
  Network, 
  Cloud 
} from 'lucide-react';

export default function SkillBenchmarking() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/batch-benchmark')
      .then(res => res.json())
      .then(data => {
        setBenchmarks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch batch benchmark data', err);
        setLoading(false);
      });
  }, []);

  // Format data for the comparative subject bar chart
  const barChartData = [
    { subject: 'FSD' },
    { subject: 'DSA' },
    { subject: 'DBMS' },
    { subject: 'CN' },
    { subject: 'CC' }
  ].map(item => {
    const row = { subject: item.subject };
    benchmarks.forEach(b => {
      row[b.cohortName] = b.subjectProficiency[item.subject] || 0;
    });
    return row;
  });

  const cohortColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading benchmark aggregations...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Institutional Skill Benchmarking
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Cross-sectional analysis of student proficiency across FSD, DSA, DBMS, Computer Networks, and Cloud Computing.
        </p>
      </div>

      {/* Cohort Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {benchmarks.map((cohort, index) => (
          <div 
            key={cohort.cohortName} 
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: cohortColors[index % cohortColors.length] }}></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 font-mono">
                {cohort.cohortName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {cohort.studentCount} Students
              </span>
            </div>
            
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {cohort.averageRating}
              <span className="text-[11px] font-normal text-slate-400 ml-1.5">Avg Rating</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Total Activity:</span>
              <span className="font-bold text-indigo-400">{cohort.totalSubmissions} Submissions</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comparative Multi-Subject Bar Chart */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Subject Proficiency by Cohort (%)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies curriculum strengths and learning bottlenecks per section
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="subject" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              {benchmarks.map((b, i) => (
                <Bar 
                  key={b.cohortName} 
                  dataKey={b.cohortName} 
                  fill={cohortColors[i % cohortColors.length]} 
                  radius={[4, 4, 0, 0]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Curriculum Gap & Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            Detected Learning Gaps
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Batch 2026 Section A is currently lagging behind in <strong className="text-white">Computer Networks (60%)</strong> and <strong className="text-white">DBMS (65%)</strong> concurrency control queries.
          </p>
          <div className="mt-3 text-[11px] font-mono text-indigo-400 bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            Suggested: Schedule dedicated TCP & Indexing sprint contest.
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            Highest Performing Domain
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Batch 2025 Section A achieved <strong className="text-white">94% in FSD</strong> and <strong className="text-white">92% in DSA</strong>, displaying strong readiness for production software development roles.
          </p>
          <div className="mt-3 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            Status: Benchmark exceeded by +14% campus-wide.
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Cloud className="w-4 h-4" />
            Continuous Learning Metric
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Automated contest feedback loops increased overall practice consistency across subjects by <strong className="text-white">38%</strong> compared to unstructured assignments.
          </p>
          <div className="mt-3 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
            Evaluation Service active with async queue pipeline.
          </div>
        </div>

      </div>

    </div>
  );
}
