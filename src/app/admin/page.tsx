'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Shield,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalMessages: number;
  totalRevenue: number;
  pendingVerifications: number;
  recentUsers: {
    id: string;
    nickname: string | null;
    email: string;
    createdAt: string;
  }[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (session?.user && session.user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchStats();
  }, [session, status]);

  const fetchStats = async () => {
    try {
      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      const users = await usersRes.json();

      // Fetch courses
      const coursesRes = await fetch('/api/courses');
      const courses = await coursesRes.json();

      // Fetch verifications
      const verificationsRes = await fetch('/api/admin/verify');
      const verifications = await verificationsRes.json();

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalMessages: 0,
        totalRevenue: 0,
        pendingVerifications: verifications.length,
        recentUsers: users.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400">Upravljanje platformom</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Ukupno korisnika</p>
                <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <Link
              href="/admin/users"
              className="flex items-center text-yellow-500 hover:text-yellow-400 mt-4 text-sm"
            >
              <span>Upravljaj korisnicima</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Ukupno kurseva</p>
                <p className="text-3xl font-bold text-white">{stats?.totalCourses || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <Link
              href="/admin/courses"
              className="flex items-center text-yellow-500 hover:text-yellow-400 mt-4 text-sm"
            >
              <span>Upravljaj kursevima</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Verifikacije</p>
                <p className="text-3xl font-bold text-white">{stats?.pendingVerifications || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <Link
              href="/admin/verify"
              className="flex items-center text-yellow-500 hover:text-yellow-400 mt-4 text-sm"
            >
              <span>Pregledaj verifikacije</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Prihod</p>
                <p className="text-3xl font-bold text-white">{stats?.totalRevenue || 0} RSD</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">Ukupno ovog meseca</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Brze akcije</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/courses"
              className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500/30 transition-all text-center"
            >
              <BookOpen className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <span className="text-white font-medium">Dodaj kurs</span>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500/30 transition-all text-center"
            >
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <span className="text-white font-medium">Upravljaj korisnicima</span>
            </Link>
            <Link
              href="/admin/verify"
              className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500/30 transition-all text-center"
            >
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <span className="text-white font-medium">Verifikacije</span>
            </Link>
            <button className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500/30 transition-all text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <span className="text-white font-medium">Analitika</span>
            </button>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Nedavni korisnici</h2>
          {stats?.recentUsers && stats.recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Korisnik</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Datum registracije</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800">
                      <td className="py-3 px-4 text-white">{user.nickname || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-400">{user.email}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString('sr-RS')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Nema nedavnih korisnika</p>
          )}
        </div>
      </div>
    </div>
  );
}
