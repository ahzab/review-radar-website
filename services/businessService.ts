import {businesses, platforms} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {db} from "@/lib/db/drizzle";

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

export async function updateBusinessLastChecked(businessId: number) {
    await db
        .update(businesses)
        .set({
            lastCheckedAt: new Date(),
            updatedAt: new Date()
        })
        .where(eq(businesses.id, businessId));
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
