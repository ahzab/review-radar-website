import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type SubscriptionData = {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
};

export async function updateTeamSubscription(
    teamId: number,
    subscriptionData: SubscriptionData
) {
    await db
        .update(teams)
        .set({
            ...subscriptionData,
            updatedAt: new Date(),
        })
        .where(eq(teams.id, teamId));
}
