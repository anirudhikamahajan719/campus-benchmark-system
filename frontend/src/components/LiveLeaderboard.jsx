import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Filter, 
  Users, 
  Clock, 
  Layers, 
  Cpu, 
  Database, 
  Network, 
  Cloud 
} from 'lucide-react';

export default function LiveLeaderboard() {
  const { leaderboard, activeContest, currentUser, fetchLeaderboard } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const handleFilterChange = (batch, section) => {
    setSelectedBatch(batch);
    setSelectedSection(section);
    if (activeContest) {
      fetchLeaderboard(activeContest.id, { batch, section });
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/30">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs shadow-lg shadow-slate-300/30">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs shadow-lg shadow-amber-700/30">
          🥉 3
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs">
        {rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Real-Time Contest Leaderboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {activeContest?.title || 'Active Contest'} • Live scoring with instant tie-breakers
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBatch}
              onChange={(e) => handleFilterChange(e.target.value, selectedSection)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="">All Batches</option>
              <option value="Batch 2025">Batch 2025</option>
              <option value="Batch 2026">Batch 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSection}
              onChange={(e) => handleFilterChange(selectedBatch, e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-3">Batch / Sec</th>
                <th className="py-3.5 px-3 text-center">Problems</th>
                <th className="py-3.5 px-2 text-center text-indigo-400">FSD</th>
                <th className="py-3.5 px-2 text-center text-blue-400">DSA</th>
                <th className="py-3.5 px-2 text-center text-emerald-400">DBMS</th>
                <th className="py-3.5 px-2 text-center text-amber-400">CN</th>
                <th className="py-3.5 px-2 text-center text-cyan-400">CC</th>
                <th className="py-3.5 px-4 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No submissions recorded for this filter yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((row) => {
                  const isCurrent = currentUser?.id === row.userId;
                  return (
                    <tr
                      key={row.userId}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-indigo-600/15 ring-1 ring-inset ring-indigo-500/50'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        {getRankBadge(row.rank)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {row.avatar ? (
                            <img
                              src={row.avatar}
                              alt={row.userName}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                              {row.userName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-100 flex items-center gap-1.5">
                              {row.userName}
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded text-[9px] font-mono">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Updated {new Date(row.lastSubmissionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 font-mono">
                        <div>{row.userBatch}</div>
                        <div className="text-[10px] text-slate-500">{row.userSection}</div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 font-mono font-semibold">
                          {row.problemsSolvedCount} solved
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono font-bold text-indigo-300">
                        {row.subjectBreakdown?.FSD || '-'}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono font-bold text-blue-300">
                        {row.subjectBreakdown?.DSA || '-'}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono font-bold text-emerald-300">
                        {row.subjectBreakdown?.DBMS || '-'}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono font-bold text-amber-300">
                        {row.subjectBreakdown?.CN || '-'}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono font-bold text-cyan-300">
                        {row.subjectBreakdown?.CC || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-extrabold text-base text-amber-400 font-mono">
                          {row.totalScore}
                        </div>
                        <div className="text-[10px] text-slate-500">PTS</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
