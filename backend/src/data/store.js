import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  users: [
    {
      id: "u_student_1",
      name: "Aarav Sharma",
      email: "aarav@campus.edu",
      role: "student",
      batch: "Batch 2025",
      section: "Section A",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      rating: 1845,
      skills: { FSD: 88, DSA: 92, DBMS: 76, CN: 84, CC: 70 },
      submissionsCount: 42,
      rank: 1
    },
    {
      id: "u_student_2",
      name: "Priya Patel",
      email: "priya@campus.edu",
      role: "student",
      batch: "Batch 2025",
      section: "Section A",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      rating: 1790,
      skills: { FSD: 94, DSA: 78, DBMS: 89, CN: 72, CC: 85 },
      submissionsCount: 38,
      rank: 2
    },
    {
      id: "u_student_3",
      name: "Rohan Gupta",
      email: "rohan@campus.edu",
      role: "student",
      batch: "Batch 2025",
      section: "Section B",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      rating: 1720,
      skills: { FSD: 80, DSA: 85, DBMS: 68, CN: 88, CC: 74 },
      submissionsCount: 31,
      rank: 3
    },
    {
      id: "u_student_4",
      name: "Neha Singh",
      email: "neha@campus.edu",
      role: "student",
      batch: "Batch 2025",
      section: "Section B",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      rating: 1680,
      skills: { FSD: 75, DSA: 70, DBMS: 85, CN: 78, CC: 82 },
      submissionsCount: 29,
      rank: 4
    },
    {
      id: "u_student_5",
      name: "Kabir Mehta",
      email: "kabir@campus.edu",
      role: "student",
      batch: "Batch 2026",
      section: "Section A",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 1610,
      skills: { FSD: 70, DSA: 88, DBMS: 65, CN: 60, CC: 65 },
      submissionsCount: 22,
      rank: 5
    },
    {
      id: "u_student_6",
      name: "Ananya Verma",
      email: "ananya@campus.edu",
      role: "student",
      batch: "Batch 2026",
      section: "Section B",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      rating: 1560,
      skills: { FSD: 82, DSA: 64, DBMS: 72, CN: 70, CC: 68 },
      submissionsCount: 19,
      rank: 6
    },
    {
      id: "u_faculty_1",
      name: "Dr. Amandeep Kaur",
      email: "faculty@campus.edu",
      role: "faculty",
      department: "Computer Science & Engineering",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "u_admin_1",
      name: "Campus Admin (Academics)",
      email: "admin@campus.edu",
      role: "admin",
      department: "Academic Dean Office",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    }
  ],
  contests: [
    {
      id: "c_live_101",
      title: "All-Campus Inter-Batch CS Derby 2026",
      status: "LIVE",
      description: "Comprehensive 5-domain tournament benchmarking FSD, DSA, DBMS, Computer Networks, and Cloud Computing.",
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
      durationMinutes: 120,
      subject: "MULTI-SUBJECT",
      participantsCount: 48,
      problems: [
        {
          id: "p_fsd_1",
          title: "State Hydration & Token Refresh Queue",
          subject: "FSD",
          difficulty: "Medium",
          points: 100,
          description: "Write an idempotent handler for intercepting 401 Unauthorized API requests, queuing concurrent caller promises, triggering a single refresh token exchange, and replaying queued requests without race conditions.",
          sampleInput: "Requests: [GET /api/user, GET /api/stats] with expired token",
          sampleOutput: "1 Refresh Call made; both original calls resolved with token Bearer-v2",
          starterCode: `// Implement request interceptor queue
function handleAuthRefresh(failedRequestsQueue, refreshTokenApi) {
  // Your implementation here
  return {
    isRefreshing: false,
    queuedRequests: [],
    processQueue: (newToken) => {}
  };
}`,
          testCases: [
            { id: "tc_1", input: "concurrent_requests: 3", expected: "single_refresh_invoked", isHidden: false },
            { id: "tc_2", input: "refresh_fails_403", expected: "logout_all_subscribers", isHidden: false },
            { id: "tc_3", input: "timeout_edge_case", expected: "flush_with_rejection", isHidden: true }
          ]
        },
        {
          id: "p_dsa_1",
          title: "Minimum Latency Data Stream Aggregator",
          subject: "DSA",
          difficulty: "Hard",
          points: 150,
          description: "Given continuous sliding windows of server ping latencies from 5 regional clusters, find the median ping using a dual-heap (Min-Max Heap) structure with O(1) query time and O(log K) insertion.",
          sampleInput: "[12, 45, 23, 89, 5, 34, 18]",
          sampleOutput: "Running medians: [12, 28.5, 23, 34, 23, 28.5, 23]",
          starterCode: `class MedianStreamFinder {
  constructor() {
    this.maxHeap = []; // lower half
    this.minHeap = []; // upper half
  }

  addNum(num) {
    // Implement O(log N) insertion with heap balancing
  }

  findMedian() {
    // Return O(1) median
    return 0;
  }
}`,
          testCases: [
            { id: "tc_4", input: "stream: [1, 2, 3]", expected: "2.0", isHidden: false },
            { id: "tc_5", input: "stream: [5, 15, 1, 3]", expected: "4.0", isHidden: false },
            { id: "tc_6", input: "large_balanced_stress_test", expected: "passed", isHidden: true }
          ]
        },
        {
          id: "p_dbms_1",
          title: "B-Tree Range Query Optimizer & Deadlock Prevention",
          subject: "DBMS",
          difficulty: "Medium",
          points: 100,
          description: "Analyze SQL transaction isolation levels. Formulate query indexing and advisory lock sequencing to avoid circular wait (deadlocks) during simultaneous inventory decrements in high-concurrency checkout.",
          sampleInput: "TxA: UPDATE items WHERE id IN (3, 7); TxB: UPDATE items WHERE id IN (7, 3);",
          sampleOutput: "Deterministic ascending ID sort key acquisition lock: Lock(3) -> Lock(7)",
          starterCode: `-- Write the optimized transaction block with deterministic locking
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Select with ordered FOR UPDATE
SELECT * FROM inventory 
WHERE id IN (:id1, :id2)
ORDER BY id ASC 
FOR UPDATE;

-- Perform atomic deduction
UPDATE inventory SET stock = stock - 1 WHERE id IN (:id1, :id2);

COMMIT;`,
          testCases: [
            { id: "tc_7", input: "parallel_tx_reversed_order", expected: "deadlock_free", isHidden: false },
            { id: "tc_8", input: "index_hit_verification", expected: "Index Scan on idx_inv_id", isHidden: false }
          ]
        },
        {
          id: "p_cn_1",
          title: "TCP Congestion Window Fast Recovery Simulation",
          subject: "CN",
          difficulty: "Medium",
          points: 100,
          description: "Model the TCP Reno state machine handling 3 duplicate ACKs (Triple Duplicate ACK). Implement Fast Retransmit, adjust slow start threshold (ssthresh), and enter Fast Recovery mode without dropping cwnd back to 1 MSS.",
          sampleInput: "cwnd: 32 MSS, ssthresh: 64, event: 3_DUP_ACKS",
          sampleOutput: "New ssthresh: 16 MSS, New cwnd: 19 MSS (ssthresh + 3 MSS)",
          starterCode: `function handleTcpCongestion(currentState, event) {
  let { cwnd, ssthresh, state } = currentState;
  if (event === 'TRIPLE_DUP_ACK') {
    ssthresh = Math.max(Math.floor(cwnd / 2), 2);
    cwnd = ssthresh + 3;
    state = 'FAST_RECOVERY';
  }
  return { cwnd, ssthresh, state };
}`,
          testCases: [
            { id: "tc_9", input: "cwnd: 24, event: 'TRIPLE_DUP_ACK'", expected: "ssthresh: 12, cwnd: 15", isHidden: false },
            { id: "tc_10", input: "state: 'FAST_RECOVERY', event: 'NEW_ACK'", expected: "state: 'CONGESTION_AVOIDANCE'", isHidden: false }
          ]
        },
        {
          id: "p_cc_1",
          title: "Horizontal Pod Autoscaler (HPA) Metric Evaluator",
          subject: "CC",
          difficulty: "Easy",
          points: 80,
          description: "Implement the Kubernetes HPA algorithm: desiredReplicas = ceil[currentReplicas * ( currentMetricValue / targetMetricValue )]. Factor in scale-up cooldown damping and minimum/maximum replica bounds.",
          sampleInput: "currentReplicas: 4, currentCpu: 85%, targetCpu: 50%, min: 2, max: 10",
          sampleOutput: "desiredReplicas: 7",
          starterCode: `function calculateDesiredReplicas(currentReplicas, currentMetric, targetMetric, minReplicas, maxReplicas) {
  const ratio = currentMetric / targetMetric;
  const rawDesired = Math.ceil(currentReplicas * ratio);
  return Math.max(minReplicas, Math.min(maxReplicas, rawDesired));
}`,
          testCases: [
            { id: "tc_11", input: "curr: 4, currMetric: 85, target: 50, min: 2, max: 10", expected: "7", isHidden: false },
            { id: "tc_12", input: "curr: 8, currMetric: 100, target: 20, min: 2, max: 10", expected: "10 (clamped)", isHidden: false }
          ]
        }
      ]
    },
    {
      id: "c_upcoming_102",
      title: "FSD & System Architecture Grand Prix",
      status: "UPCOMING",
      description: "Advanced Full-Stack Engineering contest focused on microservice routing, caching tiers, and event loops.",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 180,
      subject: "FSD",
      participantsCount: 32,
      problems: []
    },
    {
      id: "c_past_100",
      title: "Winter Algorithmic Clash (DSA)",
      status: "COMPLETED",
      description: "Intense competitive programming contest spanning graph traversal, dynamic programming, and segment trees.",
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
      durationMinutes: 120,
      subject: "DSA",
      participantsCount: 65,
      problems: []
    }
  ],
  submissions: [
    {
      id: "sub_1001",
      contestId: "c_live_101",
      userId: "u_student_1",
      userName: "Aarav Sharma",
      userBatch: "Batch 2025",
      userSection: "Section A",
      problemId: "p_dsa_1",
      problemTitle: "Minimum Latency Data Stream Aggregator",
      subject: "DSA",
      language: "javascript",
      code: `class MedianStreamFinder { ... }`,
      status: "ACCEPTED",
      score: 150,
      testCasesPassed: 3,
      totalTestCases: 3,
      executionTimeMs: 42,
      memoryMb: 14.2,
      submittedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString()
    },
    {
      id: "sub_1002",
      contestId: "c_live_101",
      userId: "u_student_1",
      userName: "Aarav Sharma",
      userBatch: "Batch 2025",
      userSection: "Section A",
      problemId: "p_fsd_1",
      problemTitle: "State Hydration & Token Refresh Queue",
      subject: "FSD",
      language: "javascript",
      code: `function handleAuthRefresh() { ... }`,
      status: "ACCEPTED",
      score: 100,
      testCasesPassed: 3,
      totalTestCases: 3,
      executionTimeMs: 18,
      memoryMb: 12.8,
      submittedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
    },
    {
      id: "sub_1003",
      contestId: "c_live_101",
      userId: "u_student_2",
      userName: "Priya Patel",
      userBatch: "Batch 2025",
      userSection: "Section A",
      problemId: "p_fsd_1",
      problemTitle: "State Hydration & Token Refresh Queue",
      subject: "FSD",
      language: "javascript",
      code: `function handleAuthRefresh() { ... }`,
      status: "ACCEPTED",
      score: 100,
      testCasesPassed: 3,
      totalTestCases: 3,
      executionTimeMs: 22,
      memoryMb: 13.1,
      submittedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: "sub_1004",
      contestId: "c_live_101",
      userId: "u_student_2",
      userName: "Priya Patel",
      userBatch: "Batch 2025",
      userSection: "Section A",
      problemId: "p_cc_1",
      problemTitle: "Horizontal Pod Autoscaler (HPA) Metric Evaluator",
      subject: "CC",
      language: "javascript",
      code: `function calculateDesiredReplicas() { ... }`,
      status: "ACCEPTED",
      score: 80,
      testCasesPassed: 2,
      totalTestCases: 2,
      executionTimeMs: 11,
      memoryMb: 9.4,
      submittedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
    },
    {
      id: "sub_1005",
      contestId: "c_live_101",
      userId: "u_student_3",
      userName: "Rohan Gupta",
      userBatch: "Batch 2025",
      userSection: "Section B",
      problemId: "p_cn_1",
      problemTitle: "TCP Congestion Window Fast Recovery Simulation",
      subject: "CN",
      language: "javascript",
      code: `function handleTcpCongestion() { ... }`,
      status: "ACCEPTED",
      score: 100,
      testCasesPassed: 2,
      totalTestCases: 2,
      executionTimeMs: 15,
      memoryMb: 11.0,
      submittedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    },
    {
      id: "sub_1006",
      contestId: "c_live_101",
      userId: "u_student_4",
      userName: "Neha Singh",
      userBatch: "Batch 2025",
      userSection: "Section B",
      problemId: "p_dbms_1",
      problemTitle: "B-Tree Range Query Optimizer & Deadlock Prevention",
      subject: "DBMS",
      language: "sql",
      code: `BEGIN TRANSACTION ...`,
      status: "ACCEPTED",
      score: 100,
      testCasesPassed: 2,
      totalTestCases: 2,
      executionTimeMs: 35,
      memoryMb: 16.5,
      submittedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ],
  notifications: [
    {
      id: "notif_1",
      type: "CONTEST_ALERT",
      title: "Contest Live Now!",
      message: "All-Campus Inter-Batch CS Derby 2026 is underway! Solve problems across FSD, DSA, DBMS, CN & CC.",
      timestamp: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: "notif_2",
      type: "LEADERBOARD_UPDATE",
      title: "Leaderboard Shift",
      message: "Aarav Sharma took 1st place with 250 points after solving DSA Challenge 1.",
      timestamp: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
      read: false
    }
  ]
};

// In-memory active DB with file sync
let db = null;

export function getDB() {
  if (!db) {
    if (fs.existsSync(DB_FILE)) {
      try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      } catch (err) {
        console.error('Error reading DB_FILE, falling back to initial data:', err);
        db = JSON.parse(JSON.stringify(INITIAL_DATA));
      }
    } else {
      db = JSON.parse(JSON.stringify(INITIAL_DATA));
      saveDB();
    }
  }
  return db;
}

export function saveDB() {
  if (db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  }
}
