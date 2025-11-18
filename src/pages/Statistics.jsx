import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Target, TrendingUp, Calendar, Book } from 'lucide-react';

const Statistics = () => {
  const { userStats, userProgress, spacedRepetitionDeck, vocabularyData } = useApp();

  // Prepare data for charts
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = userStats.dailyStats[dateStr] || { correct: 0, quizzes: 0, points: 0 };

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        correct: dayData.correct,
        total: dayData.quizzes,
        points: dayData.points,
        accuracy: dayData.quizzes > 0 ? Math.round((dayData.correct / dayData.quizzes) * 100) : 0,
      });
    }
    return data;
  };

  const getCategoryStats = () => {
    const categories = {};
    vocabularyData.forEach(vocab => {
      const card = spacedRepetitionDeck.cards.get(vocab.id);
      if (card && card.reviewCount > 0) {
        categories[vocab.category] = {
          ...categories[vocab.category],
          [vocab.category]: (categories[vocab.category]?.[vocab.category] || 0) + 1,
          accuracy: (categories[vocab.category]?.accuracy || 0) + card.getAccuracy(),
          reviewed: (categories[vocab.category]?.reviewed || 0) + 1,
        };
      }
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      value: data.reviewed,
      accuracy: Math.round(data.accuracy / data.reviewed),
    }));
  };

  const accuracyData = getCategoryStats();
  const chartData = getLast7DaysData();

  // Calculate stats
  const totalLearned = vocabularyData.filter(
    vocab => spacedRepetitionDeck.cards.get(vocab.id)?.reviewCount > 0
  ).length;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const StatCard = ({ icon: Icon, label, value, subValue }) => (
    <motion.div
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-blue-600/20">
          <Icon size={24} className="text-blue-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="pb-24">
      <h1 className="text-4xl font-bold mb-8 text-white">Learning Statistics</h1>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Target}
          label="Total Accuracy"
          value={`${userStats.averageAccuracy}%`}
          subValue={`${userStats.correctAnswers}/${userStats.totalAnswers} correct`}
        />
        <StatCard
          icon={Book}
          label="Quizzes Taken"
          value={userStats.totalQuizzesTaken}
          subValue="all time"
        />
        <StatCard
          icon={TrendingUp}
          label="Vocabulary Learned"
          value={totalLearned}
          subValue={`of ${vocabularyData.length} words`}
        />
        <StatCard
          icon={Calendar}
          label="Lessons Completed"
          value={userStats.lessonsCompleted}
          subValue="5 available"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Chart */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Last 7 Days Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="correct" fill="#10B981" name="Correct" />
              <Bar dataKey="total" fill="#3B82F6" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Accuracy Trend */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Accuracy Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
                name="Accuracy %"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Category Distribution</h2>
          {accuracyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-12">No data yet. Start learning!</p>
          )}
        </motion.div>

        {/* Points Distribution */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Daily Points</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
              />
              <Bar dataKey="points" fill="#F59E0B" name="Points" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      {accuracyData.length > 0 && (
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Category Performance</h2>
          <div className="space-y-3">
            {accuracyData.map((category, index) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300 font-medium">{category.name}</span>
                  <span className="text-sm text-gray-400">
                    {category.accuracy}% • {category.value} words
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full`}
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.accuracy}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Total Study Time</p>
            <p className="text-2xl font-bold text-white">
              {Math.round(userStats.totalLearningTime / 60)} hours
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Average Session</p>
            <p className="text-2xl font-bold text-white">
              {userStats.totalQuizzesTaken > 0
                ? Math.round(userStats.totalLearningTime / userStats.totalQuizzesTaken)
                : 0}{' '}
              min
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Level</p>
            <p className="text-2xl font-bold text-white">{userProgress.level}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics;
