// Spaced Repetition Algorithm (SM-2)
// Based on the SuperMemo algorithm with simplified intervals

export const INTERVALS = {
  NEW: 0,
  DAY_1: 1,
  DAY_3: 3,
  DAY_7: 7,
  DAY_14: 14,
  DAY_30: 30,
};

export const QUALITIES = {
  BLACKOUT: 0,
  INCORRECT: 2,
  DIFFICULT: 3,
  OK: 4,
  EASY: 5,
};

export class SpacedRepetitionCard {
  constructor(cardId, word) {
    this.cardId = cardId;
    this.word = word;
    this.interval = INTERVALS.NEW;
    this.repetitions = 0;
    this.easeFactor = 2.5;
    this.nextReviewDate = new Date();
    this.lastReviewDate = null;
    this.reviewCount = 0;
    this.correctCount = 0;
  }

  updateProgress(quality) {
    this.lastReviewDate = new Date();
    this.reviewCount++;

    if (quality >= QUALITIES.OK) {
      this.correctCount++;
    }

    if (quality < QUALITIES.OK) {
      this.repetitions = 0;
      this.interval = INTERVALS.DAY_1;
    } else {
      this.repetitions++;
      if (this.repetitions === 1) {
        this.interval = INTERVALS.DAY_1;
      } else if (this.repetitions === 2) {
        this.interval = INTERVALS.DAY_3;
      } else if (this.repetitions === 3) {
        this.interval = INTERVALS.DAY_7;
      } else if (this.repetitions === 4) {
        this.interval = INTERVALS.DAY_14;
      } else {
        this.interval = INTERVALS.DAY_30;
      }
    }

    // Calculate ease factor (simplified SM-2)
    const newEase = this.easeFactor + 0.1 - (5 - quality) * 0.08;
    this.easeFactor = Math.max(1.3, newEase);

    // Set next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + this.interval);
    this.nextReviewDate = nextDate;
  }

  isReadyForReview() {
    return new Date() >= this.nextReviewDate;
  }

  getAccuracy() {
    if (this.reviewCount === 0) return 0;
    return Math.round((this.correctCount / this.reviewCount) * 100);
  }
}

export class SpacedRepetitionDeck {
  constructor(name) {
    this.name = name;
    this.cards = new Map();
  }

  addCard(cardId, word) {
    if (!this.cards.has(cardId)) {
      this.cards.set(cardId, new SpacedRepetitionCard(cardId, word));
    }
  }

  updateCard(cardId, quality) {
    const card = this.cards.get(cardId);
    if (card) {
      card.updateProgress(quality);
    }
  }

  getCardsForReview() {
    const ready = Array.from(this.cards.values()).filter(card => card.isReadyForReview());
    return ready.sort((a, b) => a.nextReviewDate - b.nextReviewDate);
  }

  getStatistics() {
    const cards = Array.from(this.cards.values());
    if (cards.length === 0) {
      return {
        totalCards: 0,
        reviewedCards: 0,
        averageAccuracy: 0,
        cardsReadyForReview: 0,
        totalReviews: 0,
      };
    }

    const reviewedCards = cards.filter(c => c.reviewCount > 0);
    const totalAccuracy = reviewedCards.reduce((sum, c) => sum + c.getAccuracy(), 0);
    const averageAccuracy = reviewedCards.length > 0 ? totalAccuracy / reviewedCards.length : 0;
    const cardsReadyForReview = cards.filter(c => c.isReadyForReview()).length;
    const totalReviews = cards.reduce((sum, c) => sum + c.reviewCount, 0);

    return {
      totalCards: cards.length,
      reviewedCards: reviewedCards.length,
      averageAccuracy: Math.round(averageAccuracy),
      cardsReadyForReview,
      totalReviews,
    };
  }

  resetCard(cardId) {
    const card = this.cards.get(cardId);
    if (card) {
      card.interval = INTERVALS.NEW;
      card.repetitions = 0;
      card.easeFactor = 2.5;
      card.nextReviewDate = new Date();
      card.reviewCount = 0;
      card.correctCount = 0;
    }
  }

  exportToJSON() {
    const cardsData = Array.from(this.cards.entries()).map(([id, card]) => ({
      cardId: id,
      word: card.word,
      interval: card.interval,
      repetitions: card.repetitions,
      easeFactor: card.easeFactor,
      nextReviewDate: card.nextReviewDate.toISOString(),
      lastReviewDate: card.lastReviewDate ? card.lastReviewDate.toISOString() : null,
      reviewCount: card.reviewCount,
      correctCount: card.correctCount,
    }));
    return cardsData;
  }

  importFromJSON(cardsData) {
    cardsData.forEach(data => {
      const card = new SpacedRepetitionCard(data.cardId, data.word);
      card.interval = data.interval;
      card.repetitions = data.repetitions;
      card.easeFactor = data.easeFactor;
      card.nextReviewDate = new Date(data.nextReviewDate);
      card.lastReviewDate = data.lastReviewDate ? new Date(data.lastReviewDate) : null;
      card.reviewCount = data.reviewCount;
      card.correctCount = data.correctCount;
      this.cards.set(data.cardId, card);
    });
  }
}
