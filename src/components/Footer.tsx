'use client';

import Link from 'next/link';
import { 
  GraduationCap, 
  Mail, 
  MapPin, 
  Phone, 
  Instagram, 
  Youtube, 
  Linkedin,
  Send 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: O nama */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kimi-light via-kimi to-kimi-dark flex items-center justify-center">
                <span className="text-xl font-black text-white tracking-wider">BI</span>
              </div>
              <span className="text-xl font-bold text-white">Institut Biznisa</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Edukaciona platforma, zajednica i inkubacija za preduzetnike na Balkanu. 
              Učite, povezujte se i razvijajte svoje poslovanje sa najboljima.
            </p>
          </div>

          {/* Column 2: Linkovi */}
          <div>
            <h3 className="text-white font-semibold mb-4">Brzi linkovi</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/courses" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Kursevi
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Zajednica
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Izazovi
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  O nama
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CTA */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pridruži se</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/register" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Registruj se besplatno
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Svi kursevi
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Članstvo
                </Link>
              </li>
              <li>
                <Link href="/verification" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Verifikacija
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Česta pitanja
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontakt */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>info@institutbiznisa.rs</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+381 60 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Beograd, Srbija</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-white text-sm font-medium mb-3">Prati nas</h4>
              <div className="flex space-x-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-gold hover:text-navy transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-gold hover:text-navy transition-all"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-gold hover:text-navy transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Pretplati se na newsletter</h3>
              <p className="text-slate-400 text-sm mt-1">Prvi saznaj za nove kurseve, izazove i prilike</p>
            </div>
            <form className="flex w-full lg:w-auto">
              <input 
                type="email" 
                placeholder="Unesi svoj email" 
                className="flex-1 lg:w-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-l-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-navy font-semibold rounded-r-lg hover:from-yellow-500 hover:to-yellow-400 transition-all flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Prijavi se</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Institut Biznisa. Sva prava zadržana.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="text-slate-500 hover:text-gold text-sm transition-colors">
              Politika privatnosti
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-gold text-sm transition-colors">
              Uslovi korišćenja
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
