import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Terminal, 
  BarChart3, 
  User, 
  ShieldCheck, 
  Bell, 
  Radio, 
  Users,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenNotifs }) {
  const { currentUser, allUsers, switchUser, wsConnected, notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'arena', label: 'Live Arena', icon: Terminal },
    { id: 'leaderboard', label: 'Live Leaderboard', icon: Trophy },
    { id: 'benchmarking', label: 'Batch Benchmarking', icon: BarChart3 },
    { id: 'profile', label: 'My Skills & Radar', icon: User },
    { id: 'admin', label: 'Faculty & Admin', icon: ShieldCheck, facultyOnly: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('arena')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CampusBenchmark
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                FSD-II
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-Subject Skill & Evaluation Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side controls: WS Status, Notifications, Role Switcher */}
        <div className="flex items-center gap-3">
          {/* WebSocket Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-500'}`} />
            <span className={wsConnected ? 'text-emerald-400 font-medium' : 'text-amber-500'}>
              {wsConnected ? 'WS Live' : 'Connecting'}
            </span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifs}
            className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Live Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick User / Role Switcher for seamless demo testing */}
          <div className="relative group">
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/50" 
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {currentUser?.name || 'Select User'}
                </p>
                <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-mono">
                  {currentUser?.role} {currentUser?.batch ? `• ${currentUser.section}` : ''}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Dropdown to switch between students and faculty */}
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Perspective (Demo)
              </div>
              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2.5 text-xs transition ${
                      currentUser?.id === u.id ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="truncate">
                      <div className="font-medium text-slate-200 truncate">{u.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {u.role.toUpperCase()} {u.batch ? `(${u.batch} ${u.section})` : ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden border-t border-slate-800 px-4 py-2 gap-2 overflow-x-auto bg-slate-950/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
