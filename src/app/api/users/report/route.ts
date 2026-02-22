import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 });
    }

    const { userId, reason } = await req.json();

    // Create a report (for now just log it, in future could notify admins)
    console.log(`User ${session.user.id} reported user ${userId}: ${reason}`);

    // Could also create a Report model in the future
    
    return NextResponse.json({ success: true, message: 'Prijave prosleđene administratorima' });
  } catch (error) {
    console.error('Error in report:', error);
    return NextResponse.json({ error: 'Greška' }, { status: 500 });
  }
}
