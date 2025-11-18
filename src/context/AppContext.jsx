import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, ACHIEVEMENTS_LIST } from '../utils/storage';
import { SpacedRepetitionDeck, QUALITIES } from '../utils/spacedRepetition';
import { vocabularyData, lessonData } from '../data/vocabulary';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [userProgress, setUserProgress] = useState(() => storage.getUserProgress());
  const [userStats, setUserStats] = useState(() => storage.getUserStats());
  const [achievements, setAchievements] = useState(() => storage.getAchievements());
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [lessonProgress, setLessonProgress] = useState(() => storage.getLessonProgress());
  const [spacedRepetitionDeck, setSpacedRepetitionDeck] = useState(() => {
    const deck = new SpacedRepetitionDeck('Main Deck');
    vocabularyData.forEach(vocab => {
      deck.addCard(vocab.id, vocab.word);
    });
    return deck;
  });

  // Persist changes
  useEffect(() => {
    storage.setUserProgress(userProgress);
  }, [userProgress]);

  useEffect(() => {
    storage.setUserStats(userStats);
  }, [userStats]);

  useEffect(() => {
    storage.setAchievements(achievements);
  }, [achievements]);

  useEffect(() => {
    storage.setSettings(settings);
  }, [settings]);

  useEffect(() => {
    storage.setLessonProgress(lessonProgress);
  }, [lessonProgress]);

  // Add points and update stats
  const addPoints = useCallback((points, source = 'quiz') => {
    setUserProgress(prev => ({
      ...prev,
      points: prev.points + points,
      level: Math.floor((prev.points + points) / 500) + 1,
    }));

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    setUserStats(prev => ({
      ...prev,
      dailyStats: {
        ...prev.dailyStats,
        [today]: {
          points: (prev.dailyStats[today]?.points || 0) + points,
          quizzes: (prev.dailyStats[today]?.quizzes || 0) + 1,
          correct: prev.dailyStats[today]?.correct || 0,
        },
      },
    }));
  }, []);

  // Update quiz answer
  const recordQuizAnswer = useCallback((isCorrect) => {
    setUserStats(prev => {
      const today = new Date().toISOString().split('T')[0];
      const correct = isCorrect ? 1 : 0;
      return {
        ...prev,
        totalQuizzesTaken: prev.totalQuizzesTaken + 1,
        correctAnswers: prev.correctAnswers + correct,
        totalAnswers: prev.totalAnswers + 1,
        averageAccuracy: Math.round(
          ((prev.correctAnswers + correct) / (prev.totalAnswers + 1)) * 100
        ),
        dailyStats: {
          ...prev.dailyStats,
          [today]: {
            points: (prev.dailyStats[today]?.points || 0),
            quizzes: (prev.dailyStats[today]?.quizzes || 0) + 1,
            correct: (prev.dailyStats[today]?.correct || 0) + correct,
          },
        },
      };
    });
  }, []);

  // Update spaced repetition card
  const updateSpacedRepetitionCard = useCallback((cardId, quality) => {
    setSpacedRepetitionDeck(prev => {
      prev.updateCard(cardId, quality);
      return { ...prev };
    });
  }, []);

  // Update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = userProgress.lastActivityDate
      ? new Date(userProgress.lastActivityDate).toISOString().split('T')[0]
      : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActivityDate === today) {
      return; // Already updated today
    }

    if (lastActivityDate === yesterdayStr) {
      // Streak continues
      setUserProgress(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActivityDate: new Date().toISOString(),
      }));
    } else {
      // Streak resets
      setUserProgress(prev => ({
        ...prev,
        streak: 1,
        lastActivityDate: new Date().toISOString(),
      }));
    }
  }, [userProgress.lastActivityDate]);

  // Complete lesson
  const completeLesson = useCallback((lessonId) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: {
        completed: true,
        completedDate: new Date().toISOString(),
        accuracy: prev[lessonId]?.accuracy || 100,
      },
    }));

    setUserStats(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));

    checkAchievements();
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback(() => {
    setAchievements(prev => {
      const newAchievements = { ...prev };
      const stats = userStats;
      const progress = userProgress;

      // First Step
      if (stats.lessonsCompleted >= 1 && !prev.unlocked['first-step']) {
        newAchievements.unlocked['first-step'] = true;
        newAchievements.earned.push({
          id: 'first-step',
          unlockedDate: new Date().toISOString(),
        });
      }

      // Quick Learner
      const learnedCount = vocabularyData.filter(vocab =>
        spacedRepetitionDeck.cards.get(vocab.id)?.reviewCount > 0
      ).length;

      if (learnedCount >= 10 && !prev.unlocked['quick-learner']) {
        newAchievements.unlocked['quick-learner'] = true;
        newAchievements.earned.push({
          id: 'quick-learner',
          unlockedDate: new Date().toISOString(),
        });
      }

      // Vocabulary Master
      if (learnedCount >= 50 && !prev.unlocked['vocabulary-master']) {
        newAchievements.unlocked['vocabulary-master'] = true;
        newAchievements.earned.push({
          id: 'vocabulary-master',
          unlockedDate: new Date().toISOString(),
        });
      }

      // Streak Warrior
      if (progress.streak >= 7 && !prev.unlocked['streak-warrior']) {
        newAchievements.unlocked['streak-warrior'] = true;
        newAchievements.earned.push({
          id: 'streak-warrior',
          unlockedDate: new Date().toISOString(),
        });
      }

      // Lesson Complete
      if (stats.lessonsCompleted >= 5 && !prev.unlocked['lesson-complete']) {
        newAchievements.unlocked['lesson-complete'] = true;
        newAchievements.earned.push({
          id: 'lesson-complete',
          unlockedDate: new Date().toISOString(),
        });
        addPoints(150); // Bonus points
      }

      return newAchievements;
    });
  }, [userStats, userProgress, spacedRepetitionDeck, addPoints]);

  // Toggle settings
  const updateSettings = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Clear all data
  const resetAllData = useCallback(() => {
    storage.clearAll();
    setUserProgress(storage.getUserProgress());
    setUserStats(storage.getUserStats());
    setAchievements(storage.getAchievements());
    setSettings(storage.getSettings());
    setLessonProgress(storage.getLessonProgress());
  }, []);

  const value = {
    // State
    userProgress,
    userStats,
    achievements,
    settings,
    lessonProgress,
    spacedRepetitionDeck,
    vocabularyData,
    lessonData,
    achievementsList: ACHIEVEMENTS_LIST,

    // Actions
    addPoints,
    recordQuizAnswer,
    updateSpacedRepetitionCard,
    updateStreak,
    completeLesson,
    checkAchievements,
    updateSettings,
    resetAllData,
    setUserProgress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
