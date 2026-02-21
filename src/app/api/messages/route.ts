import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Get messages for a channel
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID je obavezan' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { channelId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            rank: true,
            verified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Greška prilikom učitavanja poruka' },
      { status: 500 }
    );
  }
}

// Create message
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
    const { channelId, content, imageUrl } = data;

    if (!channelId || !content) {
      return NextResponse.json(
        { error: 'Kanal i sadržaj su obavezni' },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        channelId,
        userId: session.user.id,
        content,
        imageUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            rank: true,
            verified: true,
          },
        },
      },
    });

    // Add XP for message (daily limit check)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user) {
      const userDailyDate = new Date(user.dailyXpDate);
      userDailyDate.setHours(0, 0, 0, 0);

      let newDailyXp = user.dailyXp;
      if (userDailyDate.getTime() !== today.getTime()) {
        newDailyXp = 0;
      }

      // Daily XP limit: 100 XP per day from messages
      if (newDailyXp < 100) {
        const xpToAdd = Math.min(5, 100 - newDailyXp); // 5 XP per message
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            xp: { increment: xpToAdd },
            dailyXp: newDailyXp + xpToAdd,
            dailyXpDate: today,
          },
        });

        // Log XP
        await prisma.xpLog.create({
          data: {
            userId: session.user.id,
            amount: xpToAdd,
            reason: 'Poruka u kanalu',
          },
        });

        // Check for rank up
        await checkAndUpdateRank(session.user.id);
      }
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Greška prilikom slanja poruke' },
      { status: 500 }
    );
  }
}

// Check and update user rank
async function checkAndUpdateRank(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  const rankThresholds = [
    { rank: 1, xp: 0 },
    { rank: 2, xp: 100 },
    { rank: 3, xp: 500 },
    { rank: 4, xp: 1500 },
    { rank: 5, xp: 5000 },
    { rank: 6, xp: 15000 },
    { rank: 7, xp: 50000 },
  ];

  let newRank = user.rank;
  for (const threshold of rankThresholds) {
    if (user.xp >= threshold.xp) {
      newRank = threshold.rank;
    }
  }

  if (newRank > user.rank) {
    await prisma.user.update({
      where: { id: userId },
      data: { rank: newRank },
    });
  }
}
