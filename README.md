# EnglishMaster - Modern English Learning App

A production-ready English learning application built with React 18, featuring spaced repetition, gamification, and interactive quizzes.

## 🚀 Features

### Core Learning Features
- **Spaced Repetition System**: Implements the SM-2 algorithm for optimal vocabulary retention
- **Flashcard System**: Interactive flashcards with pronunciation support
- **Multiple Quiz Types**: 
  - Multiple Choice Questions (MCQ)
  - Fill-in-the-blanks
  - Listening exercises
- **50+ Vocabulary Words**: Comprehensive vocabulary covering common categories
- **5+ Organized Lessons**: Structured lessons by difficulty level
- **Web Speech API Integration**: Pronunciation support with Web Speech API

### Gamification & Progress
- **Points & Levels**: Earn points for completing activities and level up
- **Achievement System**: Unlock 8+ unique achievements
- **Learning Streaks**: Track daily learning consistency with streak counter
- **Category Organization**: Words organized by 13+ categories
- **Progress Tracking**: Monitor learning across lessons and vocabulary

### Dashboard & Analytics
- **Statistics Dashboard**: Comprehensive charts and analytics with Recharts
- **Daily Activity Tracking**: View daily learning stats and accuracy trends
- **Category Performance**: Performance metrics by vocabulary category
- **Accuracy Trends**: Visual representation of learning progress

### User Experience
- **Dark Mode**: Modern dark theme with smooth transitions
- **Responsive Design**: Mobile-first responsive design for all devices
- **Smooth Animations**: Framer Motion animations throughout
- **Local Storage**: Persist all data using browser's localStorage API
- **Accessibility**: Inclusive design with proper ARIA labels

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks and context API
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: React charts library for visualizations
- **Lucide React**: Beautiful, consistent icons
- **Vite**: Fast build tool and dev server
- **Web Speech API**: Browser-native speech recognition and synthesis

## 📋 Project Structure

```
src/
├── components/          # Reusable components
│   └── Navigation.jsx  # Bottom navigation bar
├── pages/              # Page components
│   ├── Dashboard.jsx   # Home/dashboard
│   ├── Flashcards.jsx  # Spaced repetition cards
│   ├── Quiz.jsx        # Quiz interface
│   ├── Lessons.jsx     # Lesson management
│   ├── Statistics.jsx  # Analytics dashboard
│   └── Settings.jsx    # User settings
├── context/            # Global state management
│   └── AppContext.jsx  # App-wide context
├── data/               # Static data
│   └── vocabulary.js   # Vocabulary and lessons data
├── utils/              # Utility functions
│   ├── spacedRepetition.js # SM-2 algorithm
│   ├── pronunciation.js    # Speech API utilities
│   └── storage.js          # localStorage management
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎓 Vocabulary & Content

The app includes:
- **50+ vocabulary words** across multiple categories
- **13 vocabulary categories**: Greetings, Verbs, Animals, Places, Adjectives, Objects, Elements, Nature, Emotions, Expressions, Politeness, Requests, Questions
- **5 structured lessons** ranging from beginner to advanced
- **Difficulty levels**: Words and lessons have 4 difficulty levels
- **Example sentences**: Every word includes contextual examples

## 🔧 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open in your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` directory.

## 📚 Using the App

### Dashboard
- View your overall progress and stats
- Check your current streak and level
- See available achievements

### Flashcards
- Learn vocabulary using spaced repetition
- Click to reveal definitions
- Rate difficulty (Easy/OK/Difficult)
- Browse by category

### Quiz Mode
- Take random quizzes with 5 questions
- Complete lesson-specific quizzes
- Get immediate feedback with explanations
- Track your accuracy

### Lessons
- Complete structured lessons
- Learn vocabulary in context
- Test knowledge with lesson quizzes
- Track progress through lessons

### Statistics
- View 7-day learning trends
- See accuracy by category
- Track daily points and activity
- Monitor vocabulary progress

### Settings
- Customize username
- Enable/disable sound and pronunciation
- Adjust difficulty level
- Reset all data if needed

## 🧠 Spaced Repetition Algorithm

The app implements the SM-2 (SuperMemo 2) algorithm with these intervals:
- **New cards**: Review after 1 day
- **Repetition 1**: Review after 1 day
- **Repetition 2**: Review after 3 days
- **Repetition 3**: Review after 7 days
- **Repetition 4**: Review after 14 days
- **Repetition 5+**: Review after 30 days

Quality ratings (0-5 scale):
- **0-2**: Blackout/Incorrect - Reset repetition
- **3**: Difficult - Reduce ease factor
- **4**: OK - Increase interval
- **5**: Easy - Increase interval faster

## 💾 Data Persistence

All user data is stored in localStorage under these keys:
- `em_user_progress`: User level, points, streak
- `em_user_stats`: Quiz statistics and accuracy
- `em_spaced_repetition`: Flashcard review data
- `em_achievements`: Unlocked achievements
- `em_lesson_progress`: Completed lessons
- `em_settings`: User preferences

Data persists between sessions and can be cleared from settings.

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` to customize:
- Primary color: `#3B82F6` (blue)
- Secondary color: `#10B981` (green)
- Accent color: `#F59E0B` (amber)

### Adding Vocabulary
Edit `src/data/vocabulary.js` to add:
- New vocabulary words
- New lessons
- New categories

### Adjusting Difficulty
Modify INTERVALS in `src/utils/spacedRepetition.js` to change review schedules.

## 🚀 Performance Optimizations

- React.memo for component optimization
- Lazy loading of pages
- Efficient state management with Context
- Optimized animations with Framer Motion
- CSS-in-JS with TailwindCSS

## ♿ Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Semantic HTML structure
- Color contrast compliance

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Known Limitations

- Web Speech API support varies by browser (works best in Chrome)
- Speech Recognition requires HTTPS in production
- Large datasets may impact performance

## 🔮 Future Enhancements

- [ ] Multiple languages
- [ ] Listening comprehension exercises
- [ ] Speaking practice with feedback
- [ ] Social features (leaderboards, sharing)
- [ ] Mobile app (React Native)
- [ ] Backend integration
- [ ] Offline mode
- [ ] Custom vocabulary import

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Learning! 🎓📚**
