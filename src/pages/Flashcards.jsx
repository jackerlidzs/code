import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight, RotateCcw, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUALITIES } from '../utils/spacedRepetition';
import { pronunciation } from '../utils/pronunciation';

const Flashcards = () => {
  const { vocabularyData, spacedRepetitionDeck, updateSpacedRepetitionCard, addPoints } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsForReview, setCardsForReview] = useState([]);
  const [viewMode, setViewMode] = useState('review'); // review or browse
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const ready = spacedRepetitionDeck.getCardsForReview();
    setCardsForReview(ready);
    if (ready.length === 0) {
      setViewMode('browse');
    }
  }, [spacedRepetitionDeck]);

  const currentCard =
    viewMode === 'review' && cardsForReview.length > 0
      ? spacedRepetitionDeck.cards.get(cardsForReview[currentIndex].cardId)
      : selectedCategory
      ? vocabularyData.filter(v => v.category === selectedCategory)[currentIndex]
      : vocabularyData[currentIndex];

  const totalCards =
    viewMode === 'review'
      ? cardsForReview.length
      : selectedCategory
      ? vocabularyData.filter(v => v.category === selectedCategory).length
      : vocabularyData.length;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSpeak = () => {
    if (!currentCard) return;
    setIsSpeaking(true);
    pronunciation.speak(currentCard.word, null, () => setIsSpeaking(false));
  };

  const handleQuality = (quality) => {
    if (viewMode !== 'review' || !cardsForReview[currentIndex]) return;

    const cardId = cardsForReview[currentIndex].cardId;
    updateSpacedRepetitionCard(cardId, quality);

    const points = quality >= QUALITIES.OK ? 10 : 5;
    addPoints(points, 'flashcard');

    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedCategory(null);
  };

  const categories = [...new Set(vocabularyData.map(v => v.category))];

  if (viewMode === 'browse' && !selectedCategory) {
    return (
      <div className="pb-24">
        <h1 className="text-4xl font-bold mb-8 text-white">Vocabulary Browser</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(category => {
            const count = vocabularyData.filter(v => v.category === category).length;
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center border border-gray-700 hover:border-blue-500 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-3xl mb-2">📖</p>
                <p className="font-semibold text-white">{category}</p>
                <p className="text-sm text-gray-400 mt-1">{count} words</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="pb-24 text-center">
        <p className="text-gray-400">No cards to display</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">
            {viewMode === 'review' ? 'Spaced Repetition Review' : 'Vocabulary Browser'}
          </h1>
          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                handleReset();
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Progress Info */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">
                Card {currentIndex + 1} of {totalCards}
              </p>
              {viewMode === 'review' && (
                <p className="text-xs text-gray-500 mt-1">
                  Difficulty: {currentCard?.reviewCount === 0 ? 'New' : 'Review'}
                </p>
              )}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
          <div className="mt-3 bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <motion.div
        className="mb-8 perspective"
        onClick={() => setIsFlipped(!isFlipped)}
        layout
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 rounded-2xl p-12 min-h-96 flex flex-col justify-center items-center cursor-pointer shadow-2xl"
        >
          <div style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
            {!isFlipped ? (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">English Word</p>
                <h2 className="text-5xl font-bold text-white mb-4">{currentCard.word}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak();
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isSpeaking
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  } transition-colors`}
                  disabled={isSpeaking}
                >
                  <Volume2 size={20} />
                  {isSpeaking ? 'Speaking...' : 'Pronounce'}
                </button>
                <p className="text-gray-500 text-sm mt-4 italic">{currentCard.pronunciation}</p>
                <p className="text-gray-500 text-sm mt-6">Click to reveal definition →</p>
              </div>
            ) : (
              <div className="text-center" style={{ transform: 'rotateY(180deg)' }}>
                <p className="text-gray-400 text-sm mb-4">Definition</p>
                <p className="text-2xl font-semibold text-white mb-6">{currentCard.definition}</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-sm text-gray-300 mb-2 font-semibold">Example:</p>
                  <p className="text-gray-300 italic">"{currentCard.example}"</p>
                </div>
                <p className="text-gray-500 text-sm mt-6">← Click to see word</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation & Feedback */}
      <div className="space-y-4">
        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <motion.button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} /> Previous
          </motion.button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
          >
            <Lightbulb size={20} /> {isFlipped ? 'Hide' : 'Show'} Answer
          </button>

          <motion.button
            onClick={handleNext}
            disabled={currentIndex === totalCards - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Quality Buttons (for review mode) */}
        {viewMode === 'review' && (
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => handleQuality(QUALITIES.DIFFICULT)}
              className="px-4 py-3 bg-red-600/20 border border-red-500 hover:bg-red-600/40 rounded-lg text-red-400 font-semibold transition-all"
            >
              Difficult
            </button>
            <button
              onClick={() => handleQuality(QUALITIES.OK)}
              className="px-4 py-3 bg-yellow-600/20 border border-yellow-500 hover:bg-yellow-600/40 rounded-lg text-yellow-400 font-semibold transition-all"
            >
              OK
            </button>
            <button
              onClick={() => handleQuality(QUALITIES.EASY)}
              className="px-4 py-3 bg-green-600/20 border border-green-500 hover:bg-green-600/40 rounded-lg text-green-400 font-semibold transition-all"
            >
              Easy
            </button>
          </motion.div>
        )}
      </div>

      {/* Card Info */}
      <motion.div
        className="mt-8 bg-gray-800 rounded-lg p-4 border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Category</p>
            <p className="text-white font-semibold">{currentCard.category}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Difficulty</p>
            <p className="text-white font-semibold">{'⭐'.repeat(currentCard.difficulty)}</p>
          </div>
          {viewMode === 'review' && (
            <>
              <div>
                <p className="text-gray-400 text-sm">Reviews</p>
                <p className="text-white font-semibold">{currentCard.reviewCount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Accuracy</p>
                <p className="text-white font-semibold">{currentCard.getAccuracy()}%</p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcards;
