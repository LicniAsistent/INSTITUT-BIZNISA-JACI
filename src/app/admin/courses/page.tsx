'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  X,
  Save,
  Video,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  priceRsd: number;
  priceEur: number;
  image: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  category: string;
  level: string;
  duration: string | null;
  published: boolean;
  featured: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: string | null;
  order: number;
}

const categories = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finansije' },
  { value: 'leadership', label: 'Liderstvo' },
  { value: 'sales', label: 'Prodaja' },
  { value: 'startup', label: 'Startup' },
  { value: 'tech', label: 'Tehnologija' },
];

const levels = [
  { value: 'beginner', label: 'Početni' },
  { value: 'intermediate', label: 'Srednji' },
  { value: 'advanced', label: 'Napredni' },
];

export default function AdminCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceRsd: 999,
    priceEur: 9,
    image: '',
    videoUrl: '',
    pdfUrl: '',
    category: 'marketing',
    level: 'beginner',
    duration: '',
    published: false,
    featured: false,
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
    fetchCourses();
  }, [session, status]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingCourse(null);
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj kurs?')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      priceRsd: course.priceRsd,
      priceEur: course.priceEur,
      image: course.image || '',
      videoUrl: course.videoUrl || '',
      pdfUrl: course.pdfUrl || '',
      category: course.category,
      level: course.level,
      duration: course.duration || '',
      published: course.published,
      featured: course.featured,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priceRsd: 999,
      priceEur: 9,
      image: '',
      videoUrl: '',
      pdfUrl: '',
      category: 'marketing',
      level: 'beginner',
      duration: '',
      published: false,
      featured: false,
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Upravljanje kursevima</h1>
            <p className="text-slate-400">Dodajte, uredite ili obrišite kurseve</p>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Dodaj kurs</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Pretraži kurseve..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Courses Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Kurs</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Cena</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Kategorija</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-slate-800">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{course.title}</p>
                          <p className="text-slate-400 text-sm">{course.lessons.length} lekcija</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white">{course.priceRsd.toLocaleString()} RSD</p>
                      <p className="text-slate-400 text-sm">{course.priceEur} EUR</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-300">{course.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {course.published ? (
                          <span className="badge-green text-xs">
                            <Eye className="w-3 h-3 inline mr-1" />
                            Objavljen
                          </span>
                        ) : (
                          <span className="badge text-xs bg-slate-700 text-slate-400">
                            <EyeOff className="w-3 h-3 inline mr-1" />
                            Skriven
                          </span>
                        )}
                        {course.featured && (
                          <span className="badge-gold text-xs">
                            <Star className="w-3 h-3 inline mr-1" />
                            Istaknut
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 text-slate-400 hover:text-yellow-500 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Nema kurseva koji odgovaraju pretrazi</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {editingCourse ? 'Uredi kurs' : 'Dodaj novi kurs'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Naziv kursa *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Opis *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cena (RSD) *</label>
                    <input
                      type="number"
                      value={formData.priceRsd}
                      onChange={(e) => setFormData({ ...formData, priceRsd: parseInt(e.target.value) })}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cena (EUR) *</label>
                    <input
                      type="number"
                      value={formData.priceEur}
                      onChange={(e) => setFormData({ ...formData, priceEur: parseInt(e.target.value) })}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Kategorija</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Nivo</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="input-field"
                    >
                      {levels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">URL slike</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="input-field pl-10"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">URL video zapisa (pregled)</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="input-field pl-10"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">URL PDF materijala</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      value={formData.pdfUrl}
                      onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                      className="input-field pl-10"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Trajanje</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                    placeholder="npr. 5 sati"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-slate-300">Objavi odmah</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-slate-300">Istaknut kurs</span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Save className="w-5 h-5" />
                    <span>Sačuvaj</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Otkaži
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
