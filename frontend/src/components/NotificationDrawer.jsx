import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Trophy, Cpu, Info, CheckCheck } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  const { notifications } = useApp();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'CONTEST_ALERT':
      case 'CONTEST_CREATED':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'EVALUATION_COMPLETE':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'LEADERBOARD_UPDATE':
        return <Trophy className="w-4 h-4 text-indigo-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Live Event Stream
            </h2>
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
              {notifications.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No notifications yet. Live updates will stream here.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 transition space-y-1.5"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 leading-tight">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      {notif.message}
                    </p>
                    <div className="text-[9px] text-slate-500 font-mono mt-1">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center font-mono">
          Powered by WebSocket Event Stream
        </div>

      </div>
    </div>
  );
}
