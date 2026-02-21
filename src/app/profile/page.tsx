'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  User,
  Award,
  TrendingUp,
  Crown,
  CheckCircle,
  Clock,
  BookOpen,
  Zap,
  Camera,
  Edit,
  Upload,
  Lock,
  Unlock,
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

const rankColors: Record<number, string> = {
  1: 'text-gray-400',
  2: 'text-gray-300',
  3: 'text-blue-400',
  4: 'text-green-400',
  5: 'text-yellow-400',
  6: 'text-orange-400',
  7: 'text-yellow-300',
};

const rankProgress: Record<number, number> = {
  1: 100,
  2: 500,
  3: 1500,
  4: 5000,
  5: 15000,
  6: 50000,
  7: 100000,
};

interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatar: string | null;
  rank: number;
  xp: number;
  dailyXp: number;
  subscriptionStatus: string;
  subscriptionEnd: string | null;
  verified: boolean;
  verificationStatus: string;
  verificationVideo: string | null;
  createdAt: string;
  enrollments: {
    id: string;
    course: {
      id: string;
      title: string;
      image: string | null;
    };
    progress: number;
    completed: boolean;
  }[];
  achievements: {
    achievement: {
      id: string;
      name: string;
      description: string;
      icon: string;
    };
  }[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '',
    firstName: '',
    lastName: '',
    bio: '',
  });
  const [verificationVideo, setVerificationVideo] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (session?.user) {
      fetchProfile();
    }
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setProfile(data);
      setEditForm({
        nickname: data.nickname || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        bio: data.bio || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const submitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: verificationVideo }),
      });

      if (response.ok) {
        setShowVerificationForm(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
    }
  };

  const getNextRankXp = (currentRank: number) => {
    return rankProgress[currentRank + 1] || rankProgress[currentRank];
  };

  const getCurrentRankXp = (currentRank: number) => {
    return rankProgress[currentRank] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Greška prilikom učitavanja profila</p>
      </div>
    );
  }

  const currentRankXp = getCurrentRankXp(profile.rank);
  const nextRankXp = getNextRankXp(profile.rank);
  const xpProgress = Math.min(100, ((profile.xp - currentRankXp) / (nextRankXp - currentRankXp)) * 100);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.nickname || ''}
                  className="w-24 h-24 rounded-full border-4 border-yellow-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-slate-900 text-3xl font-bold border-4 border-yellow-500">
                  {(profile.nickname?.[0] || profile.email[0]).toUpperCase()}
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-slate-700 rounded-full text-slate-300 hover:text-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {profile.nickname || profile.email}
                </h1>
                {profile.verified && (
                  <CheckCircle className="w-6 h-6 text-blue-500" title="Verifikovan nalog" />
                )}
                <button
                  onClick={() => setEditing(!editing)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-400">
                {profile.firstName} {profile.lastName}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`font-semibold ${rankColors[profile.rank]}`}>
                  <Crown className="w-4 h-4 inline mr-1" />
                  {rankNames[profile.rank]}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">
                  Član od {new Date(profile.createdAt).toLocaleDateString('sr-RS')}
                </span>
              </div>
            </div>

            {/* Verification Status */}
            <div>
              {!profile.verified && profile.verificationStatus === 'none' && (
                <button
                  onClick={() => setShowVerificationForm(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Verifikuj nalog</span>
                </button>
              )}
              {profile.verificationStatus === 'pending' && (
                <span className="badge-blue">Verifikacija na čekanju</span>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-slate-300">{profile.bio}</p>
          )}
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Uredi profil</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nadimak</label>
                  <input
                    type="text"
                    value={editForm.nickname}
                    onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Ime</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Prezime</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Biografija (max 160 karaktera)</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="input-field"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-right text-xs text-slate-500 mt-1">
                  {editForm.bio?.length || 0}/160
                </p>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Sačuvaj
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Verification Form */}
        {showVerificationForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Verifikacija naloga</h3>
            <p className="text-slate-400 mb-4">
              Snimite kratki video (do 60 sekundi) gde predstavljate sebe i svoj biznis.
              Admin tim će pregledati vaš video i odobriti verifikaciju.
            </p>
            <form onSubmit={submitVerification} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">URL video zapisa</label>
                <input
                  type="url"
                  value={verificationVideo}
                  onChange={(e) => setVerificationVideo(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="input-field"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Pošalji na verifikaciju
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationForm(false)}
                  className="btn-secondary"
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* XP & Rank */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">XP Poeni</p>
                <p className="text-2xl font-bold text-white">{profile.xp.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Napredak ka {rankNames[profile.rank + 1] || 'Maksimum'}</span>
                <span className="text-yellow-500">{Math.round(xpProgress)}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {profile.xp.toLocaleString()} / {nextRankXp.toLocaleString()} XP
              </p>
            </div>
          </div>

          {/* Subscription */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                {profile.subscriptionStatus === 'active' ? (
                  <Unlock className="w-5 h-5 text-blue-500" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pretplata</p>
                <p className="text-lg font-bold text-white">
                  {profile.subscriptionStatus === 'active' ? 'Aktivna' : 'Nema pretplate'}
                </p>
              </div>
            </div>
            {profile.subscriptionStatus === 'active' && profile.subscriptionEnd && (
              <p className="text-slate-400 text-sm">
                Važi do: {new Date(profile.subscriptionEnd).toLocaleDateString('sr-RS')}
              </p>
            )}
            {profile.subscriptionStatus !== 'active' && (
              <button className="w-full mt-2 btn-primary text-sm">
                Aktiviraj pretplatu
              </button>
            )}
          </div>

          {/* Courses */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Kursevi</p>
                <p className="text-2xl font-bold text-white">{profile.enrollments.length}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              {profile.enrollments.filter(e => e.completed).length} završenih
            </p>
          </div>
        </div>

        {/* My Courses */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Moji kursevi</h2>
          {profile.enrollments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-start space-x-3">
                    {enrollment.course.image ? (
                      <img
                        src={enrollment.course.image}
                        alt={enrollment.course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-slate-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{enrollment.course.title}</h3>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Napredak</span>
                          <span className="text-yellow-500">{enrollment.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                      {enrollment.completed && (
                        <span className="badge-green text-xs mt-2 inline-block">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Završeno
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">
              Još uvek nemate kupljenih kurseva
            </p>
          )}
        </div>

        {/* Achievements */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Dostignuća</h2>
          {profile.achievements.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {profile.achievements.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-white font-medium">{item.achievement.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{item.achievement.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">
              Još uvek nemate dostignuća. Budite aktivni da biste ih otključali!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
