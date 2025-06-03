import { db } from '@/lib/db/drizzle';
import { businesses, teamMembers } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export interface BusinessAccessData {
    business: {
        id: number;
        teamId: number;
        name: string;
        url: string;
        platformId: number;
        lastCheckedAt: Date | null;
    };
    teamMember: {
        id: number;
        role: string;
    };
}

export async function verifyBusinessAccess(
    businessId: number,
    userId: number
): Promise<BusinessAccessData> {
    // Get the business with its details
    const business = await db.query.businesses.findFirst({
        where: eq(businesses.id, businessId),
    });

    if (!business) {
        notFound();
    }

    // Check if the user is a member of this team
    const teamMember = await db.query.teamMembers.findFirst({
        where: and(
            eq(teamMembers.userId, userId),
            eq(teamMembers.teamId, business.teamId)
        )
    });

    if (!teamMember) {
        notFound();
    }

    return {
        business,
        teamMember
    };
}
