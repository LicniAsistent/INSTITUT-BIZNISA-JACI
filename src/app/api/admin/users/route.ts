import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Get all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Nemate dozvolu' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        firstName: true,
        lastName: true,
        rank: true,
        xp: true,
        role: true,
        verified: true,
        verificationStatus: true,
        subscriptionStatus: true,
        createdAt: true,
        lastActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Greška prilikom učitavanja korisnika' },
      { status: 500 }
    );
  }
}

// Update user (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Nemate dozvolu' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { userId, ...updateData } = data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Greška prilikom ažuriranja korisnika' },
      { status: 500 }
    );
  }
}
