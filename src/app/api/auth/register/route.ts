import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname, firstName, lastName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i lozinka su obavezni' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Korisnik sa ovim email-om ili nadimkom već postoji' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        firstName,
        lastName,
      },
    });

    return NextResponse.json(
      { message: 'Korisnik uspešno kreiran', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Greška prilikom registracije' },
      { status: 500 }
    );
  }
}
