import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, AlertCircle, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings = ({ onPageChange }) => {
  const {
    settings,
    updateSettings,
    userProgress,
    setUserProgress,
    resetAllData,
  } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [username, setUsername] = useState(userProgress.username);

  const handleUpdateUsername = () => {
    setUserProgress(prev => ({
      ...prev,
      username,
    }));
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
  };

  const SettingItem = ({ icon: Icon, title, description, children }) => (
    <motion.div
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-grow">
          {Icon && (
            <div className="p-2 rounded-lg bg-blue-600/20 mt-0.5">
              <Icon size={20} className="text-blue-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );

  const Toggle2 = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="pb-24 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-white">Settings</h1>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your username"
            />
            <button
              onClick={handleUpdateUsername}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sound Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Audio & Speech</h2>

        <SettingItem
          icon={SettingsIcon}
          title="Sound Effects"
          description="Enable/disable sound effects during quizzes"
        >
          <Toggle2
            enabled={settings.soundEnabled}
            onChange={() => updateSettings('soundEnabled', !settings.soundEnabled)}
          />
        </SettingItem>

        <SettingItem
          icon={SettingsIcon}
          title="Pronunciation"
          description="Enable word pronunciation with Web Speech API"
        >
          <Toggle2
            enabled={settings.pronunciationEnabled}
            onChange={() =>
              updateSettings('pronunciationEnabled', !settings.pronunciationEnabled)
            }
          />
        </SettingItem>
      </motion.div>

      {/* Display Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Display</h2>

        <SettingItem
          icon={SettingsIcon}
          title="Notifications"
          description="Get notifications for learning streaks and achievements"
        >
          <Toggle2
            enabled={settings.notifications}
            onChange={() => updateSettings('notifications', !settings.notifications)}
          />
        </SettingItem>
      </motion.div>

      {/* Learning Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Learning</h2>

        <SettingItem
          title="Difficulty Level"
          description="Choose your preferred difficulty for new content"
        >
          <select
            value={settings.difficulty}
            onChange={e => updateSettings('difficulty', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </SettingItem>

        <SettingItem
          title="Language"
          description="Select your learning language"
        >
          <select
            value={settings.language}
            onChange={e => updateSettings('language', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </SettingItem>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Data Management</h2>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-yellow-600/20 mt-0.5">
              <AlertCircle size={20} className="text-yellow-400" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-white mb-2">Reset All Data</h3>
              <p className="text-sm text-gray-400 mb-4">
                This will permanently delete all your learning progress, achievements, and
                statistics. This action cannot be undone.
              </p>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-semibold transition-colors"
                >
                  Reset All Data
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <h2 className="text-lg font-bold text-white mb-4">About EnglishMaster</h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            <strong className="text-white">Version:</strong> 1.0.0
          </p>
          <p>
            <strong className="text-white">Features:</strong>
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Spaced Repetition Algorithm (SM-2)</li>
            <li>Multiple Quiz Types (MCQ, Fill-blanks, Listening)</li>
            <li>50+ Vocabulary Words</li>
            <li>5+ Organized Lessons</li>
            <li>Gamification System</li>
            <li>Statistics Dashboard</li>
            <li>Web Speech API Support</li>
            <li>Dark Mode Support</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">Built with:</strong> React 18, TailwindCSS, Framer
            Motion, Recharts
          </p>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">Quick Tips</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>✓ Use spaced repetition cards for effective vocabulary learning</li>
          <li>✓ Complete lessons to unlock achievements and earn points</li>
          <li>✓ Take quizzes to test your knowledge and improve accuracy</li>
          <li>✓ Maintain a learning streak by practicing daily</li>
          <li>✓ Check your statistics to track progress and identify weak areas</li>
          <li>✓ Use pronunciation feature to improve your speaking skills</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Settings;
