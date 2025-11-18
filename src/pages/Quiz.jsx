import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Shuffle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Quiz = () => {
  const { vocabularyData, lessonData, addPoints, recordQuizAnswer, updateStreak } = useApp();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizState, setQuizState] = useState('selection'); // selection, quiz, result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const currentLesson = selectedLesson ? lessonData.find(l => l.id === selectedLesson) : null;
  const currentQuestion = currentLesson?.quizzes[currentQuestionIndex];

  // Generate random MCQ
  const generateMCQQuiz = () => {
    const quizzes = [];
    const shuffledVocab = [...vocabularyData].sort(() => Math.random() - 0.5).slice(0, 5);

    shuffledVocab.forEach(vocab => {
      const wrongAnswers = vocabularyData
        .filter(v => v.id !== vocab.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.word);

      const options = [vocab.word, ...wrongAnswers].sort(() => Math.random() - 0.5);

      quizzes.push({
        type: 'MCQ',
        question: `What is the definition of "${vocab.word}"?`,
        options,
        correctAnswer: vocab.definition,
        word: vocab.word,
        vocabulary: vocab,
      });
    });

    return quizzes;
  };

  // Start random quiz
  const handleStartRandomQuiz = () => {
    const randomQuizzes = generateMCQQuiz();
    setSelectedLesson({ quizzes: randomQuizzes, title: 'Random Quiz' });
    setQuizState('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSelectLesson = (lessonId) => {
    setSelectedLesson(lessonId);
    setQuizState('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect =
      currentQuestion.type === 'MCQ'
        ? answer === currentQuestion.options.findIndex(opt => opt === currentQuestion.correctAnswer)
        : answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();

    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);
    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        userAnswer: answer,
        correct: isCorrect,
        explanation: currentQuestion.explanation,
      },
    ]);

    recordQuizAnswer(isCorrect);
    addPoints(isCorrect ? 20 : 5, 'quiz');
    updateStreak();
  };

  const handleNextQuestion = () => {
    const quizzes = selectedLesson.quizzes || lessonData.find(l => l.id === selectedLesson).quizzes;
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizState('result');
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizState('quiz');
  };

  const handleBackToSelection = () => {
    setQuizState('selection');
    setSelectedLesson(null);
  };

  // Selection View
  if (quizState === 'selection') {
    return (
      <div className="pb-24">
        <h1 className="text-4xl font-bold mb-8 text-white">Quiz Mode</h1>

        {/* Random Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-8 cursor-pointer hover:border-purple-400 transition-all"
          onClick={handleStartRandomQuiz}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Random Quiz</h2>
              <p className="text-gray-300">5 random questions from all categories</p>
            </div>
            <div className="text-5xl">🎲</div>
          </div>
        </motion.div>

        {/* Lesson Quizzes */}
        <h2 className="text-2xl font-bold mb-4 text-white">Lesson Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonData.map(lesson => (
            <motion.div
              key={lesson.id}
              onClick={() => handleSelectLesson(lesson.id)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-gray-750 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-bold text-white mb-2">{lesson.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{lesson.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                  {lesson.quizzes.length} questions
                </span>
                <span className="text-xs text-gray-500">{lesson.difficulty} difficulty</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz View
  if (quizState === 'quiz' && currentQuestion) {
    const quizzes = selectedLesson.quizzes || lessonData.find(l => l.id === selectedLesson).quizzes;
    const progress = ((currentQuestionIndex + 1) / quizzes.length) * 100;

    return (
      <div className="pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">
              {selectedLesson.title || 'Quiz'}
            </h1>
            <button
              onClick={handleBackToSelection}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
            >
              Exit
            </button>
          </div>

          {/* Progress */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">
                Question {currentQuestionIndex + 1} of {quizzes.length}
              </span>
              <span className="text-blue-400 font-semibold">{score} correct</span>
            </div>
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h2>

          {currentQuestion.type === 'MCQ' ? (
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.options.findIndex(o => o === currentQuestion.correctAnswer);
                let buttonClass = 'bg-gray-700 hover:bg-gray-600 border-gray-600';

                if (showResult) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-600/20 border-green-500 text-green-300';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-600/20 border-red-500 text-red-300';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => !showResult && handleSelectAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-lg border-2 text-left font-semibold transition-all ${buttonClass} ${
                      isSelected ? 'border-blue-500' : ''
                    }`}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{option}</span>
                      {showResult && isCorrect && <CheckCircle className="text-green-400" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="text-red-400" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            // Fill blanks
            <div>
              <input
                type="text"
                placeholder="Type your answer..."
                disabled={showResult}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                onKeyPress={e => e.key === 'Enter' && !showResult && handleSelectAnswer(e.target.value)}
                onChange={e => {
                  if (!showResult) setSelectedAnswer(e.target.value);
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Result Message */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 p-4 rounded-lg border-l-4 ${
                answers[currentQuestionIndex].correct
                  ? 'bg-green-600/20 border-green-500'
                  : 'bg-red-600/20 border-red-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {answers[currentQuestionIndex].correct ? (
                  <>
                    <CheckCircle className="text-green-400" />
                    <span className="font-bold text-green-300">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-400" />
                    <span className="font-bold text-red-300">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {showResult && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNextQuestion}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors"
          >
            {currentQuestionIndex === quizzes.length - 1 ? 'See Results' : 'Next Question'}
          </motion.button>
        )}
      </div>
    );
  }

  // Results View
  if (quizState === 'result') {
    const quizzes = selectedLesson.quizzes || lessonData.find(l => l.id === selectedLesson).quizzes;
    const accuracy = Math.round((score / quizzes.length) * 100);

    return (
      <div className="pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '📚'}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
          <p className="text-2xl text-blue-400 font-bold mb-2">
            Score: {score}/{quizzes.length}
          </p>
          <p className="text-xl text-gray-300 mb-4">Accuracy: {accuracy}%</p>
        </motion.div>

        {/* Score Breakdown */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 text-left">Review</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {answers.map((answer, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border-l-4 text-left ${
                  answer.correct
                    ? 'bg-green-600/10 border-green-500'
                    : 'bg-red-600/10 border-red-500'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  {answer.correct ? (
                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="text-red-400 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-grow">
                    <p className="font-semibold text-white">{answer.question}</p>
                    <p className="text-sm text-gray-300 mt-1">{answer.explanation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            onClick={handleRetakeQuiz}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shuffle size={20} /> Retake Quiz
          </motion.button>
          <motion.button
            onClick={handleBackToSelection}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Quizzes
          </motion.button>
        </div>
      </div>
    );
  }
};

export default Quiz;
