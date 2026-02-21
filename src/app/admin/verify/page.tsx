'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Video,
  User,
  Play,
  ExternalLink,
} from 'lucide-react';

interface VerificationUser {
  id: string;
  email: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  verificationVideo: string;
  verificationStatus: string;
  createdAt: string;
}

export default function AdminVerifyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<VerificationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (session?.user && session.user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchVerifications();
  }, [session, status]);

  const fetchVerifications = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (response.ok) {
        fetchVerifications();
      }
    } catch (error) {
      console.error('Error processing verification:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Verifikacije naloga</h1>
          <p className="text-slate-400">
            {users.length} zahteva na čekanju
          </p>
        </div>

        {/* Verifications Grid */}
        {users.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user.id} className="card">
                {/* User Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-slate-900 font-bold">
                    {(user.nickname?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.nickname || user.email}</p>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                    {user.firstName && (
                      <p className="text-slate-500 text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Video Preview */}
                <div className="aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
                  {user.verificationVideo.includes('youtube') || user.verificationVideo.includes('youtu.be') ? (
                    <div className="text-center">
                      <Video className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <a
                        href={user.verificationVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-400 flex items-center justify-center space-x-1"
                      >
                        <Play className="w-4 h-4" />
                        <span>Pogledaj video</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <video
                      src={user.verificationVideo}
                      controls
                      className="w-full h-full rounded-lg"
                    />
                  )}
                </div>

                {/* Video URL */}
                <p className="text-slate-400 text-sm mb-4 truncate">
                  {user.verificationVideo}
                </p>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAction(user.id, 'approve')}
                    className="flex-1 py-2 px-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Odobri</span>
                  </button>
                  <button
                    onClick={() => handleAction(user.id, 'reject')}
                    className="flex-1 py-2 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Odbij</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Nema zahteva na čekanju
            </h2>
            <p className="text-slate-400">
              Svi zahtevi za verifikaciju su obrađeni
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
