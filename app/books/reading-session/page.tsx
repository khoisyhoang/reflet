'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
}

interface ReadingSession {
  workId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
}

export default function ReadingSessionPage() {
  const searchParams = useSearchParams();
  const workId = searchParams.get('work');

  const [book, setBook] = useState<Book | null>(null);
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionNotes, setSessionNotes] = useState('');
  const [readingMood, setReadingMood] = useState('');
  const [breakReminder, setBreakReminder] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<ReadingSession[]>([]);

  // Creative new features state
  const [environment, setEnvironment] = useState({
    lighting: '',
    noise: '',
    location: '',
    timeOfDay: '',
  });
  const [readingStreak, setReadingStreak] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const [newQuote, setNewQuote] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [sessionTemplate, setSessionTemplate] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [companionMessage, setCompanionMessage] = useState('');

  // Live timer update
  useEffect(() => {
    if (!isReading) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isReading]);

  // Break reminder after 45 minutes
  useEffect(() => {
    if (!isReading || !session) return;

    const elapsedMinutes = (currentTime.getTime() - session.startTime.getTime()) / (1000 * 60);
    if (elapsedMinutes >= 45 && !breakReminder) {
      setBreakReminder(true);
    }
  }, [currentTime, session, isReading, breakReminder]);

  // Load session history
  useEffect(() => {
    if (!workId) return;

    const history = localStorage.getItem(`reading-history-${workId}`);
    if (history) {
      const parsedHistory = JSON.parse(history).map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined,
      }));
      setSessionHistory(parsedHistory);
    }
  }, [workId]);

  // Load additional data
  useEffect(() => {
    if (!workId) return;

    const savedEnvironment = localStorage.getItem(`environment-${workId}`);
    if (savedEnvironment) setEnvironment(JSON.parse(savedEnvironment));

    const savedStreak = localStorage.getItem('reading-streak');
    if (savedStreak) setReadingStreak(parseInt(savedStreak));

    const savedPages = localStorage.getItem(`pages-${workId}`);
    if (savedPages) {
      const { current, total } = JSON.parse(savedPages);
      setCurrentPage(current);
      setTotalPages(total);
    }

    const savedQuotes = localStorage.getItem(`quotes-${workId}`);
    if (savedQuotes) setSavedQuotes(JSON.parse(savedQuotes));

    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
  }, [workId]);

  // Generate companion messages
  useEffect(() => {
    if (!isReading) return;

    const messages = [
      "📚 You're doing great! Keep turning those pages!",
      "🌟 Every page brings you closer to new discoveries!",
      "🎯 Focus is your superpower right now!",
      "✨ Your mind is expanding with every word!",
      "🚀 You're on an incredible reading journey!",
      "💡 New ideas are forming in your brilliant mind!",
      "🎭 The story is coming alive through your imagination!",
      "🌈 Reading is the best adventure!",
      "🎪 Welcome to the wonderful world of words!",
      "⭐ You're creating memories that will last forever!",
    ];

    const interval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCompanionMessage(randomMessage);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isReading]);

  const updateEnvironment = (key: string, value: string) => {
    const newEnv = { ...environment, [key]: value };
    setEnvironment(newEnv);
    localStorage.setItem(`environment-${workId}`, JSON.stringify(newEnv));
  };

  const updateProgress = (current: number, total: number) => {
    setCurrentPage(current);
    setTotalPages(total);
    localStorage.setItem(`pages-${workId}`, JSON.stringify({ current, total }));
  };

  const addQuote = () => {
    if (newQuote.trim()) {
      const updatedQuotes = [...savedQuotes, newQuote.trim()];
      setSavedQuotes(updatedQuotes);
      setNewQuote('');
      localStorage.setItem(`quotes-${workId}`, JSON.stringify(updatedQuotes));
    }
  };

  const getReadingSpeed = () => {
    if (!session || !currentPage || !totalPages) return 0;
    const elapsedMinutes = (currentTime.getTime() - session.startTime.getTime()) / (1000 * 60);
    return Math.round(currentPage / elapsedMinutes);
  };

  const getProgressPercentage = () => {
    if (!totalPages) return 0;
    return Math.round((currentPage / totalPages) * 100);
  };

  const checkAchievements = () => {
    const newAchievements = [...achievements];

    if (sessionHistory.length >= 5 && !newAchievements.includes('📚 Dedicated Reader')) {
      newAchievements.push('📚 Dedicated Reader');
    }
    if (readingStreak >= 7 && !newAchievements.includes('🔥 Week Warrior')) {
      newAchievements.push('🔥 Week Warrior');
    }
    if (getProgressPercentage() >= 50 && !newAchievements.includes('📖 Halfway Hero')) {
      newAchievements.push('📖 Halfway Hero');
    }

    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
      localStorage.setItem('achievements', JSON.stringify(newAchievements));
    }
  };

  // Fetch book details
  useEffect(() => {
    if (!workId) {
      setError('No work ID provided');
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/works/${workId}.json`);
        if (!response.ok) throw new Error('Failed to fetch book details');
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError('Failed to load book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [workId]);

  // Load existing session from localStorage
  useEffect(() => {
    if (workId) {
      const savedSession = localStorage.getItem(`reading-session-${workId}`);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        // Convert date strings back to Date objects
        parsedSession.startTime = new Date(parsedSession.startTime);
        if (parsedSession.endTime) {
          parsedSession.endTime = new Date(parsedSession.endTime);
        }
        setSession(parsedSession);
        setIsReading(!parsedSession.endTime);
      }
    }
  }, [workId]);

  const startSession = () => {
    if (!workId) return;

    const newSession: ReadingSession = {
      workId,
      startTime: new Date(),
    };
    setSession(newSession);
    setIsReading(true);
    localStorage.setItem(`reading-session-${workId}`, JSON.stringify(newSession));
  };

  const endSession = () => {
    if (!session) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - session.startTime.getTime()) / (1000 * 60)); // minutes

    const updatedSession: ReadingSession = {
      ...session,
      endTime,
      duration,
    };

    setSession(updatedSession);
    setIsReading(false);
    localStorage.setItem(`reading-session-${workId}`, JSON.stringify(updatedSession));

    // Add to history
    const newHistory = [...sessionHistory, updatedSession];
    setSessionHistory(newHistory);
    localStorage.setItem(`reading-history-${workId}`, JSON.stringify(newHistory));

    // Update streak and check achievements
    const newStreak = readingStreak + 1;
    setReadingStreak(newStreak);
    localStorage.setItem('reading-streak', newStreak.toString());
    checkAchievements();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getElapsedTime = () => {
    if (!session || !isReading) return '00:00:00';

    const elapsed = currentTime.getTime() - session.startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalReadingTime = () => {
    const completedSessions = sessionHistory.filter(s => s.duration);
    const currentSessionTime = session?.duration || 0;
    const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) + currentSessionTime;

    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading book details...</div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-red-500">{error || 'Book not found'}</p>
            <Link href="/books/search" className="text-primary hover:underline mt-4 inline-block">
              Back to search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/books/search" className="text-primary hover:underline mb-4 inline-block">
            ← Back to search
          </Link>
          <h1 className="text-4xl font-heading font-black text-primary mb-2 tracking-tight">
            Reading Session
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your reading progress and sessions
          </p>
        </div>

        {/* Book Details */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                {book.cover_i ? (
                  <Image
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-4">
                      <h3 className="font-heading font-bold text-foreground text-lg mb-2">
                        {book.title}
                      </h3>
                      {book.author_name && book.author_name.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          by {book.author_name.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {book.title}
              </h2>

              {book.author_name && book.author_name.length > 0 && (
                <p className="text-xl text-muted-foreground mb-4">
                  by {book.author_name.join(', ')}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                {book.first_publish_year && (
                  <span>First published: {book.first_publish_year}</span>
                )}
                {book.edition_count && (
                  <span>{book.edition_count} editions available</span>
                )}
              </div>

              {/* Session Controls */}
              <div className="flex gap-4">
                {!isReading ? (
                  <button
                    onClick={startSession}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Reading Session
                  </button>
                ) : (
                  <button
                    onClick={endSession}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    End Reading Session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Reading Companion */}
        {isReading && companionMessage && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-xl mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-bounce">📖</div>
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                  Your Reading Companion
                </h3>
                <p className="text-foreground/80 italic">{companionMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reading Environment Tracker */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Reading Environment 🌟
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Lighting</label>
              <select
                value={environment.lighting}
                onChange={(e) => updateEnvironment('lighting', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select...</option>
                <option value="☀️ Bright">☀️ Bright</option>
                <option value="🌥️ Dim">🌥️ Dim</option>
                <option value="🌙 Dark">🌙 Dark</option>
                <option value="💡 Artificial">💡 Artificial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Noise Level</label>
              <select
                value={environment.noise}
                onChange={(e) => updateEnvironment('noise', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select...</option>
                <option value="🔇 Silent">🔇 Silent</option>
                <option value="🎵 Soft Music">🎵 Soft Music</option>
                <option value="🏙️ City Sounds">🏙️ City Sounds</option>
                <option value="👥 People Talking">👥 People Talking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <select
                value={environment.location}
                onChange={(e) => updateEnvironment('location', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select...</option>
                <option value="🏠 Home">🏠 Home</option>
                <option value="☕ Cafe">☕ Cafe</option>
                <option value="📚 Library">📚 Library</option>
                <option value="✈️ Travel">✈️ Travel</option>
                <option value="🏖️ Outdoors">🏖️ Outdoors</option>
                <option value="🚗 Car">🚗 Car</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Time of Day</label>
              <select
                value={environment.timeOfDay}
                onChange={(e) => updateEnvironment('timeOfDay', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select...</option>
                <option value="🌅 Morning">🌅 Morning</option>
                <option value="☀️ Afternoon">☀️ Afternoon</option>
                <option value="🌆 Evening">🌆 Evening</option>
                <option value="🌙 Night">🌙 Night</option>
                <option value="🕶️ Late Night">🕶️ Late Night</option>
              </select>
            </div>
          </div>
        </div>

        {/* Smart Progress Tracker */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Reading Progress 📊
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Page Tracking */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Current Page / Total Pages
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
                  placeholder="Current page"
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="number"
                  value={totalPages}
                  onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)}
                  placeholder="Total pages"
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => updateProgress(currentPage, totalPages)}
                  className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Progress Visualization */}
            {totalPages > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-primary font-bold">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4 mb-3">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{currentPage} pages read</span>
                  <span>{totalPages - currentPage} pages remaining</span>
                </div>
              </div>
            )}
          </div>

          {/* Reading Speed */}
          {isReading && currentPage > 0 && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Reading Speed</h4>
                  <p className="text-sm text-muted-foreground">Pages per minute</p>
                </div>
                <div className="text-3xl font-bold text-blue-400">
                  {getReadingSpeed()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Session Templates & Focus Mode */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Session Mode 🎯
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Templates */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Choose Your Reading Session Type
              </label>
              <div className="space-y-2">
                {[
                  { id: 'quick', name: '⚡ Quick Read (15 min)', desc: 'Short, focused bursts' },
                  { id: 'deep', name: '🧠 Deep Dive (60 min)', desc: 'Intensive analysis' },
                  { id: 'casual', name: '☕ Casual (30 min)', desc: 'Relaxed reading' },
                  { id: 'marathon', name: '🏃 Marathon (90 min)', desc: 'Long reading sessions' },
                ].map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSessionTemplate(template.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      sessionTemplate === template.id
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20 text-foreground'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs opacity-75">{template.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Distraction-Free Mode
              </label>
              <div className="space-y-4">
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`w-full p-4 rounded-lg font-medium transition-colors ${
                    focusMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {focusMode ? '🔒 Exit Focus Mode' : '🎯 Enter Focus Mode'}
                </button>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2"><strong>Focus Mode includes:</strong></p>
                  <ul className="space-y-1 text-xs">
                    <li>• Hide all UI elements except timer</li>
                    <li>• Disable notifications</li>
                    <li>• Full-screen reading experience</li>
                    <li>• Auto-save progress every 5 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Streaks */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/20 shadow-xl mb-8">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Achievements & Streaks 🏆
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reading Streak */}
            <div className="text-center">
              <div className="text-6xl mb-4">🔥</div>
              <div className="text-4xl font-bold text-orange-400 mb-2">
                {readingStreak}
              </div>
              <p className="text-foreground font-medium">Day Reading Streak</p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep reading daily to maintain your streak!
              </p>
            </div>

            {/* Achievement Badges */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Your Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm font-medium">
                    {achievement}
                  </div>
                ))}
                {achievements.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Complete reading sessions to unlock achievements!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Highlighter */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Favorite Quotes 💭
          </h3>

          {/* Add Quote */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="Highlight a meaningful quote..."
                className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                onKeyPress={(e) => e.key === 'Enter' && addQuote()}
              />
              <button
                onClick={addQuote}
                className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                Save Quote
              </button>
            </div>
          </div>

          {/* Saved Quotes */}
          {savedQuotes.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-4">Your Saved Quotes</h4>
              <div className="space-y-3">
                {savedQuotes.map((quote, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border-l-4 border-primary">
                    <blockquote className="text-foreground italic">
                      "{quote}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Info */}
        {session && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Reading Session
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Started</h4>
                <p className="text-muted-foreground">{formatDate(session.startTime)}</p>
                <p className="text-lg font-mono">{formatTime(session.startTime)}</p>
              </div>

              {session.endTime && (
                <>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Ended</h4>
                    <p className="text-muted-foreground">{formatDate(session.endTime)}</p>
                    <p className="text-lg font-mono">{formatTime(session.endTime)}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Duration</h4>
                    <p className="text-2xl font-bold text-primary">
                      {session.duration} min
                    </p>
                  </div>
                </>
              )}

              {isReading && (
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Currently reading...</span>
                  </div>

                  {/* Live Timer */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-green-400 mb-2">
                        {getElapsedTime()}
                      </div>
                      <p className="text-sm text-muted-foreground">Session Time</p>
                    </div>
                  </div>

                  {/* Break Reminder */}
                  {breakReminder && (
                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="font-medium">Time for a break! You've been reading for 45+ minutes.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reading Stats */}
        {sessionHistory.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Reading Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {sessionHistory.length}
                </div>
                <p className="text-muted-foreground">Total Sessions</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getTotalReadingTime()}
                </div>
                <p className="text-muted-foreground">Total Reading Time</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {sessionHistory.length > 0 ? Math.round(sessionHistory.reduce((sum, s) => sum + (s.duration || 0), 0) / sessionHistory.length) : 0} min
                </div>
                <p className="text-muted-foreground">Avg Session Length</p>
              </div>
            </div>
          </div>
        )}

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Session History
            </h3>

            <div className="space-y-4">
              {sessionHistory.slice(-5).reverse().map((histSession, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      {formatDate(histSession.startTime)} • {formatTime(histSession.startTime)} - {histSession.endTime ? formatTime(histSession.endTime) : 'Ongoing'}
                    </p>
                    {histSession.duration && (
                      <p className="text-sm text-muted-foreground">
                        Duration: {histSession.duration} minutes
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reading Notes & Mood */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Session Notes & Reflections
          </h3>

          <div className="space-y-6">
            {/* Mood Tracker */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                How are you feeling about this reading session?
              </label>
              <div className="flex gap-2 flex-wrap">
                {['😊 Great', '🤔 Thoughtful', '😴 Tired', '🎯 Focused', '😕 Confused', '✨ Inspired', '😞 Disappointed', '😐 Neutral'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setReadingMood(mood)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      readingMood === mood
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20 text-foreground'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Notes from this session (what stood out, thoughts, etc.)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Write your thoughts about this reading session..."
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Reading Goals */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
            Reading Goals & Progress
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Goal */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Daily Reading Goal</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today's Progress</span>
                  <span>0 / 30 min</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Set your daily reading target</p>
              </div>
            </div>

            {/* Weekly Goal */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Weekly Reading Goal</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Week</span>
                  <span>0 / 5 sessions</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Aim for consistent reading</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
