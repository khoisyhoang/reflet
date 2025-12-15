
import { Search } from 'lucide-react';

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
            {/* Cursor */}
            {/* <div className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse"></div> */}
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for books..."
              className="w-full px-6 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xs border-2 border-primary/30 text-foreground font-sans text-lg placeholder-text-muted focus:outline-none focus:border-primary/60 focus:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,0,128,0.3)]"
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-accent">
              <Search size={20} />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-primary text-background px-8 py-4 rounded-lg font-bold text-xl shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:shadow-[0_0_40px_rgba(0,255,255,0.8)] transition-all duration-300 transform hover:scale-105 border-black border-4">
            START READING
          </button>
          <button className="border-2 border-secondary text-secondary px-8 py-4 rounded-lg font-bold text-xl shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:shadow-[0_0_30px_rgba(255,0,128,0.6)] transition-all duration-300 transform hover:scale-105 border-black border-4">
            LEARN MORE
          </button>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="relative py-8 px-4 bg-foreground text-background text-center z-10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
        <p className="text-lg font-bold">&copy; 2024 Reflet - Power Up Your Mind</p>
      </footer> */}
    </div>
  );
}
