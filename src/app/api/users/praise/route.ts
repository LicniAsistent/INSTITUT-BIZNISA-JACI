import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 });
    }

    const { userId, type } = await req.json();

    // type: 'praise' | 'advice'

    if (type === 'praise') {
      // Add XP to the praised user
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: 10 },
        },
      });

      // Log the XP
      await prisma.xpLog.create({
        data: {
          userId: userId,
          amount: 10,
          reason: 'Pohvala od korisnika',
        },
      });

      return NextResponse.json({ success: true, message: 'Korisnik je pohvaljen! +10 XP' });
    }

    if (type === 'advice') {
      // Add XP for advice
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: 15 },
        },
      });

      await prisma.xpLog.create({
        data: {
          userId: userId,
          amount: 15,
          reason: 'Savetovanje korisnika',
        },
      });

      return NextResponse.json({ success: true, message: 'Hvala na savetu! +15 XP' });
    }

    return NextResponse.json({ error: 'Nepoznat tip' }, { status: 400 });
  } catch (error) {
    console.error('Error in praise/advice:', error);
    return NextResponse.json({ error: 'Greška' }, { status: 500 });
  }
}
