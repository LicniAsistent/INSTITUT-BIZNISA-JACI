'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import {
  GraduationCap,
  Users,
  TrendingUp,
  Award,
  MessageCircle,
  Zap,
  Target,
  Crown,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Premium Kursevi',
    description: 'Učite od najboljih stručnjaka sa Balkana. Video lekcije, PDF materijali i praktični zadaci.',
  },
  {
    icon: Users,
    title: 'Aktivna Zajednica',
    description: 'Povežite se sa hiljadama preduzetnika. Razmenjujte ideje, iskustva i prilike.',
  },
  {
    icon: TrendingUp,
    title: 'Biznis Inkubacija',
    description: 'Učestvujte u izazovima, osvojite finansiranje i razvijajte svoje poslovanje.',
  },
  {
    icon: Award,
    title: 'Sertifikati',
    description: 'Dobijte priznate sertifikate koji dokazuju vaše znanje i veštine.',
  },
];

const ranks = [
  { name: 'Polaznik', xp: 0, color: 'text-gray-400', bg: 'bg-gray-500/20' },
  { name: 'Aktivni učenik', xp: 100, color: 'text-gray-300', bg: 'bg-gray-400/20' },
  { name: 'Pripravnik', xp: 500, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { name: 'Kandidat za biznis', xp: 1500, color: 'text-green-400', bg: 'bg-green-500/20' },
  { name: 'Preduzetnik', xp: 5000, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { name: 'Izvršni direktor', xp: 15000, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { name: 'Vizionar', xp: 50000, color: 'text-yellow-300', bg: 'bg-yellow-400/20' },
];

const pricing = [
  {
    name: 'Free Explorer',
    price: 'Besplatno',
    description: 'Za one koji žele da istraže',
    features: [
      'Pristup besplatnim kanalima',
      'Osnovni profil',
      'Pregled dostupnih kurseva',
    ],
    cta: 'Registruj se',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'Community Member',
    price: '1,999 RSD',
    period: '/mesec',
    description: 'Puna pristup zajednici',
    features: [
      'Svi kanali i grupe',
      'Networking sa članovima',
      'XP sistem i napredovanje',
      'Ekskluzivni događaji',
    ],
    cta: 'Pretplati se',
    href: '/courses',
    highlighted: true,
  },
  {
    name: 'Course Participant',
    price: 'Od 999 RSD',
    description: 'Za one koji žele da uče',
    features: [
      'Pristup kupljenim kursevima',
      'Video lekcije i materijali',
      'Sertifikati po završetku',
      '1 mesec zajednice gratis',
    ],
    cta: 'Pogledaj kurseve',
    href: '/courses',
    highlighted: false,
  },
];

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen overflow-y-auto">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-kimi-light/20 via-transparent to-blue-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-kimi-light via-kimi to-kimi-dark shadow-gold-lg border border-gold/30">
                <span className="text-4xl font-black text-white tracking-wider">BI</span>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-kimi-light/20 border border-kimi/30 mb-4">
              <Crown className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">
                Buducnost preduzetništva na Balkanu
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">Institut</span> Biznisa
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Edukacija, zajednica i inkubacija na jednom mestu. 
              Učite, povezujte se i razvijajte svoje poslovanje sa najboljima sa Balkana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <Link href="/courses" className="btn-primary flex items-center space-x-2 text-lg">
                  <span>Istraži kurseve</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link href="/auth/register" className="btn-primary flex items-center space-x-2 text-lg">
                    <span>Pridruži se odmah</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/courses" className="btn-secondary">
                    Pogledaj kurseve
                  </Link>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10,000+', label: 'Cilj korisnika' },
                { value: '50+', label: 'Kurseva' },
                { value: '7', label: 'Nivoa ranga' },
                { value: '24/7', label: 'Podrška' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gold">{stat.value}</div>
                  <div className="text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Šta nudimo?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Kompletna platforma za razvoj vašeg poslovanja - od edukacije do praktične primene
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rank System Section */}
      <section className="py-20 bg-gradient-to-br from-kimi/30 via-kimi-light/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Sistem Rangova
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Napredujte kroz 7 nivoa i otključajte ekskluzivne benefite
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {ranks.map((rank, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border border-slate-700 ${rank.bg} hover:border-yellow-500/30 transition-all`}
              >
                <div className={`text-2xl font-bold ${rank.color} mb-2`}>
                  {rank.xp.toLocaleString()} XP
                </div>
                <div className="text-white font-medium">{rank.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Cenovnik
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Izaberite paket koji vam odgovara i počnite svoju preduzetničku avanturu
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500'
                    : 'bg-slate-800/50 border border-slate-700'
                }`}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 ml-1">{plan.period}</span>}
                </div>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'btn-primary'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Naša Filozofija
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Givers Gain', desc: 'Ko daje — dobija' },
              { icon: Users, title: 'Connections First', desc: 'Povezivanje pre kapitala' },
              { icon: Target, title: 'Systems Focus', desc: 'Sistemi, ne samo biznisi' },
              { icon: TrendingUp, title: 'Real Impact', desc: 'Stvarni rezultati, ne teorija' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Spremni da započnete?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Pridružite se hiljadama preduzetnika koji već grade svoju buducnost
          </p>
          <Link
            href={session ? '/courses' : '/auth/register'}
            className="btn-primary inline-flex items-center space-x-2 text-lg"
          >
            <span>{session ? 'Istraži kurseve' : 'Registruj se besplatno'}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
