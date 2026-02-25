import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

const ranks = ['Polaznik', 'Aktivni učenik', 'Pripravnik', 'Kandidat za biznis', 'Preduzetnik', 'Izvršni direktor', 'Vizionar'];

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        xp: 0, 
        rank: 1, 
        rankName: 'Polaznik',
        enrollments: [],
        achievements: [],
        stats: {
          totalXp: 0,
          dailyXp: 0,
          messagesCount: 0,
          coursesCompleted: 0
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        enrollments: {
          include: {
            course: true
          },
          orderBy: { updatedAt: 'desc' },
          take: 5
        },
        achievements: {
          include: {
            achievement: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            messages: true,
            enrollments: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        xp: 0, 
        rank: 1, 
        rankName: 'Polaznik',
        enrollments: [],
        achievements: [],
        stats: {
          totalXp: 0,
          dailyXp: 0,
          messagesCount: 0,
          coursesCompleted: 0
        }
      });
    }

    const rankName = ranks[user.rank - 1] || 'Polaznik';

    const coursesCompleted = await prisma.enrollment.count({
      where: { 
        userId: user.id, 
        completed: true 
      }
    });

    return NextResponse.json({
      xp: user.xp,
      rank: user.rank,
      rankName,
      dailyXp: user.dailyXp,
      firstName: user.firstName,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
      enrollments: user.enrollments.map(e => ({
        id: e.id,
        courseId: e.courseId,
        title: e.course.title,
        image: e.course.image,
        progress: e.progress,
        completed: e.completed
      })),
      achievements: user.achievements.map(a => ({
        id: a.id,
        name: a.achievement.name,
        icon: a.achievement.icon
      })),
      stats: {
        totalXp: user.xp,
        dailyXp: user.dailyXp,
        messagesCount: user._count.messages,
        coursesCompleted,
        totalCourses: user._count.enrollments
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user stats' 
    }, { status: 500 });
  }
}
