'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock,
  ArrowLeft,
  FileText,
  Award,
  ShoppingCart,
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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
  lessons: Lesson[];
  _count: { enrollments: number };
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: string | null;
  order: number;
}

function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Došlo je do greške');
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Završi kupovinu</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'rsd' | 'eur'>('rsd');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`);
      const data = await response.json();
      if (response.ok) {
        setCourse(data);
        if (data.lessons.length > 0) {
          setActiveLesson(data.lessons[0]);
        }
        checkEnrollment();
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!session?.user) return;
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      if (data.enrollments) {
        const enrolled = data.enrollments.some((e: any) => e.courseId === params.id);
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handlePurchase = async () => {
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'course',
          itemId: params.id,
          currency: selectedCurrency,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsEnrolled(true);
    fetchCourse();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg">Kurs nije pronađen</p>
          <Link href="/courses" className="text-yellow-500 hover:text-yellow-400 mt-4 inline-block">
            Nazad na kurseve
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Nazad na kurseve</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden mb-6">
              {isEnrolled && activeLesson?.videoUrl ? (
                <video
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={course.image || undefined}
                />
              ) : course.videoUrl && isEnrolled ? (
                <video
                  src={course.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={course.image || undefined}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Lock className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="text-slate-400">
                    {isEnrolled ? 'Izaberite lekciju' : 'Kupite kurs da biste videli sadržaj'}
                  </p>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="card mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                  {course.category}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                  {course.level === 'beginner' && 'Početni'}
                  {course.level === 'intermediate' && 'Srednji'}
                  {course.level === 'advanced' && 'Napredni'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-slate-300 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 text-sm text-slate-400">
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
                  <span>{course._count.enrollments} polaznika</span>
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Lekcije</h2>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => isEnrolled && setActiveLesson(lesson)}
                    disabled={!isEnrolled}
                    className={`w-full flex items-center space-x-4 p-4 rounded-lg transition-all ${
                      activeLesson?.id === lesson.id
                        ? 'bg-yellow-500/20 border border-yellow-500/30'
                        : 'bg-slate-800/50 hover:bg-slate-800'
                    } ${!isEnrolled && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-medium">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-slate-400 text-sm">{lesson.description}</p>
                      )}
                    </div>
                    {lesson.duration && (
                      <span className="text-slate-400 text-sm">{lesson.duration}</span>
                    )}
                    {!isEnrolled && <Lock className="w-4 h-4 text-slate-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {isEnrolled ? (
                <div className="card bg-green-500/10 border-green-500/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-green-400 font-semibold">Kupljen kurs</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">
                    Imate pristup svim lekcijama i materijalima.
                  </p>
                  {course.pdfUrl && (
                    <a
                      href={course.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Preuzmi materijale</span>
                    </a>
                  )}
                </div>
              ) : showPayment ? (
                <div className="card">
                  <h3 className="text-xl font-semibold text-white mb-4">Plaćanje</h3>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                  </Elements>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="w-full mt-4 text-slate-400 hover:text-white"
                  >
                    Nazad
                  </button>
                </div>
              ) : (
                <div className="card">
                  <h3 className="text-xl font-semibold text-white mb-4">Kupite kurs</h3>
                  
                  {/* Currency Selection */}
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setSelectedCurrency('rsd')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        selectedCurrency === 'rsd'
                          ? 'bg-yellow-500 text-slate-900'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      RSD
                    </button>
                    <button
                      onClick={() => setSelectedCurrency('eur')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        selectedCurrency === 'eur'
                          ? 'bg-yellow-500 text-slate-900'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      EUR
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-yellow-500">
                      {selectedCurrency === 'rsd'
                        ? `${course.priceRsd.toLocaleString()} RSD`
                        : `${course.priceEur} EUR`}
                    </div>
                    {course.priceRsd > 0 && (
                      <p className="text-slate-400 text-sm mt-2">
                        + 1 mesec besplatne zajednice
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handlePurchase}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Kupi sada</span>
                  </button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Pristup svim lekcijama</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Video i PDF materijali</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sertifikat po završetku</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Trajan pristup</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
