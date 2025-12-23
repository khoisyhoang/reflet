import Navbar from '../components/Navbar';
import Link from 'next/link';
import { BookOpen, MessageSquare, TrendingUp, Sparkles, Plus, Clock, CheckCircle, Brain } from 'lucide-react';

export default function HomePage() {
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


      <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-primary mb-2" style={{textShadow: '2px 2px 0 #000'}}>
            DASHBOARD
          </h1>
          <p className="text-xl text-text-muted font-mono">// Welcome back, reader</p>
        </div>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            <BookOpen className="text-primary mb-4" size={32} />
            <div className="text-3xl font-heading font-black text-primary mb-1">12</div>
            <div className="text-sm text-foreground font-sans">Books Read</div>
          </div>

          <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-4 border-secondary rounded-lg p-6 shadow-[0_0_20px_rgba(255,0,128,0.3)]">
            <MessageSquare className="text-secondary mb-4" size={32} />
            <div className="text-3xl font-heading font-black text-secondary mb-1">47</div>
            <div className="text-sm text-foreground font-sans">Reflections</div>
          </div>

          <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-4 border-accent rounded-lg p-6 shadow-[0_0_20px_rgba(255,170,0,0.3)]">
            <TrendingUp className="text-accent mb-4" size={32} />
            <div className="text-3xl font-heading font-black text-accent mb-1">2.3K</div>
            <div className="text-sm text-foreground font-sans">Pages Read</div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            <Brain className="text-primary mb-4" size={32} />
            <div className="text-3xl font-heading font-black text-primary mb-1">85%</div>
            <div className="text-sm text-foreground font-sans">Retention</div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Reading */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-heading font-bold text-primary mb-6" style={{textShadow: '1px 1px 0 #000'}}>
              CURRENT READING
            </h2>

            <div className="space-y-4">
              {/* Current Book */}
              <div className="bg-white/5 border-2 border-primary/30 rounded-lg p-6 hover:border-primary/60 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-bold text-primary">The Midnight Library</h3>
                    <p className="text-muted-foreground">by Matt Haig</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/reflect" className="bg-primary text-background px-4 py-2 rounded font-bold text-sm hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all duration-300">
                    Continue Reading
                  </Link>
                  <button className="border border-secondary text-secondary px-4 py-2 rounded font-bold text-sm hover:bg-secondary hover:text-background transition-all duration-300">
                    Add Reflection
                  </button>
                </div>
              </div>

              {/* Reading Goals */}
              <div className="bg-white/5 border-2 border-accent/30 rounded-lg p-6">
                <h3 className="text-lg font-heading font-bold text-accent mb-4">Monthly Goal</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Books Read</span>
                    <span>8 / 12</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pages Read</span>
                    <span>1,847 / 2,400</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{width: '77%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <section className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-heading font-bold text-secondary mb-4" style={{textShadow: '1px 1px 0 #000'}}>
                QUICK ACTIONS
              </h2>
              <div className="space-y-3">
                <Link href="/search" className="block bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary rounded-lg p-4 hover:border-primary/60 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <Plus className="text-primary group-hover:scale-110 transition-transform" size={20} />
                    <span className="font-bold text-primary">Add New Book</span>
                  </div>
                </Link>

                <Link href="/chat" className="block bg-gradient-to-r from-secondary/20 to-secondary/5 border-2 border-secondary rounded-lg p-4 hover:border-secondary/60 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-secondary group-hover:scale-110 transition-transform" size={20} />
                    <span className="font-bold text-secondary">Chat with AI</span>
                  </div>
                </Link>

                <Link href="/prompts" className="block bg-gradient-to-r from-accent/20 to-accent/5 border-2 border-accent rounded-lg p-4 hover:border-accent/60 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-accent group-hover:scale-110 transition-transform" size={20} />
                    <span className="font-bold text-accent">Reflection Prompts</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Reflections */}
            <div>
              <h2 className="text-xl font-heading font-bold text-accent mb-4" style={{textShadow: '1px 1px 0 #000'}}>
                RECENT REFLECTIONS
              </h2>
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-400" size={16} />
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-foreground">"The concept of parallel lives really made me think about my own choices..."</p>
                  <p className="text-xs text-muted-foreground mt-2">The Midnight Library - Chapter 7</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-yellow-400" size={16} />
                    <span className="text-sm text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm text-foreground">"This book challenges my perspective on regret and second chances..."</p>
                  <p className="text-xs text-muted-foreground mt-2">The Midnight Library - Chapter 3</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Achievement Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6" style={{textShadow: '1px 1px 0 #000'}}>
            ACHIEVEMENTS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-bold text-primary text-sm">Bookworm</div>
              <div className="text-xs text-muted-foreground">Read 10 books</div>
            </div>
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-bold text-secondary text-sm">Deep Thinker</div>
              <div className="text-xs text-muted-foreground">50 reflections</div>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-accent text-sm">Speed Reader</div>
              <div className="text-xs text-muted-foreground">1000 pages/month</div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary rounded-lg p-4 text-center opacity-50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-bold text-primary text-sm">Goal Crusher</div>
              <div className="text-xs text-muted-foreground">Complete monthly goal</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
