const STORAGE_KEYS = {
  USER_PROGRESS: 'em_user_progress',
  SPACED_REPETITION: 'em_spaced_repetition',
  USER_STATS: 'em_user_stats',
  ACHIEVEMENTS: 'em_achievements',
  SETTINGS: 'em_settings',
  LESSON_PROGRESS: 'em_lesson_progress',
};

export const storage = {
  // User Progress
  getUserProgress: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : getDefaultUserProgress();
    } catch (e) {
      console.error('Error reading user progress:', e);
      return getDefaultUserProgress();
    }
  },

  setUserProgress: (progress) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving user progress:', e);
    }
  },

  // Spaced Repetition
  getSpacedRepetitionData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SPACED_REPETITION);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error reading spaced repetition data:', e);
      return {};
    }
  },

  setSpacedRepetitionData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPACED_REPETITION, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving spaced repetition data:', e);
    }
  },

  // User Stats
  getUserStats: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      return data ? JSON.parse(data) : getDefaultUserStats();
    } catch (e) {
      console.error('Error reading user stats:', e);
      return getDefaultUserStats();
    }
  },

  setUserStats: (stats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving user stats:', e);
    }
  },

  // Achievements
  getAchievements: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : getDefaultAchievements();
    } catch (e) {
      console.error('Error reading achievements:', e);
      return getDefaultAchievements();
    }
  },

  setAchievements: (achievements) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Error saving achievements:', e);
    }
  },

  // Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : getDefaultSettings();
    } catch (e) {
      console.error('Error reading settings:', e);
      return getDefaultSettings();
    }
  },

  setSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  // Lesson Progress
  getLessonProgress: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error reading lesson progress:', e);
      return {};
    }
  },

  setLessonProgress: (progress) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving lesson progress:', e);
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  },
};

function getDefaultUserProgress() {
  return {
    username: 'Learner',
    level: 1,
    points: 0,
    streak: 0,
    lastActivityDate: new Date().toISOString(),
    totalLearningMinutes: 0,
    vocabularyLearned: [],
  };
}

function getDefaultUserStats() {
  return {
    totalQuizzesTaken: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    averageAccuracy: 0,
    longestStreak: 0,
    currentStreak: 0,
    lessonsCompleted: 0,
    totalLearningTime: 0,
    dailyStats: {}, // { 'YYYY-MM-DD': { points, quizzes, correct } }
  };
}

function getDefaultAchievements() {
  return {
    earned: [],
    unlocked: {
      'first-step': false,
      'quick-learner': false,
      'vocabulary-master': false,
      'quiz-champion': false,
      'streak-warrior': false,
      'lesson-complete': false,
      'hundred-accuracy': false,
      'night-owl': false,
    },
  };
}

function getDefaultSettings() {
  return {
    darkMode: true,
    soundEnabled: true,
    pronunciationEnabled: true,
    notifications: true,
    language: 'en',
    difficulty: 'medium',
  };
}

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Complete your first lesson',
    icon: '👣',
    points: 10,
  },
  {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Learn 10 vocabulary words',
    icon: '⚡',
    points: 25,
  },
  {
    id: 'vocabulary-master',
    name: 'Vocabulary Master',
    description: 'Learn 50+ vocabulary words',
    icon: '📚',
    points: 100,
  },
  {
    id: 'quiz-champion',
    name: 'Quiz Champion',
    description: 'Get 100% accuracy on 5 quizzes',
    icon: '🏆',
    points: 50,
  },
  {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    points: 75,
  },
  {
    id: 'lesson-complete',
    name: 'Lesson Complete',
    description: 'Complete all 5 lessons',
    icon: '📖',
    points: 150,
  },
  {
    id: 'hundred-accuracy',
    name: 'Perfect Shot',
    description: 'Get 100% accuracy on a lesson quiz',
    icon: '🎯',
    points: 40,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Learn past midnight',
    icon: '🌙',
    points: 20,
  },
];
