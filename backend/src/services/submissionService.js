import { getDB, saveDB } from '../data/store.js';
import { v4 as uuidv4 } from 'uuid';
import { evaluationQueue } from './evaluationService.js';
import { broadcastMessage } from '../websocket.js';

export const submissionService = {
  createSubmission: (data) => {
    const db = getDB();
    const user = db.users.find(u => u.id === data.userId) || {
      name: data.userName || 'Anonymous Student',
      batch: data.userBatch || 'Batch 2025',
      section: data.userSection || 'Section A'
    };

    const contest = db.contests.find(c => c.id === data.contestId);
    const problem = contest ? contest.problems.find(p => p.id === data.problemId) : null;

    const submission = {
      id: `sub_${uuidv4().substring(0, 8)}`,
      contestId: data.contestId,
      userId: data.userId,
      userName: user.name,
      userBatch: user.batch,
      userSection: user.section,
      problemId: data.problemId,
      problemTitle: problem ? problem.title : 'Challenge Solution',
      subject: problem ? problem.subject : (data.subject || 'FSD'),
      language: data.language || 'javascript',
      code: data.code || '',
      status: 'PENDING',
      score: 0,
      testCasesPassed: 0,
      totalTestCases: problem && problem.testCases ? problem.testCases.length : 3,
      executionTimeMs: 0,
      memoryMb: 0,
      submittedAt: new Date().toISOString()
    };

    db.submissions.unshift(submission);
    saveDB();

    // Inform clients that a submission has entered the pipeline
    broadcastMessage({
      type: 'SUBMISSION_PENDING',
      data: submission
    });

    // Enqueue for async evaluation
    evaluationQueue.enqueue(submission);

    return submission;
  },

  getSubmissions: (filter = {}) => {
    const db = getDB();
    let results = [...db.submissions];

    if (filter.contestId) {
      results = results.filter(s => s.contestId === filter.contestId);
    }
    if (filter.userId) {
      results = results.filter(s => s.userId === filter.userId);
    }
    if (filter.problemId) {
      results = results.filter(s => s.problemId === filter.problemId);
    }

    return results;
  },

  getSubmissionById: (id) => {
    const db = getDB();
    return db.submissions.find(s => s.id === id);
  }
};
