import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Get all courses
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get('published') === 'true';
    const category = searchParams.get('category');

    const where: any = {};
    if (publishedOnly) where.published = true;
    if (category) where.category = category;

    const courses = await prisma.course.findMany({
      where,
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Greška prilikom učitavanja kurseva' },
      { status: 500 }
    );
  }
}

// Create course (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Nemate dozvolu' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        priceRsd: data.priceRsd,
        priceEur: data.priceEur,
        image: data.image,
        videoUrl: data.videoUrl,
        pdfUrl: data.pdfUrl,
        category: data.category,
        level: data.level,
        duration: data.duration,
        published: data.published,
        featured: data.featured,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Greška prilikom kreiranja kursa' },
      { status: 500 }
    );
  }
}
