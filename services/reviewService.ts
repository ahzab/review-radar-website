import { db } from '@/lib/db/drizzle';
import { reviews } from '@/lib/db/schema';
import { eq, desc, avg, count, sql } from 'drizzle-orm';
import { Review } from "@/types"; // Import from types directory


const ITEMS_PER_PAGE = 10;

interface PaginatedReviews {
    reviews: Review[];
    totalPages: number;
    currentPage: number;
}

export async function getReviewsForBusiness(businessId: number, page: number = 1): Promise<PaginatedReviews> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID');
    }
    if (!Number.isInteger(page) || page < 1) {
        throw new Error('Page must be a positive integer');
    }

    try {
        const offset = (page - 1) * ITEMS_PER_PAGE;

        const [reviewsData, totalCount] = await Promise.all([
            db
                .select()
                .from(reviews)
                .where(eq(reviews.businessId, businessId))
                .orderBy(desc(reviews.publishedAt))
                .limit(ITEMS_PER_PAGE)
                .offset(offset),
            db
                .select({ count: sql<number>`count(*)` })
                .from(reviews)
                .where(eq(reviews.businessId, businessId))
                .then(result => Number(result[0].count))
        ]);

        return {
            reviews: reviewsData,
            totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
            currentPage: page
        };
    } catch (error) {
        console.error('Error getting reviews for business:', error);
        throw new Error('Failed to retrieve reviews from the database');
    }
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
}): Promise<void> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID');
    }
    if (!content || content.trim() === '') {
        throw new Error('Review content cannot be empty');
    }
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        throw new Error('Rating must be an integer between 1 and 5');
    }
    if (!(publishedAt instanceof Date) || isNaN(publishedAt.getTime())) {
        throw new Error('Invalid published date');
    }

    try {
        await db.insert(reviews).values({
            businessId,
            reviewerName,
            content,
            rating,
            publishedAt,
            createdAt: new Date()
        });
    } catch (error) {
        console.error('Error adding review:', error);
        throw new Error('Failed to add review to the database');
    }
}

interface BusinessRatingStats {
    avgRating: number | null;
    totalReviews: number;
}

export async function getAverageRatingForBusiness(businessId: number): Promise<BusinessRatingStats> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID');
    }

    try {
        const result = await db
            .select({
                avgRating: avg(reviews.rating).as('avgRating'),
                totalReviews: count(reviews.id).as('totalReviews')
            })
            .from(reviews)
            .where(eq(reviews.businessId, businessId));

        return result[0];
    } catch (error) {
        console.error('Error getting average rating for business:', error);
        throw new Error('Failed to retrieve rating statistics from the database');
    }
}

export async function getAllReviewsForBusinessStats(businessId: number): Promise<Review[]> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID');
    }

    try {
        return await db
            .select()
            .from(reviews)
            .where(eq(reviews.businessId, businessId))
            .orderBy(desc(reviews.publishedAt));
    } catch (error) {
        console.error('Error getting all reviews for business stats:', error);
        throw new Error('Failed to retrieve reviews from the database');
    }
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    lowRatingsCount: number;
    highRatingsCount: number;
    ratingDistribution: { rating: number; count: number }[];
}

export async function getReviewStats(businessId: number): Promise<ReviewStats> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID');
    }

    try {
        // Get basic stats and rating counts using SQL case expressions
        const basicStats = await db
            .select({
                averageRating: sql<number>`ROUND(AVG(${reviews.rating})::numeric, 1)`,
                totalReviews: count(),
                lowRatingsCount: sql<number>`SUM(CASE WHEN ${reviews.rating} <= 3 THEN 1 ELSE 0 END)`,
                highRatingsCount: sql<number>`SUM(CASE WHEN ${reviews.rating} > 3 THEN 1 ELSE 0 END)`,
            })
            .from(reviews)
            .where(eq(reviews.businessId, businessId));

        // Get rating distribution in a separate query
        const distribution = await db
            .select({
                rating: reviews.rating,
                count: count(),
            })
            .from(reviews)
            .where(eq(reviews.businessId, businessId))
            .groupBy(reviews.rating);

        const ratingDistribution = Array.from({ length: 5 }, (_, i) => i + 1).map(rating => ({
            rating,
            count: distribution.find(d => d.rating === rating)?.count ?? 0
        }));

        return {
            ...basicStats[0],
            ratingDistribution
        };
    } catch (error) {
        console.error('Error getting review stats:', error);
        throw new Error('Failed to retrieve review statistics from the database');
    }
}
