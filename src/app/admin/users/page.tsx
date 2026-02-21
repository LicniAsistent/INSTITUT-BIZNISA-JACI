'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Shield,
  User,
  Crown,
  CheckCircle,
  X,
  Edit,
  Save,
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  rank: number;
  xp: number;
  role: string;
  verified: boolean;
  verificationStatus: string;
  subscriptionStatus: string;
  createdAt: string;
  lastActive: string;
}

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

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({
    rank: 1,
    xp: 0,
    role: 'user',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (session?.user && session.user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      rank: user.rank,
      xp: user.xp,
      role: user.role,
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          rank: editForm.rank,
          xp: editForm.xp,
          role: editForm.role,
        }),
      });

      if (response.ok) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-white">Upravljanje korisnicima</h1>
          <p className="text-slate-400">Pregled i uređivanje korisničkih naloga</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Pretraži korisnike..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Korisnik</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Rang</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">XP</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Registrovan</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">
                          {user.nickname || user.email}
                        </p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                        {user.firstName && (
                          <p className="text-slate-500 text-sm">
                            {user.firstName} {user.lastName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`${rankColors[user.rank]} font-medium`}>
                        {rankNames[user.rank]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{user.xp.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {user.verified && (
                          <span className="badge-blue text-xs">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Verifikovan
                          </span>
                        )}
                        {user.role === 'admin' && (
                          <span className="badge-gold text-xs">
                            <Shield className="w-3 h-3 inline mr-1" />
                            Admin
                          </span>
                        )}
                        {user.subscriptionStatus === 'active' && (
                          <span className="badge-green text-xs">Pretplata</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString('sr-RS')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-slate-400 hover:text-yellow-500 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Nema korisnika koji odgovaraju pretrazi</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Uredi korisnika</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Korisnik</label>
                  <p className="text-white">{editingUser.nickname || editingUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Rang</label>
                  <select
                    value={editForm.rank}
                    onChange={(e) => setEditForm({ ...editForm, rank: parseInt(e.target.value) })}
                    className="input-field"
                  >
                    {Object.entries(rankNames).map(([rank, name]) => (
                      <option key={rank} value={rank}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">XP</label>
                  <input
                    type="number"
                    value={editForm.xp}
                    onChange={(e) => setEditForm({ ...editForm, xp: parseInt(e.target.value) })}
                    className="input-field"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Uloga</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="input-field"
                  >
                    <option value="user">Korisnik</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Sačuvaj</span>
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="btn-secondary"
                  >
                    Otkaži
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
