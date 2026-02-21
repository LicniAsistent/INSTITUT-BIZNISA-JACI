import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Get all channels
export async function GET(req: NextRequest) {
  try {
    const channels = await prisma.channel.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Greška prilikom učitavanja kanala' },
      { status: 500 }
    );
  }
}

// Create channel (admin only)
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
    const channel = await prisma.channel.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        type: data.type || 'public',
        order: data.order || 0,
      },
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { error: 'Greška prilikom kreiranja kanala' },
      { status: 500 }
    );
  }
}
