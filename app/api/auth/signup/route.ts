import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, teams, teamMembers } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/session';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = signUpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, inviteId } = validation.data;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [createdUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        role: 'owner', // Default role
      })
      .returning();

    if (!createdUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Handle invitations or create a new team
    // This is simplified - you would need to add the full invitation logic

    // Create a new team for the user
    const [createdTeam] = await db
      .insert(teams)
      .values({
        name: `${email}'s Team`,
      })
      .returning();

    if (!createdTeam) {
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      );
    }

    // Add user to team
    await db
      .insert(teamMembers)
      .values({
        userId: createdUser.id,
        teamId: createdTeam.id,
        role: 'owner',
      });

    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
