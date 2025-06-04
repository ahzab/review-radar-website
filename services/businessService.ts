import {businesses, platforms} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {db} from "@/lib/db/drizzle";
import { Business, Platform } from '@/types'; // Import types

/**
 * Interface for business data with platform information
 */
interface BusinessWithPlatform {
    id: number;
    name: string;
    url: string;
    lastCheckedAt: Date | null;
    platformName: string | null;
    platformLogoUrl: string | null;
}

/**
 * Retrieves all businesses for a specific team with platform information
 * 
 * @param teamId - The ID of the team to get businesses for
 * @returns A promise that resolves to an array of businesses with platform information
 * @throws Error if teamId is invalid or if database operation fails
 */
export async function getBusinessesForTeam(teamId: number): Promise<BusinessWithPlatform[]> {
    // Input validation
    if (!teamId || teamId <= 0) {
        throw new Error('Invalid team ID: Team ID must be a positive integer');
    }

    try {
        const result = await db
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

        // Validate the result
        if (!result || !Array.isArray(result)) {
            throw new Error('Database returned invalid result format');
        }

        return result;
    } catch (error) {
        console.error('Error getting businesses for team:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve businesses: ${error.message}`);
        }
        throw new Error('Failed to retrieve businesses from the database');
    }
}

/**
 * Retrieves a business with its platform and reviews
 * 
 * @param businessId - The ID of the business to retrieve
 * @returns A promise that resolves to the business with its platform and reviews, or null if not found
 * @throws Error if businessId is invalid or if database operation fails
 */
export async function getBusinessWithReviews(businessId: number): Promise<(Business & { platform: Platform, reviews: Review[] }) | null> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID: Business ID must be a positive integer');
    }

    try {
        const result = await db.query.businesses.findFirst({
            where: eq(businesses.id, businessId),
            with: {
                platform: true,
                reviews: true
            }
        });

        return result;
    } catch (error) {
        console.error('Error getting business with reviews:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve business: ${error.message}`);
        }
        throw new Error('Failed to retrieve business from the database');
    }
}

/**
 * Updates the lastCheckedAt timestamp for a business
 * 
 * @param businessId - The ID of the business to update
 * @returns A promise that resolves when the update is complete
 * @throws Error if businessId is invalid or if database operation fails
 */
export async function updateBusinessLastChecked(businessId: number): Promise<void> {
    // Input validation
    if (!businessId || businessId <= 0) {
        throw new Error('Invalid business ID: Business ID must be a positive integer');
    }

    try {
        const result = await db
            .update(businesses)
            .set({
                lastCheckedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(businesses.id, businessId));

        // Check if the update affected any rows
        if (result.rowsAffected === 0) {
            throw new Error(`Business with ID ${businessId} not found`);
        }
    } catch (error) {
        console.error('Error updating business last checked timestamp:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to update business: ${error.message}`);
        }
        throw new Error('Failed to update business in the database');
    }
}

/**
 * Creates a new business in the database
 * 
 * @param params - Object containing business data
 * @param params.name - The name of the business
 * @param params.url - The URL of the business
 * @param params.platformId - The ID of the platform the business is on
 * @param params.teamId - The ID of the team the business belongs to
 * @returns A promise that resolves when the business is successfully created
 * @throws Error if any parameters are invalid or if database operation fails
 */
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
}): Promise<void> {
    // Input validation
    if (!name || name.trim() === '') {
        throw new Error('Invalid business name: Name cannot be empty');
    }
    if (!url || url.trim() === '') {
        throw new Error('Invalid business URL: URL cannot be empty');
    }
    if (!platformId || platformId <= 0) {
        throw new Error('Invalid platform ID: Platform ID must be a positive integer');
    }
    if (!teamId || teamId <= 0) {
        throw new Error('Invalid team ID: Team ID must be a positive integer');
    }

    try {
        const result = await db.insert(businesses).values({
            name,
            url,
            platformId,
            teamId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Verify the insert operation was successful
        if (!result) {
            throw new Error('Database insert operation failed to return a result');
        }
    } catch (error) {
        console.error('Error creating business:', error);
        if (error instanceof Error) {
            // Check for specific database errors
            if (error.message.includes('foreign key constraint')) {
                throw new Error('Failed to create business: The specified platform or team does not exist');
            }
            if (error.message.includes('unique constraint')) {
                throw new Error('Failed to create business: A business with this URL already exists');
            }
            throw new Error(`Failed to create business: ${error.message}`);
        }
        throw new Error('Failed to create business in the database');
    }
}
