import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api';
const WS_URL = 'ws://localhost:5000';

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [contests, setContests] = useState([]);
  const [activeContest, setActiveContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [systemOverview, setSystemOverview] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [liveEvaluation, setLiveEvaluation] = useState(null);

  // Fetch initial users and login as default student
  useEffect(() => {
    fetchUsers();
    fetchContests();
    fetchNotifications();
    fetchOverview();
  }, []);

  // Set up WebSocket connection for real-time events
  useEffect(() => {
    let ws;
    let reconnectTimer;

    function connectWs() {
      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          setWsConnected(true);
          console.log('Connected to Campus Benchmark WebSocket');
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleWsMessage(message);
          } catch (e) {
            console.error('WS parse error', e);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          reconnectTimer = setTimeout(connectWs, 3000);
        };

        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (err) {
        setWsConnected(false);
        reconnectTimer = setTimeout(connectWs, 3000);
      }
    }

    connectWs();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimer);
    };
  }, []);

  const handleWsMessage = (msg) => {
    if (msg.type === 'SUBMISSION_PENDING') {
      setLiveEvaluation({
        status: 'PENDING',
        ...msg.data
      });
    } else if (msg.type === 'SUBMISSION_EVALUATING') {
      setLiveEvaluation(prev => ({
        ...prev,
        status: 'EVALUATING',
        ...msg.data
      }));
    } else if (msg.type === 'SUBMISSION_RESULT') {
      setLiveEvaluation({
        status: 'COMPLETED',
        ...msg.data
      });
      // Add to local submissions
      setSubmissions(prev => [msg.data, ...prev.filter(s => s.id !== msg.data.id)]);
      fetchOverview();
    } else if (msg.type === 'LEADERBOARD_UPDATED') {
      setLeaderboard(msg.data.leaderboard);
    } else if (msg.type === 'NOTIFICATION_RECEIVED') {
      setNotifications(prev => [msg.data, ...prev]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/users`);
      if (res.ok) {
        const users = await res.json();
        setAllUsers(users);
        if (!currentUser && users.length > 0) {
          // Default to student Aarav Sharma
          setCurrentUser(users[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchContests = async () => {
    try {
      const res = await fetch(`${API_BASE}/contests`);
      if (res.ok) {
        const data = await res.json();
        setContests(data);
        const live = data.find(c => c.status === 'LIVE');
        if (live) {
          setActiveContest(live);
          fetchLeaderboard(live.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch contests', err);
    }
  };

  const fetchLeaderboard = async (contestId, filters = {}) => {
    try {
      let url = `${API_BASE}/leaderboard/${contestId}`;
      const params = new URLSearchParams();
      if (filters.batch) params.append('batch', filters.batch);
      if (filters.section) params.append('section', filters.section);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview`);
      if (res.ok) {
        const data = await res.json();
        setSystemOverview(data);
      }
    } catch (err) {
      console.error('Failed to fetch system overview', err);
    }
  };

  const switchUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        contests,
        activeContest,
        setActiveContest,
        leaderboard,
        fetchLeaderboard,
        notifications,
        submissions,
        setSubmissions,
        systemOverview,
        wsConnected,
        liveEvaluation,
        setLiveEvaluation,
        fetchContests
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
