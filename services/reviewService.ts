import { db } from '@/lib/db/drizzle';
import { reviews } from '@/lib/db/schema';
import { eq, desc, avg, count } from 'drizzle-orm';

export async function getReviewsForBusiness(businessId: number) {
    return await db
        .select()
        .from(reviews)
        .where(eq(reviews.businessId, businessId))
        .orderBy(desc(reviews.publishedAt));
}

export async function addReview({
                                    businessId,
                                    reviewerName,
                                    content,
                                    rating,
                                    publishedAt
                                }: {
    businessId: number;
    reviewerName?: string;
    content: string;
    rating: number;
    publishedAt: Date;
}) {
    await db.insert(reviews).values({
        businessId,
        reviewerName,
        content,
        rating,
        publishedAt,
        createdAt: new Date()
    });
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
