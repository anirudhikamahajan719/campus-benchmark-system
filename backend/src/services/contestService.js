import { getDB, saveDB } from '../data/store.js';
import { v4 as uuidv4 } from 'uuid';

export const contestService = {
  getContests: (status) => {
    const db = getDB();
    if (!status) return db.contests;
    return db.contests.filter(c => c.status.toUpperCase() === status.toUpperCase());
  },

  getContestById: (id) => {
    const db = getDB();
    return db.contests.find(c => c.id === id);
  },

  createContest: (contestData) => {
    const db = getDB();
    const newContest = {
      id: `c_${uuidv4().substring(0, 8)}`,
      title: contestData.title,
      status: contestData.status || 'UPCOMING',
      description: contestData.description || '',
      startTime: contestData.startTime || new Date().toISOString(),
      endTime: contestData.endTime || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      durationMinutes: parseInt(contestData.durationMinutes) || 120,
      subject: contestData.subject || 'MULTI-SUBJECT',
      participantsCount: 0,
      problems: contestData.problems || []
    };
    db.contests.unshift(newContest);
    saveDB();
    return newContest;
  },

  addProblemToContest: (contestId, problemData) => {
    const db = getDB();
    const contest = db.contests.find(c => c.id === contestId);
    if (!contest) throw new Error('Contest not found');

    const newProblem = {
      id: `p_${uuidv4().substring(0, 8)}`,
      title: problemData.title,
      subject: problemData.subject || 'FSD',
      difficulty: problemData.difficulty || 'Medium',
      points: parseInt(problemData.points) || 100,
      description: problemData.description || '',
      sampleInput: problemData.sampleInput || '',
      sampleOutput: problemData.sampleOutput || '',
      starterCode: problemData.starterCode || '// Write solution here\n',
      testCases: problemData.testCases || [
        { id: `tc_${uuidv4().substring(0, 4)}`, input: "test 1", expected: "pass", isHidden: false }
      ]
    };

    contest.problems.push(newProblem);
    saveDB();
    return newProblem;
  }
};
