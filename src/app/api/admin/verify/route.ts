import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Approve or reject verification (admin only)
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
    const { userId, action } = data;

    if (!userId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Nevažeći parametri' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        verified: action === 'approve',
        verificationStatus: action === 'approve' ? 'approved' : 'rejected',
      },
    });

    return NextResponse.json({
      message: action === 'approve' ? 'Verifikacija odobrena' : 'Verifikacija odbijena',
      user,
    });
  } catch (error) {
    console.error('Error processing verification:', error);
    return NextResponse.json(
      { error: 'Greška prilikom obrade verifikacije' },
      { status: 500 }
    );
  }
}

// Get pending verifications (admin only)
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
      where: { verificationStatus: 'pending' },
      select: {
        id: true,
        email: true,
        nickname: true,
        firstName: true,
        lastName: true,
        verificationVideo: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Greška prilikom učitavanja verifikacija' },
      { status: 500 }
    );
  }
}
