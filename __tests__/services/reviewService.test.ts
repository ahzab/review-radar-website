import { getReviewsForBusiness, addReview, getAverageRatingForBusiness, getAllReviewsForBusinessStats, getReviewStats } from '@/services/reviewService';
import { db } from '@/lib/db/drizzle';
import { reviews } from '@/lib/db/schema';
import { eq, desc, avg, count, sql } from 'drizzle-orm';

// Mock the database module
jest.mock('@/lib/db/drizzle', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    then: jest.fn()
  }
}));

describe('reviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReviewsForBusiness', () => {
    it('should return paginated reviews for a business', async () => {
      // Arrange
      const businessId = 1;
      const page = 1;
      const mockReviews = [
        { id: 1, businessId: 1, content: 'Great service!', rating: 5 },
        { id: 2, businessId: 1, content: 'Good experience', rating: 4 }
      ];
      const mockCount = [{ count: 2 }];

      // Mock the Promise.all to return reviews and count
      (Promise.all as jest.Mock) = jest.fn().mockResolvedValue([mockReviews, 2]);

      // Act
      const result = await getReviewsForBusiness(businessId, page);

      // Assert
      expect(result).toEqual({
        reviews: mockReviews,
        totalPages: 1,
        currentPage: 1
      });

      // Verify database calls
      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalledWith(reviews);
      expect(db.where).toHaveBeenCalledWith(expect.any(Function));
      expect(db.orderBy).toHaveBeenCalledWith(expect.any(Function));
      expect(db.limit).toHaveBeenCalledWith(10); // ITEMS_PER_PAGE is 10
      expect(db.offset).toHaveBeenCalledWith(0);
    });

    it('should throw an error for invalid businessId', async () => {
      // Arrange
      const businessId = 0;
      const page = 1;

      // Act & Assert
      await expect(getReviewsForBusiness(businessId, page))
        .rejects
        .toThrow('Invalid business ID: Business ID must be a positive integer');
    });

    it('should throw an error for invalid page number', async () => {
      // Arrange
      const businessId = 1;
      const page = 0;

      // Act & Assert
      await expect(getReviewsForBusiness(businessId, page))
        .rejects
        .toThrow('Invalid page number: Page must be a positive integer');
    });

    it('should handle database errors', async () => {
      // Arrange
      const businessId = 1;
      const page = 1;
      
      // Mock Promise.all to throw an error
      (Promise.all as jest.Mock) = jest.fn().mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getReviewsForBusiness(businessId, page))
        .rejects
        .toThrow('Failed to retrieve reviews: Database error');
    });
  });

  // Additional tests for other functions would follow the same pattern
  // For brevity, I'm including just one function's tests as an example
});