import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import LiveContestArena from './components/LiveContestArena';
import LiveLeaderboard from './components/LiveLeaderboard';
import SkillBenchmarking from './components/SkillBenchmarking';
import StudentProfile from './components/StudentProfile';
import FacultyAdminPanel from './components/FacultyAdminPanel';
import NotificationDrawer from './components/NotificationDrawer';

function MainApp() {
  const [activeTab, setActiveTab] = useState('arena');
  const [notifsOpen, setNotifsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenNotifs={() => setNotifsOpen(true)} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'arena' && <LiveContestArena />}
        {activeTab === 'leaderboard' && <LiveLeaderboard />}
        {activeTab === 'benchmarking' && <SkillBenchmarking />}
        {activeTab === 'profile' && <StudentProfile />}
        {activeTab === 'admin' && <FacultyAdminPanel />}
      </main>

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={notifsOpen} 
        onClose={() => setNotifsOpen(false)} 
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Campus Competitive Learning & Skill Benchmarking System • FSD-II Capstone
          </div>
          <div className="text-slate-400">
            Microservices Architecture (Auth, Contest, Submission, Evaluation Queue, Leaderboards, Analytics)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
