import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Get user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Korisnik nije pronađen' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Greška prilikom učitavanja profila' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nickname: data.nickname,
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        avatar: data.avatar,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Greška prilikom ažuriranja profila' },
      { status: 500 }
    );
  }
}
