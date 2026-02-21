'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import {
  GraduationCap,
  Users,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Crown,
  Shield,
} from 'lucide-react';

const rankNames: Record<number, string> = {
  1: 'Polaznik',
  2: 'Aktivni učenik',
  3: 'Pripravnik',
  4: 'Kandidat za biznis',
  5: 'Preduzetnik',
  6: 'Izvršni direktor',
  7: 'Vizionar',
};

export function Navigation() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/courses', label: 'Kursevi', icon: GraduationCap },
    { href: '/community', label: 'Zajednica', icon: MessageSquare },
    ...(session?.user ? [{ href: '/profile', label: 'Profil', icon: User }] : []),
    ...(session?.user?.role === 'admin' ? [{ href: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-kimi-light to-kimi flex items-center justify-center">
              <span className="text-xl font-bold text-white">BI</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gold">Institut</span>
              <span className="text-xl font-bold text-white">Biznisa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <>
                <div className="flex items-center space-x-2">
                  {session.user.avatar ? (
                    <img
                      src={session.user.avatar}
                      alt={session.user.nickname || ''}
                      className="w-8 h-8 rounded-full border-2 border-yellow-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-slate-900 font-bold">
                      {(session.user.nickname?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="text-white font-medium">{session.user.nickname || session.user.email}</p>
                    <p className={`text-xs rank-${session.user.rank}`}>
                      {rankNames[session.user.rank]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Prijava
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary"
                >
                  Registracija
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              {session?.user ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Odjavi se</span>
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Prijava</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg btn-primary justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Registracija</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
