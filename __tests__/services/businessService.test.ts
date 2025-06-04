import { getBusinessesForTeam, getBusinessWithReviews, updateBusinessLastChecked, createBusiness } from '@/services/businessService';
import { db } from '@/lib/db/drizzle';
import { businesses, platforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Mock the database module
jest.mock('@/lib/db/drizzle', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    query: {
      businesses: {
        findFirst: jest.fn()
      }
    }
  }
}));

describe('businessService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBusinessesForTeam', () => {
    it('should return businesses for a team', async () => {
      // Arrange
      const teamId = 1;
      const mockBusinesses = [
        { 
          id: 1, 
          name: 'Business 1', 
          url: 'https://business1.com', 
          lastCheckedAt: new Date(),
          platformName: 'Google',
          platformLogoUrl: 'https://google.com/logo.png'
        },
        { 
          id: 2, 
          name: 'Business 2', 
          url: 'https://business2.com', 
          lastCheckedAt: new Date(),
          platformName: 'Yelp',
          platformLogoUrl: 'https://yelp.com/logo.png'
        }
      ];

      // Mock the database response
      (db.select as jest.Mock).mockReturnThis();
      (db.from as jest.Mock).mockReturnThis();
      (db.leftJoin as jest.Mock).mockReturnThis();
      (db.where as jest.Mock).mockReturnThis();
      (db.orderBy as jest.Mock).mockResolvedValue(mockBusinesses);

      // Act
      const result = await getBusinessesForTeam(teamId);

      // Assert
      expect(result).toEqual(mockBusinesses);

      // Verify database calls
      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalledWith(businesses);
      expect(db.leftJoin).toHaveBeenCalledWith(platforms, expect.any(Function));
      expect(db.where).toHaveBeenCalledWith(expect.any(Function));
      expect(db.orderBy).toHaveBeenCalledWith(businesses.createdAt);
    });

    it('should throw an error for invalid teamId', async () => {
      // Arrange
      const teamId = 0;

      // Act & Assert
      await expect(getBusinessesForTeam(teamId))
        .rejects
        .toThrow('Invalid team ID: Team ID must be a positive integer');
    });

    it('should handle database errors', async () => {
      // Arrange
      const teamId = 1;
      
      // Mock the database to throw an error
      (db.orderBy as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getBusinessesForTeam(teamId))
        .rejects
        .toThrow('Failed to retrieve businesses: Database error');
    });
  });

  // Additional tests for other functions would follow the same pattern
  // For brevity, I'm including just one function's tests as an example
});