import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Lessons = () => {
  const { lessonData, vocabularyData, lessonProgress, completeLesson, addPoints } = useApp();
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleStartLesson = (lessonId) => {
    setSelectedLesson(lessonId);
  };

  const handleCompleteLesson = (lessonId) => {
    completeLesson(lessonId);
    addPoints(50, 'lesson');
    setExpandedLesson(null);
  };

  const getVocabularyForLesson = (lesson) => {
    return lesson.vocabularyIds.map(id => vocabularyData.find(v => v.id === id)).filter(Boolean);
  };

  const isLessonCompleted = (lessonId) => {
    return lessonProgress[lessonId]?.completed;
  };

  if (selectedLesson) {
    const lesson = lessonData.find(l => l.id === selectedLesson);
    const vocab = getVocabularyForLesson(lesson);

    return (
      <div className="pb-24">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedLesson(null)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors mb-4"
          >
            ← Back to Lessons
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">{lesson.title}</h1>
          <p className="text-gray-300 text-lg">{lesson.description}</p>
        </div>

        {/* Lesson Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Duration</p>
            <p className="text-2xl font-bold text-white">{lesson.duration} min</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Difficulty</p>
            <p className="text-2xl font-bold text-white">{'⭐'.repeat(lesson.difficulty)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Vocabulary</p>
            <p className="text-2xl font-bold text-white">{vocab.length} words</p>
          </div>
        </div>

        {/* Vocabulary Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Vocabulary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vocab.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-lg font-bold text-white">{word.word}</p>
                    <p className="text-sm text-gray-400">{word.pronunciation}</p>
                  </div>
                  <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                    {word.category}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{word.definition}</p>
                <p className="text-gray-400 italic text-sm">"{word.example}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Lesson Quiz</h2>
          <div className="space-y-4">
            {lesson.quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-white">Question {index + 1}</p>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {quiz.type}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{quiz.question}</p>
                <div className="flex gap-2 flex-wrap">
                  {quiz.options &&
                    quiz.options.slice(0, 3).map((opt, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                      >
                        {opt}
                      </span>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Complete Lesson Button */}
        <motion.button
          onClick={() => handleCompleteLesson(selectedLesson)}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-bold text-lg transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Check size={24} /> Complete Lesson
        </motion.button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <h1 className="text-4xl font-bold mb-8 text-white">Lessons</h1>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessonData.map((lesson, index) => {
          const isCompleted = isLessonCompleted(lesson.id);
          const vocab = getVocabularyForLesson(lesson);

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
              className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
                isCompleted
                  ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/50'
                  : 'bg-gray-800 border-gray-700 hover:border-blue-500/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {isCompleted && <Check className="text-green-400" size={24} />}
                    {lesson.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">{lesson.description}</p>
                </div>
                <div className="text-3xl">{isCompleted ? '✅' : '📖'}</div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-bold text-white">{lesson.duration}m</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Difficulty</p>
                  <p className="text-sm font-bold text-white">
                    {'⭐'.repeat(lesson.difficulty)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Words</p>
                  <p className="text-sm font-bold text-white">{vocab.length}</p>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedLesson === lesson.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-700 pt-4 mt-4"
                >
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {vocab.slice(0, 5).map(word => (
                        <span
                          key={word.id}
                          className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded"
                        >
                          {word.word}
                        </span>
                      ))}
                      {vocab.length > 5 && (
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          +{vocab.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={e => {
                        e.stopPropagation();
                        handleStartLesson(lesson.id);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={16} /> {isCompleted ? 'Review' : 'Start'}
                    </motion.button>
                    {!isCompleted && (
                      <motion.button
                        onClick={e => {
                          e.stopPropagation();
                          handleCompleteLesson(lesson.id);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-semibold transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Skip & Complete
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Progress</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Lessons Completed</span>
          <span className="font-bold text-blue-400">
            {Object.values(lessonProgress).filter(l => l.completed).length}/{lessonData.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(Object.values(lessonProgress).filter(l => l.completed).length / lessonData.length) * 100}%`,
            }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Lessons;
