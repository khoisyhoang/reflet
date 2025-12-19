import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import NavItems from './NavItems';

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl border-b border-white/10 shadow-xl relative overflow-hidden">
      {/* Ultra minimal background - just hint of hero colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/3 to-primary/5"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-heading font-black text-primary">
              Reflet
            </span>
          </Link>

          {/* Navigation Links - Client Component */}
          <NavItems />
        </div>
      </div>
    </nav>
  );
}
