import { db } from '@/lib/db/drizzle';
import { reviews } from '@/lib/db/schema';
import { eq, desc, avg, count, sql } from 'drizzle-orm';
import { Review } from "@/types"; // Import from types directory
import logger from '@/lib/logger';

/**
 * Number of items to display per page in paginated results
 */
const ITEMS_PER_PAGE = 10;

/**
 * Interface for paginated review results
 */
interface PaginatedReviews {
    /** Array of review objects */
    reviews: Review[];
    /** Total number of pages available */
    totalPages: number;
    /** Current page number */
    currentPage: number;
}

/**
 * Interface for business rating statistics
 */
interface BusinessRatingStats {
    /** Average rating for the business (null if no reviews) */
    avgRating: number | null;
    /** Total number of reviews for the business */
    totalReviews: number;
}

/**
 * Interface for detailed review statistics
 */
interface ReviewStats {
    /** Average rating for the business */
    averageRating: number;
    /** Total number of reviews for the business */
    totalReviews: number;
    /** Count of reviews with rating <= 3 */
    lowRatingsCount: number;
    /** Count of reviews with rating > 3 */
    highRatingsCount: number;
    /** Distribution of ratings from 1-5 */
    ratingDistribution: { rating: number; count: number }[];
}

/**
 * Retrieves paginated reviews for a specific business
 * 
 * @param businessId - The ID of the business to get reviews for
 * @param page - The page number to retrieve (defaults to 1)
 * @returns A promise that resolves to paginated review results
 * @throws Error if businessId is invalid or if database operation fails
 */
export async function getReviewsForBusiness(businessId: number, page: number = 1): Promise<PaginatedReviews> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID: Business ID must be a positive integer');
    }
    if (!Number.isInteger(page) || page < 1) {
        throw new Error('Invalid page number: Page must be a positive integer');
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

        // Validate the results
        if (!Array.isArray(reviewsData)) {
            throw new Error('Database returned invalid review data format');
        }

        return {
            reviews: reviewsData,
            totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
            currentPage: page
        };
    } catch (error) {
        logger.error('Error getting reviews for business', error);
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve reviews: ${error.message}`);
        }
        throw new Error('Failed to retrieve reviews from the database');
    }
}



/**
 * Adds a new review to the database
 * 
 * @param params - Object containing review data
 * @param params.businessId - The ID of the business being reviewed
 * @param params.reviewerName - Optional name of the reviewer
 * @param params.content - The text content of the review
 * @param params.rating - The rating given (1-5)
 * @param params.publishedAt - The date the review was published
 * @returns A promise that resolves when the review is successfully added
 * @throws Error if any parameters are invalid or if database operation fails
 */
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
        throw new Error('Invalid business ID: Business ID must be a positive integer');
    }
    if (!content || content.trim() === '') {
        throw new Error('Invalid review content: Review content cannot be empty');
    }
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        throw new Error('Invalid rating: Rating must be an integer between 1 and 5');
    }
    if (!(publishedAt instanceof Date) || isNaN(publishedAt.getTime())) {
        throw new Error('Invalid published date: Date must be a valid Date object');
    }

    // Validate reviewerName if provided
    if (reviewerName !== undefined && (typeof reviewerName !== 'string' || reviewerName.trim() === '')) {
        throw new Error('Invalid reviewer name: Reviewer name must be a non-empty string');
    }

    try {
        const result = await db.insert(reviews).values({
            businessId,
            reviewerName,
            content,
            rating,
            publishedAt,
            createdAt: new Date()
        });

        // Verify the insert operation was successful
        if (!result) {
            throw new Error('Database insert operation failed to return a result');
        }
    } catch (error) {
        logger.error('Error adding review', error);
        if (error instanceof Error) {
            // Check for specific database errors
            if (error.message.includes('foreign key constraint')) {
                throw new Error('Failed to add review: The specified business does not exist');
            }
            throw new Error(`Failed to add review: ${error.message}`);
        }
        throw new Error('Failed to add review to the database');
    }
}

interface BusinessRatingStats {
    avgRating: number | null;
    totalReviews: number;
}

/**
 * Retrieves the average rating and total review count for a business
 * 
 * @param businessId - The ID of the business to get rating statistics for
 * @returns A promise that resolves to business rating statistics
 * @throws Error if businessId is invalid or if database operation fails
 */
export async function getAverageRatingForBusiness(businessId: number): Promise<BusinessRatingStats> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID: Business ID must be a positive integer');
    }

    try {
        const result = await db
            .select({
                avgRating: avg(reviews.rating).as('avgRating'),
                totalReviews: count(reviews.id).as('totalReviews')
            })
            .from(reviews)
            .where(eq(reviews.businessId, businessId));

        // Validate the result
        if (!result || !Array.isArray(result) || result.length === 0) {
            throw new Error('Database returned invalid or empty result');
        }

        // Validate the structure of the result
        const stats = result[0];
        if (typeof stats.totalReviews !== 'number') {
            throw new Error('Database returned invalid totalReviews value');
        }

        // Convert avgRating to number if it's a string
        return {
            avgRating: stats.avgRating !== null ? Number(stats.avgRating) : null,
            totalReviews: stats.totalReviews
        };
    } catch (error) {
        logger.error('Error getting average rating for business', error);
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve rating statistics: ${error.message}`);
        }
        throw new Error('Failed to retrieve rating statistics from the database');
    }
}

