const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;

export const pronunciation = {
  speak: (text, onStart = null, onEnd = null) => {
    if (!SpeechSynthesisUtterance) {
      console.warn('Speech Synthesis API not supported');
      return false;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      if (onStart) utterance.onstart = onStart;
      if (onEnd) utterance.onend = onEnd;

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Error speaking:', error);
      return false;
    }
  },

  stopSpeaking: () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking: () => {
    return window.speechSynthesis && window.speechSynthesis.speaking;
  },

  startListening: (onResult, onError) => {
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported');
      if (onError) onError('Speech Recognition not supported');
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          transcript += transcriptSegment;
          if (event.results[i].isFinal) {
            if (onResult) {
              onResult({
                transcript: transcript.toLowerCase(),
                confidence: event.results[i][0].confidence,
                isFinal: true,
              });
            }
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
      };

      recognition.start();
      return recognition;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) onError(error.message);
      return null;
    }
  },

  stopListening: (recognition) => {
    if (recognition) {
      recognition.stop();
    }
  },

  isSupported: {
    speech: () => !!SpeechSynthesisUtterance,
    recognition: () => !!SpeechRecognition,
  },
};

// Phonetic comparison helper
export const comparePronunciation = (spoken, expected, threshold = 0.7) => {
  const normalize = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '');
  };

  const normalizedSpoken = normalize(spoken);
  const normalizedExpected = normalize(expected);

  if (normalizedSpoken === normalizedExpected) {
    return { match: true, similarity: 1, feedback: 'Perfect!' };
  }

  // Simple Levenshtein distance for similarity
  const similarity = calculateSimilarity(normalizedSpoken, normalizedExpected);

  if (similarity >= threshold) {
    return {
      match: true,
      similarity,
      feedback: 'Good! Close pronunciation.',
    };
  }

  return {
    match: false,
    similarity,
    feedback: `Try again. Expected: "${expected}"`,
  };
};

const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const getEditDistance = (s1, s2) => {
  const costs = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
};
