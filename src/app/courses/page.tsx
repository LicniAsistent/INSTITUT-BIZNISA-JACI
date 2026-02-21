'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Play, Clock, Users, Star, Lock, CheckCircle, Filter } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  priceRsd: number;
  priceEur: number;
  image: string | null;
  category: string;
  level: string;
  duration: string | null;
  published: boolean;
  featured: boolean;
  lessons: { id: string }[];
  _count: { enrollments: number };
}

const categories = [
  { value: 'all', label: 'Sve kategorije' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finansije' },
  { value: 'leadership', label: 'Liderstvo' },
  { value: 'sales', label: 'Prodaja' },
  { value: 'startup', label: 'Startup' },
  { value: 'tech', label: 'Tehnologija' },
];

const levels = [
  { value: 'all', label: 'Svi nivoi' },
  { value: 'beginner', label: 'Početni' },
  { value: 'intermediate', label: 'Srednji' },
  { value: 'advanced', label: 'Napredni' },
];

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses();
    if (session?.user) {
      fetchUserEnrollments();
    }
  }, [session]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses?published=true');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollments = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      if (data.enrollments) {
        setUserEnrollments(data.enrollments.map((e: any) => e.courseId));
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const formatPrice = (priceRsd: number, priceEur: number) => {
    if (priceRsd === 0) return 'Besplatno';
    return `${priceRsd.toLocaleString()} RSD / ${priceEur} EUR`;
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Kursevi</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Učite od najboljih stručnjaka i razvijajte svoje veštine
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            >
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isEnrolled = userEnrollments.includes(course.id);
            return (
              <div key={course.id} className="card group overflow-hidden">
                {/* Course Image */}
                <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <Play className="w-16 h-16 text-slate-600" />
                    </div>
                  )}
                  {course.featured && (
                    <div className="absolute top-4 left-4 badge-gold">
                      <Star className="w-3 h-3 inline mr-1" />
                      Istaknuto
                    </div>
                  )}
                  {isEnrolled && (
                    <div className="absolute top-4 right-4 badge-green">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Kupljeno
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                    {course.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                    {course.level === 'beginner' && 'Početni'}
                    {course.level === 'intermediate' && 'Srednji'}
                    {course.level === 'advanced' && 'Napredni'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Play className="w-4 h-4" />
                    <span>{course.lessons.length} lekcija</span>
                  </div>
                  {course.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course._count.enrollments}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="text-lg font-semibold text-yellow-500">
                    {formatPrice(course.priceRsd, course.priceEur)}
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isEnrolled
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'btn-primary'
                    }`}
                  >
                    {isEnrolled ? 'Nastavi učenje' : 'Detalji'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Nema kurseva koji odgovaraju filterima</p>
          </div>
        )}
      </div>
    </div>
  );
}
