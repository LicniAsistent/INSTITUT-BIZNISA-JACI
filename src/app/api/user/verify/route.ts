import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Submit verification video
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { videoUrl } = data;

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL je obavezan' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        verificationVideo: videoUrl,
        verificationStatus: 'pending',
      },
    });

    return NextResponse.json({
      message: 'Verifikacioni video poslat na razmatranje',
      user,
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json(
      { error: 'Greška prilikom slanja verifikacije' },
      { status: 500 }
    );
  }
}
