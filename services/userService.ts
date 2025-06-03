import { db } from '@/lib/db/drizzle';
import { users, teamMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserWithTeam(userId: number) {
    const [result] = await db
        .select({
            user: users,
            teamId: teamMembers.teamId,
        })
        .from(users)
        .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
        .where(eq(users.id, userId))
        .limit(1);

    return result ?? null;
}