/**
 * Retrieves all reviews for a business for statistical analysis
 * 
 * @param businessId - The ID of the business to get reviews for
 * @returns A promise that resolves to an array of all reviews for the business
 * @throws Error if businessId is invalid or if database operation fails
 */
export async function getAllReviewsForBusinessStats(businessId: number): Promise<Review[]> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID: Business ID must be a positive integer');
    }

    try {
        const result = await db
            .select()
            .from(reviews)
            .where(eq(reviews.businessId, businessId))
            .orderBy(desc(reviews.publishedAt));

        // Validate the result
        if (!result || !Array.isArray(result)) {
            throw new Error('Database returned invalid result format');
        }

        // Validate each review in the result
        result.forEach((review, index) => {
            if (!review || typeof review !== 'object') {
                throw new Error(`Invalid review object at index ${index}`);
            }

            // Check for required fields
            if (review.id === undefined || review.businessId === undefined || 
                review.rating === undefined || review.content === undefined) {
                throw new Error(`Review at index ${index} is missing required fields`);
            }
        });

        return result;
    } catch (error) {
        logger.error('Error getting all reviews for business stats', error);
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve reviews: ${error.message}`);
        }
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

/**
 * Retrieves comprehensive review statistics for a business
 * 
 * @param businessId - The ID of the business to get review statistics for
 * @returns A promise that resolves to detailed review statistics including rating distribution
 * @throws Error if businessId is invalid or if database operation fails
 */
export async function getReviewStats(businessId: number): Promise<ReviewStats> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID: Business ID must be a positive integer');
    }

    try {
        // Get basic stats and rating counts using SQL case expressions
        const basicStats = await db
            .select({
                averageRating: sql<number>`CAST(COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0) AS float)`,
                totalReviews: count(),
                lowRatingsCount: sql<number>`COALESCE(SUM(CASE WHEN ${reviews.rating} <= 3 THEN 1 ELSE 0 END)::integer, 0)`,
                highRatingsCount: sql<number>`COALESCE(SUM(CASE WHEN ${reviews.rating} > 3 THEN 1 ELSE 0 END)::integer, 0)`,
            })
            .from(reviews)
            .where(eq(reviews.businessId, businessId));
        // eslint-disable-next-line no-console
        console.log('basicStats :', basicStats);
        
        
        // Validate basic stats result
        if (!basicStats || !Array.isArray(basicStats) || basicStats.length === 0) {
            throw new Error('Database returned invalid or empty basic stats result');
        }

        // Get rating distribution in a separate query
        const distribution = await db
            .select({
                rating: reviews.rating,
                count: count(),
            })
            .from(reviews)
            .where(eq(reviews.businessId, businessId))
            .groupBy(reviews.rating);

        // Validate distribution result
        if (!distribution || !Array.isArray(distribution)) {
            throw new Error('Database returned invalid rating distribution result');
        }

        // Validate the structure of the basic stats
        const stats = basicStats[0];
        // eslint-disable-next-line no-console
        console.log('stats.averageRating :', stats.averageRating);
        

        if (stats.averageRating !== null && (typeof stats.averageRating !== 'number' || isNaN(stats.averageRating))) {
            throw new Error('Database returned invalid averageRating value');
        }
        if (typeof stats.totalReviews !== 'number') {
            throw new Error('Database returned invalid totalReviews value');
        }
        if (typeof stats.lowRatingsCount !== 'number') {
            throw new Error('Database returned invalid lowRatingsCount value');
        }
        if (typeof stats.highRatingsCount !== 'number') {
            throw new Error('Database returned invalid highRatingsCount value');
        }

        // Create rating distribution with validation
        const ratingDistribution = Array.from({ length: 5 }, (_, i) => i + 1).map(rating => {
            const found = distribution.find(d => d.rating === rating);
            const count = found?.count ?? 0;

            if (typeof count !== 'number') {
                throw new Error(`Invalid count value for rating ${rating}`);
            }

            return { rating, count };
        });

        return {
            ...stats,
            ratingDistribution
        };
    } catch (error) {
        console.error('Error getting review stats:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve review statistics: ${error.message}`);
        }
        throw new Error('Failed to retrieve review statistics from the database');
    }
}