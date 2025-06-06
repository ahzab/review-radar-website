import { db } from '@/lib/db/drizzle';
import { teams, teamMembers, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/auth/next-auth-utils';

export async function getTeamByStripeCustomerId(customerId: string) {
    const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.stripeCustomerId, customerId))
        .limit(1);

    return team ?? null;
}

export async function getTeamForUser(userId?: number) {
    let userIdToUse: number;

    if (userId) {
        userIdToUse = userId;
    } else {
        const user = await getUser();
        if (!user) return null;
        userIdToUse = user.id;
    }

    const result = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.userId, userIdToUse),
        with: {
            team: {
                with: {
                    teamMembers: {
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return result?.team ?? null;
}
