import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Zap, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

const AchievementCard = ({ achievement, unlocked }) => (
  <motion.div
    className={`text-center p-4 rounded-lg border-2 transition-all ${
      unlocked
        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
        : 'bg-gray-800 border-gray-700'
    }`}
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-4xl mb-2">{achievement.icon}</div>
    <p className="font-semibold text-sm text-white">{achievement.name}</p>
    <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
    {unlocked && <p className="text-xs text-yellow-400 mt-2 font-bold">+{achievement.points} pts</p>}
  </motion.div>
);

const Dashboard = () => {
  const { userProgress, userStats, achievements, achievementsList, updateStreak } = useApp();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const nextLevelPoints = (userProgress.level * 500) - userProgress.points;

  return (
    <div className="pb-24">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold mb-2">Welcome, {userProgress.username}! 👋</h2>
              <p className="text-gray-300">Keep practicing to master English!</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-400 mb-2">Level {userProgress.level}</div>
              <p className="text-sm text-gray-400">{nextLevelPoints} points to next level</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{
                width: `${((userProgress.points % 500) / 500) * 100}%`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${((userProgress.points % 500) / 500) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Star}
          label="Total Points"
          value={userProgress.points}
          color="bg-blue-600"
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${userProgress.streak} days`}
          color="bg-orange-600"
        />
        <StatCard
          icon={Zap}
          label="Quizzes Completed"
          value={userStats.totalQuizzesTaken}
          color="bg-yellow-600"
        />
        <StatCard
          icon={Trophy}
          label="Accuracy"
          value={`${userStats.averageAccuracy}%`}
          color="bg-green-600"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-bold mb-4 text-white">Learning Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Lessons Completed</span>
              <span className="font-bold text-blue-400">{userStats.lessonsCompleted}/5</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(userStats.lessonsCompleted / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-300">Cards for Review</span>
              <span className="font-bold text-purple-400">
                {userStats.totalQuizzesTaken > 0 ? 'Ready' : 'Start learning!'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-bold mb-4 text-white">Today's Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Quiz Questions</span>
              <span className="font-bold text-green-400">
                {userStats.dailyStats[new Date().toISOString().split('T')[0]]?.quizzes || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Correct Answers</span>
              <span className="font-bold text-green-400">
                {userStats.dailyStats[new Date().toISOString().split('T')[0]]?.correct || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-300">Daily Points</span>
              <span className="font-bold text-yellow-400">
                +{userStats.dailyStats[new Date().toISOString().split('T')[0]]?.points || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-white">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievementsList.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={achievements.unlocked[achievement.id]}
            />
          ))}
        </div>
      </motion.div>

      {/* Motivational Message */}
      <motion.div
        className="mt-12 text-center bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-lg text-gray-300">
          {userProgress.streak >= 7
            ? '🔥 Amazing streak! Keep it up!'
            : userProgress.streak >= 3
            ? '⚡ Great progress! Your dedication is paying off!'
            : 'Start your learning journey today! 🚀'}
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
