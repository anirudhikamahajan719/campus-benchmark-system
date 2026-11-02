import { getDB, saveDB } from '../data/store.js';
import { broadcastMessage } from '../websocket.js';
import { leaderboardService } from './leaderboardService.js';
import { notificationService } from './notificationService.js';

// Asynchronous evaluation worker queue
class EvaluationWorkerQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(submission) {
    this.queue.push(submission);
    this.processNext();
  }

  async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const submission = this.queue.shift();

    // Broadcast status: EVALUATING
    broadcastMessage({
      type: 'SUBMISSION_EVALUATING',
      data: {
        submissionId: submission.id,
        contestId: submission.contestId,
        userName: submission.userName,
        problemTitle: submission.problemTitle
      }
    });

    // Simulate sandbox code execution delay (e.g., 1.2s)
    setTimeout(() => {
      this.evaluateSubmission(submission);
      this.isProcessing = false;
      this.processNext();
    }, 1200);
  }

  evaluateSubmission(submission) {
    const db = getDB();
    const contest = db.contests.find(c => c.id === submission.contestId);
    const problem = contest ? contest.problems.find(p => p.id === submission.problemId) : null;

    const totalTestCases = problem && problem.testCases ? problem.testCases.length : 3;
    
    // Check code quality / heuristics (e.g., if code is empty or just starter)
    const codeLength = submission.code.trim().length;
    let passedCases = totalTestCases;
    let status = 'ACCEPTED';
    let execTime = Math.floor(Math.random() * 30) + 12; // 12ms - 42ms
    let memory = (Math.random() * 8 + 8).toFixed(1); // 8MB - 16MB

    if (codeLength < 25) {
      passedCases = 0;
      status = 'WRONG_ANSWER';
    } else if (submission.code.includes('throw') || submission.code.includes('infinite')) {
      passedCases = 1;
      status = 'TIME_LIMIT_EXCEEDED';
    } else if (Math.random() > 0.85 && codeLength < 60) {
      passedCases = Math.max(1, totalTestCases - 1);
      status = 'PARTIAL_ACCEPTED';
    }

    const maxPoints = problem ? problem.points : 100;
    const score = Math.round((passedCases / totalTestCases) * maxPoints);

    // Update in-memory and persisted submission
    const existingIndex = db.submissions.findIndex(s => s.id === submission.id);
    const updatedSubmission = {
      ...submission,
      status,
      score,
      testCasesPassed: passedCases,
      totalTestCases: totalTestCases,
      executionTimeMs: execTime,
      memoryMb: parseFloat(memory),
      evaluatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      db.submissions[existingIndex] = updatedSubmission;
    } else {
      db.submissions.unshift(updatedSubmission);
    }

    // Update student skill stats if accepted or partial
    const user = db.users.find(u => u.id === submission.userId);
    if (user && submission.subject && user.skills && user.skills[submission.subject] !== undefined) {
      const boost = status === 'ACCEPTED' ? 3 : 1;
      user.skills[submission.subject] = Math.min(100, user.skills[submission.subject] + boost);
      user.rating += Math.round(score / 10);
      user.submissionsCount = (user.submissionsCount || 0) + 1;
    }

    saveDB();

    // Broadcast results
    broadcastMessage({
      type: 'SUBMISSION_RESULT',
      data: updatedSubmission
    });

    // Notify user & contest participants
    notificationService.createNotification({
      type: 'EVALUATION_COMPLETE',
      title: `Submission Evaluated: ${status}`,
      message: `${submission.userName} scored ${score}/${maxPoints} on "${submission.problemTitle}" (${submission.subject}).`
    });

    // Broadcast new updated leaderboard
    const newLeaderboard = leaderboardService.getLeaderboard(submission.contestId);
    broadcastMessage({
      type: 'LEADERBOARD_UPDATED',
      data: {
        contestId: submission.contestId,
        leaderboard: newLeaderboard
      }
    });
  }
}

export const evaluationQueue = new EvaluationWorkerQueue();
