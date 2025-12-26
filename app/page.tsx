
import { Search, Brain, BookOpen, Zap, Target, Sparkles, MessageSquare, TrendingUp, Users } from 'lucide-react';
import SearchBar from './components/SearchBar';

export default function Home() {

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,0,128,0.1),transparent_50%)]"></div>

      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.03)_2px,rgba(0,255,255,0.03)_4px)] animate-pulse"></div>
      </div>

      {/* HUD Corner Elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary opacity-60 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-secondary opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-accent opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary opacity-60 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center z-10">
        <h1 className="text-6xl md:text-8xl font-heading font-black text-primary mb-6" style={{textShadow: '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000'}}>
          REFLET
        </h1>
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-background border-4 border-primary rounded-lg p-6 font-mono text-lg md:text-xl text-foreground shadow-[0_0_20px_rgba(0,255,255,0.3)] relative" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-primary/30">
              <span className="text-primary font-bold">REFLET.EXE</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
              </div>
            </div>
            <div className="mb-3">&gt; Engage in conversations with your AI reading companion</div>
            <div className="mb-3">&gt; Discover personalized reflection prompts for each chapter</div>
            <div className="mb-3">&gt; Master long-term knowledge retention with spaced repetition</div>
          </div>
        </div>
        
        {/* Search Bar */}
        <SearchBar />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-primary text-background px-8 py-4 rounded-lg font-bold text-xl shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:shadow-[0_0_40px_rgba(0,255,255,0.8)] transition-all duration-300 transform hover:scale-105 border-black border-4">
            START READING
          </button>
          <button className="border-2 border-secondary text-secondary px-8 py-4 rounded-lg font-bold text-xl shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:shadow-[0_0_30px_rgba(255,0,128,0.6)] transition-all duration-300 transform hover:scale-105 border-black border-4">
            LEARN MORE
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-24 z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading font-black text-center text-secondary mb-4" style={{textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000'}}>
            POWER-UPS
          </h2>
          <p className="text-center text-text-muted font-mono text-lg mb-16">// Unlock your reading potential</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <Brain className="text-primary" size={48} />
                <span className="text-primary font-mono text-sm">LVL 1</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-3">AI COMPANION</h3>
              <p className="text-foreground font-sans leading-relaxed">
                Chat with an intelligent AI that understands your book. Ask questions, explore themes, and deepen your comprehension.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-4 border-secondary rounded-lg p-6 shadow-[0_0_20px_rgba(255,0,128,0.3)] hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="text-secondary" size={48} />
                <span className="text-secondary font-mono text-sm">LVL 2</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-secondary mb-3">REFLECTION PROMPTS</h3>
              <p className="text-foreground font-sans leading-relaxed">
                Get personalized prompts for each chapter. Transform passive reading into active learning and self-discovery.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-4 border-accent rounded-lg p-6 shadow-[0_0_20px_rgba(255,170,0,0.3)] hover:shadow-[0_0_30px_rgba(255,170,0,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <Zap className="text-accent" size={48} />
                <span className="text-accent font-mono text-sm">LVL 3</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-accent mb-3">SPACED REPETITION</h3>
              <p className="text-foreground font-sans leading-relaxed">
                Master knowledge retention with scientifically-proven spaced repetition. Never forget what you've learned.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="text-primary" size={48} />
                <span className="text-primary font-mono text-sm">LVL 4</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-3">SMART LIBRARY</h3>
              <p className="text-foreground font-sans leading-relaxed">
                Organize your reading journey. Track progress, set goals, and build your personal knowledge base.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-4 border-secondary rounded-lg p-6 shadow-[0_0_20px_rgba(255,0,128,0.3)] hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-secondary" size={48} />
                <span className="text-secondary font-mono text-sm">LVL 5</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-secondary mb-3">PROGRESS TRACKING</h3>
              <p className="text-foreground font-sans leading-relaxed">
                Visualize your reading stats, streaks, and achievements. Gamify your learning experience.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-4 border-accent rounded-lg p-6 shadow-[0_0_20px_rgba(255,170,0,0.3)] hover:shadow-[0_0_30px_rgba(255,170,0,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="text-accent" size={48} />
                <span className="text-accent font-mono text-sm">LVL 6</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-accent mb-3">INSIGHTS ENGINE</h3>
              <p className="text-foreground font-sans leading-relaxed">
                Discover connections between books, ideas, and concepts. Build a web of knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-24 z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading font-black text-center text-accent mb-4" style={{textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000'}}>
            MISSION BRIEFING
          </h2>
          <p className="text-center text-text-muted font-mono text-lg mb-16">// Your path to mastery</p>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-8 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <div className="flex-shrink-0 w-20 h-20 bg-primary text-background rounded-full flex items-center justify-center text-3xl font-heading font-black border-4 border-black shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                1
              </div>
              <div>
                <h3 className="text-3xl font-heading font-bold text-primary mb-2">SELECT YOUR BOOK</h3>
                <p className="text-foreground font-sans text-lg leading-relaxed">
                  Choose from our curated library or upload your own. REFLET supports all major formats and genres.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-secondary/10 to-transparent border-l-4 border-secondary p-8 rounded-lg shadow-[0_0_15px_rgba(255,0,128,0.2)]">
              <div className="flex-shrink-0 w-20 h-20 bg-secondary text-background rounded-full flex items-center justify-center text-3xl font-heading font-black border-4 border-black shadow-[0_0_20px_rgba(255,0,128,0.5)]">
                2
              </div>
              <div>
                <h3 className="text-3xl font-heading font-bold text-secondary mb-2">READ & REFLECT</h3>
                <p className="text-foreground font-sans text-lg leading-relaxed">
                  Dive into your book with AI-powered insights. Get chapter summaries, reflection prompts, and discussion questions.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent p-8 rounded-lg shadow-[0_0_15px_rgba(255,170,0,0.2)]">
              <div className="flex-shrink-0 w-20 h-20 bg-accent text-background rounded-full flex items-center justify-center text-3xl font-heading font-black border-4 border-black shadow-[0_0_20px_rgba(255,170,0,0.5)]">
                3
              </div>
              <div>
                <h3 className="text-3xl font-heading font-bold text-accent mb-2">RETAIN & GROW</h3>
                <p className="text-foreground font-sans text-lg leading-relaxed">
                  Use spaced repetition to cement your knowledge. Watch your understanding deepen over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 py-24 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="text-center bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary rounded-lg p-8 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              <Users className="mx-auto text-primary mb-4" size={64} />
              <div className="text-5xl font-heading font-black text-primary mb-2">10K+</div>
              <div className="text-xl font-sans text-foreground">Active Readers</div>
            </div>

            {/* Stat 2 */}
            <div className="text-center bg-gradient-to-br from-secondary/20 to-secondary/5 border-4 border-secondary rounded-lg p-8 shadow-[0_0_20px_rgba(255,0,128,0.3)]">
              <BookOpen className="mx-auto text-secondary mb-4" size={64} />
              <div className="text-5xl font-heading font-black text-secondary mb-2">50K+</div>
              <div className="text-xl font-sans text-foreground">Books Analyzed</div>
            </div>

            {/* Stat 3 */}
            <div className="text-center bg-gradient-to-br from-accent/20 to-accent/5 border-4 border-accent rounded-lg p-8 shadow-[0_0_20px_rgba(255,170,0,0.3)]">
              <TrendingUp className="mx-auto text-accent mb-4" size={64} />
              <div className="text-5xl font-heading font-black text-accent mb-2">95%</div>
              <div className="text-xl font-sans text-foreground">Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-24 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-4 border-primary rounded-lg p-12 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
            <h2 className="text-5xl md:text-6xl font-heading font-black text-primary mb-6" style={{textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000'}}>
              READY TO LEVEL UP?
            </h2>
            <p className="text-xl font-sans text-foreground mb-8 leading-relaxed">
              Join thousands of readers who are transforming the way they learn and retain knowledge.
            </p>
            <button className="bg-primary text-background px-12 py-5 rounded-lg font-bold text-2xl shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:shadow-[0_0_40px_rgba(0,255,255,0.8)] transition-all duration-300 transform hover:scale-110 border-black border-4">
              START YOUR JOURNEY
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 bg-gradient-to-t from-muted to-transparent border-t-2 border-primary/30 text-center z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">REFLET</h3>
              <p className="text-text-muted font-sans">Power up your mind with AI-powered reading.</p>
            </div>
            <div>
              <h4 className="text-lg font-heading font-bold text-secondary mb-4">QUICK LINKS</h4>
              <ul className="space-y-2 text-text-muted font-sans">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-heading font-bold text-accent mb-4">CONNECT</h4>
              <ul className="space-y-2 text-text-muted font-sans">
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-primary/20 pt-8">
            <p className="text-text-muted font-mono">&copy; 2024 REFLET - All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}  