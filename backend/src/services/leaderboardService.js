import { getDB } from '../data/store.js';

export const leaderboardService = {
  getLeaderboard: (contestId, options = {}) => {
    const db = getDB();
    const contest = db.contests.find(c => c.id === contestId);
    if (!contest) return [];

    // Filter submissions belonging to this contest
    const contestSubs = db.submissions.filter(s => s.contestId === contestId);

    // Aggregate by user
    const userMap = {};

    contestSubs.forEach(sub => {
      if (!userMap[sub.userId]) {
        const u = db.users.find(usr => usr.id === sub.userId);
        userMap[sub.userId] = {
          userId: sub.userId,
          userName: sub.userName || (u ? u.name : 'Unknown'),
          userBatch: sub.userBatch || (u ? u.batch : 'N/A'),
          userSection: sub.userSection || (u ? u.section : 'N/A'),
          avatar: u ? u.avatar : '',
          totalScore: 0,
          solvedProblems: new Set(),
          lastSubmissionTime: new Date(sub.submittedAt).getTime(),
          subjectBreakdown: { FSD: 0, DSA: 0, DBMS: 0, CN: 0, CC: 0 }
        };
      }

      if (sub.status === 'ACCEPTED' || sub.status === 'PARTIAL_ACCEPTED') {
        const curr = userMap[sub.userId];
        if (!curr.solvedProblems.has(sub.problemId)) {
          curr.solvedProblems.add(sub.problemId);
          curr.totalScore += sub.score;
          if (sub.subject && curr.subjectBreakdown[sub.subject] !== undefined) {
            curr.subjectBreakdown[sub.subject] += sub.score;
          }
        }
        const time = new Date(sub.submittedAt).getTime();
        if (time > curr.lastSubmissionTime) {
          curr.lastSubmissionTime = time;
        }
      }
    });

    let leaderboard = Object.values(userMap).map(item => ({
      userId: item.userId,
      userName: item.userName,
      userBatch: item.userBatch,
      userSection: item.userSection,
      avatar: item.avatar,
      totalScore: item.totalScore,
      problemsSolvedCount: item.solvedProblems.size,
      lastSubmissionTime: item.lastSubmissionTime,
      subjectBreakdown: item.subjectBreakdown
    }));

    // Sorting logic:
    // 1. Highest Total Score
    // 2. Tie-breaker: More problems solved
    // 3. Tie-breaker: Earliest last submission time (penalty clock)
    leaderboard.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.problemsSolvedCount !== a.problemsSolvedCount) return b.problemsSolvedCount - a.problemsSolvedCount;
      return a.lastSubmissionTime - b.lastSubmissionTime;
    });

    // Assign rank
    leaderboard = leaderboard.map((entry, idx) => ({
      rank: idx + 1,
      ...entry
    }));

    // Optional filters: batch, section
    if (options.batch) {
      leaderboard = leaderboard.filter(e => e.userBatch === options.batch);
    }
    if (options.section) {
      leaderboard = leaderboard.filter(e => e.userSection === options.section);
    }

    return leaderboard;
  }
};
