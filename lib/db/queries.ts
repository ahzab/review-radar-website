import {desc, and, eq, isNull, avg, count} from 'drizzle-orm';
import {db} from './drizzle';
import {activityLogs, businesses, platforms, reviews, teamMembers, teams, users} from './schema';
import {cookies} from 'next/headers';
import {verifyToken} from '@/lib/auth/session';

export async function getUser() {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie || !sessionCookie.value) {
        return null;
    }

    const sessionData = await verifyToken(sessionCookie.value);
    if (
        !sessionData ||
        !sessionData.user ||
        typeof sessionData.user.id !== 'number'
    ) {
        return null;
    }

    if (new Date(sessionData.expires) < new Date()) {
        return null;
    }

    const user = await db
        .select()
        .from(users)
        .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
        .limit(1);

    if (user.length === 0) {
        return null;
    }

    return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
    const result = await db
        .select()
        .from(teams)
        .where(eq(teams.stripeCustomerId, customerId))
        .limit(1);

    return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
    teamId: number,
    subscriptionData: {
        stripeSubscriptionId: string | null;
        stripeProductId: string | null;
        planName: string | null;
        subscriptionStatus: string;
    }
) {
    await db
        .update(teams)
        .set({
            ...subscriptionData,
            updatedAt: new Date()
        })
        .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
    const result = await db
        .select({
            user: users,
            teamId: teamMembers.teamId
        })
        .from(users)
        .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
        .where(eq(users.id, userId))
        .limit(1);

    return result[0];
}

export async function getActivityLogs() {
    const user = await getUser();
    if (!user) {
        throw new Error('User not authenticated');
    }

    return await db
        .select({
            id: activityLogs.id,
            action: activityLogs.action,
            timestamp: activityLogs.timestamp,
            ipAddress: activityLogs.ipAddress,
            userName: users.name
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .where(eq(activityLogs.userId, user.id))
        .orderBy(desc(activityLogs.timestamp))
        .limit(10);
}

export async function getTeamForUser() {
    const user = await getUser();
    if (!user) {
        return null;
    }

    const result = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.userId, user.id),
        with: {
            team: {
                with: {
                    teamMembers: {
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return result?.team || null;
}

export async function getPlatforms() {
    return await db
        .select()
        .from(platforms)
        .orderBy(platforms.name);
}


export async function getBusinessesForTeam(teamId: number) {
  return await db
      .select({
        id: businesses.id,
        name: businesses.name,
        url: businesses.url,
        lastCheckedAt: businesses.lastCheckedAt,
        platformName: platforms.name,
        platformLogoUrl: platforms.logoUrl
      })
      .from(businesses)
      .leftJoin(platforms, eq(businesses.platformId, platforms.id))
      .where(eq(businesses.teamId, teamId))
      .orderBy(businesses.createdAt);
}

export async function getBusinessWithReviews(businessId: number) {
  return await db.query.businesses.findFirst({
    where: eq(businesses.id, businessId),
    with: {
      platform: true,
      reviews: true
    }
  });
}

export async function getReviewsForBusiness(businessId: number) {
  return await db
      .select()
      .from(reviews)
      .where(eq(reviews.businessId, businessId))
      .orderBy(desc(reviews.publishedAt));
}

export async function updateBusinessLastChecked(businessId: number) {
  await db
      .update(businesses)
      .set({
        lastCheckedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(businesses.id, businessId));
}

export async function getAverageRatingForBusiness(businessId: number) {
  const result = await db
      .select({
        avgRating: avg(reviews.rating).as('avgRating'),
        totalReviews: count(reviews.id).as('totalReviews')
      })
      .from(reviews)
      .where(eq(reviews.businessId, businessId));

  return result[0];
}

export async function createBusiness({
                                       name,
                                       url,
                                       platformId,
                                       teamId
                                     }: {
  name: string;
  url: string;
  platformId: number;
  teamId: number;
}) {
  await db.insert(businesses).values({
    name,
    url,
    platformId,
    teamId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}