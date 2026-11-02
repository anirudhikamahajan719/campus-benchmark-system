import { getDB } from '../data/store.js';

export const analyticsService = {
  // Batch & Section benchmarking aggregations
  getBatchBenchmarking: () => {
    const db = getDB();
    const batches = ['Batch 2025', 'Batch 2026'];
    const sections = ['Section A', 'Section B'];

    const sectionStats = [];

    batches.forEach(batch => {
      sections.forEach(section => {
        const students = db.users.filter(u => u.role === 'student' && u.batch === batch && u.section === section);
        if (students.length === 0) return;

        const count = students.length;
        const avgSkills = { FSD: 0, DSA: 0, DBMS: 0, CN: 0, CC: 0 };
        let totalRating = 0;
        let totalSubs = 0;

        students.forEach(st => {
          totalRating += st.rating || 1500;
          totalSubs += st.submissionsCount || 0;
          if (st.skills) {
            Object.keys(avgSkills).forEach(sub => {
              avgSkills[sub] += st.skills[sub] || 50;
            });
          }
        });

        Object.keys(avgSkills).forEach(sub => {
          avgSkills[sub] = Math.round(avgSkills[sub] / count);
        });

        sectionStats.push({
          batch,
          section,
          cohortName: `${batch} (${section})`,
          studentCount: count,
          averageRating: Math.round(totalRating / count),
          totalSubmissions: totalSubs,
          subjectProficiency: avgSkills
        });
      });
    });

    return sectionStats;
  },

  // Student skill radar & progress
  getStudentAnalytics: (userId) => {
    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;

    const userSubs = db.submissions.filter(s => s.userId === userId);

    const subjectBreakdown = {
      FSD: { attempted: 0, accepted: 0 },
      DSA: { attempted: 0, accepted: 0 },
      DBMS: { attempted: 0, accepted: 0 },
      CN: { attempted: 0, accepted: 0 },
      CC: { attempted: 0, accepted: 0 }
    };

    userSubs.forEach(s => {
      if (s.subject && subjectBreakdown[s.subject]) {
        subjectBreakdown[s.subject].attempted += 1;
        if (s.status === 'ACCEPTED') {
          subjectBreakdown[s.subject].accepted += 1;
        }
      }
    });

    // Find weakest subject for personalized recommendation
    const skills = user.skills || { FSD: 60, DSA: 60, DBMS: 60, CN: 60, CC: 60 };
    let weakestSubject = 'FSD';
    let minScore = 999;
    Object.entries(skills).forEach(([sub, val]) => {
      if (val < minScore) {
        minScore = val;
        weakestSubject = sub;
      }
    });

    const recommendations = {
      FSD: "Practice Microservice Event Queues and Token Interceptors to boost your Full Stack proficiency.",
      DSA: "Solve Sliding Window and Dual-Heap streaming challenges to elevate algorithmic thinking.",
      DBMS: "Deep dive into Transaction Deadlocks, B-Tree indices, and MVCC concurrency controls.",
      CN: "Explore TCP Reno congestion recovery states and subnet mask routing logic.",
      CC: "Master Kubernetes HPA scaling algorithms and container resource limits."
    };

    return {
      user,
      skills,
      radarData: Object.entries(skills).map(([subject, score]) => ({
        subject,
        score,
        campusAverage: 72
      })),
      subjectBreakdown,
      weakestSubject,
      recommendedAction: recommendations[weakestSubject] || "Keep practicing daily contests!",
      submissions: userSubs.slice(0, 10)
    };
  },

  getSystemOverview: () => {
    const db = getDB();
    const students = db.users.filter(u => u.role === 'student');
    const totalContests = db.contests.length;
    const totalSubmissions = db.submissions.length;
    const acceptedCount = db.submissions.filter(s => s.status === 'ACCEPTED').length;
    const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

    return {
      totalStudents: students.length,
      totalContests,
      totalSubmissions,
      acceptanceRate,
      activeLiveContest: db.contests.find(c => c.status === 'LIVE') || null
    };
  }
};
