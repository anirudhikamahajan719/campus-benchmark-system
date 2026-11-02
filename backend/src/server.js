import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initWebSocket } from './websocket.js';
import { authService } from './services/authService.js';
import { contestService } from './services/contestService.js';
import { submissionService } from './services/submissionService.js';
import { leaderboardService } from './services/leaderboardService.js';
import { analyticsService } from './services/analyticsService.js';
import { notificationService } from './services/notificationService.js';
import { getDB } from './data/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize store
getDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'Campus Benchmark Microservices Gateway', timestamp: new Date() });
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const result = authService.login(email, role);
  res.json(result);
});

app.get('/api/auth/users', (req, res) => {
  res.json(authService.getAllUsers());
});

// Contest Routes
app.get('/api/contests', (req, res) => {
  const { status } = req.query;
  const contests = contestService.getContests(status);
  res.json(contests);
});

app.get('/api/contests/:id', (req, res) => {
  const contest = contestService.getContestById(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Contest not found' });
  res.json(contest);
});

app.post('/api/contests', (req, res) => {
  try {
    const newContest = contestService.createContest(req.body);
    notificationService.createNotification({
      type: 'CONTEST_CREATED',
      title: 'New Contest Announced!',
      message: `${newContest.title} has been scheduled (${newContest.subject}).`
    });
    res.status(201).json(newContest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contests/:id/problems', (req, res) => {
  try {
    const problem = contestService.addProblemToContest(req.params.id, req.body);
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submission Routes
app.post('/api/submissions', (req, res) => {
  const { contestId, problemId, userId, code, language } = req.body;
  if (!contestId || !problemId || !userId || !code) {
    return res.status(400).json({ error: 'Missing required submission fields' });
  }
  const submission = submissionService.createSubmission(req.body);
  res.status(202).json({
    message: 'Submission queued for asynchronous evaluation',
    submission
  });
});

app.get('/api/submissions', (req, res) => {
  const { contestId, userId, problemId } = req.query;
  const submissions = submissionService.getSubmissions({ contestId, userId, problemId });
  res.json(submissions);
});

app.get('/api/submissions/:id', (req, res) => {
  const sub = submissionService.getSubmissionById(req.params.id);
  if (!sub) return res.status(404).json({ error: 'Submission not found' });
  res.json(sub);
});

// Leaderboard Routes
app.get('/api/leaderboard/:contestId', (req, res) => {
  const { batch, section } = req.query;
  const leaderboard = leaderboardService.getLeaderboard(req.params.contestId, { batch, section });
  res.json(leaderboard);
});

// Analytics Routes
app.get('/api/analytics/overview', (req, res) => {
  res.json(analyticsService.getSystemOverview());
});

app.get('/api/analytics/batch-benchmark', (req, res) => {
  res.json(analyticsService.getBatchBenchmarking());
});

app.get('/api/analytics/student/:id', (req, res) => {
  const studentData = analyticsService.getStudentAnalytics(req.params.id);
  if (!studentData) return res.status(404).json({ error: 'Student not found' });
  res.json(studentData);
});

// Notification Routes
app.get('/api/notifications', (req, res) => {
  res.json(notificationService.getNotifications());
});

// Create HTTP server and bind WebSocket
const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Campus Benchmark Backend Server running on port ${PORT}`);
  console.log(`📡 WebSocket server listening for real-time events`);
  console.log(`====================================================`);
});
