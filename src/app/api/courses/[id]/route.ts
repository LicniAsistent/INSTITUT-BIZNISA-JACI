import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Get single course
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Kurs nije pronađen' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Greška prilikom učitavanja kursa' },
      { status: 500 }
    );
  }
}

// Update course (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Nemate dozvolu' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const course = await prisma.course.update({
      where: { id: params.id },
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

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Greška prilikom ažuriranja kursa' },
      { status: 500 }
    );
  }
}

// Delete course (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Nemate dozvolu' },
        { status: 403 }
      );
    }

    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Kurs obrisan' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Greška prilikom brisanja kursa' },
      { status: 500 }
    );
  }
}
