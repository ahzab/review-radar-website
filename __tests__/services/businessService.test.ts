import { getBusinessesForTeam, getBusinessWithReviews, updateBusinessLastChecked, createBusiness } from '@/services/businessService';
import { db } from '@/lib/db/drizzle';
import { businesses, platforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Mock the database module
jest.mock('@/lib/db/drizzle', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        leftJoin: jest.fn(() => ({
          where: jest.fn(() => ({
            orderBy: jest.fn()
          }))
        }))
      }))
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn()
      }))
    })),
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn()
      }))
    }))
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

      // Mock the chain of database calls
      const mockOrderBy = jest.fn().mockResolvedValue(mockBusinesses);
      const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });
      const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });
      
      (db.select as jest.Mock).mockImplementation(() => ({
        from: mockFrom,
        leftJoin: mockLeftJoin,
        where: mockWhere,
        orderBy: mockOrderBy
      }));

      // Act
      const result = await getBusinessesForTeam(teamId);

      // Assert
      expect(result).toEqual(mockBusinesses);

      // Verify database calls
      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(businesses);
      expect(mockLeftJoin).toHaveBeenCalledWith(
        platforms, 
        expect.objectContaining({
          queryChunks: expect.arrayContaining([
            expect.objectContaining({ value: expect.any(Array) })
          ])
        })
      );
      expect(mockWhere).toHaveBeenCalledWith(expect.any(Function));
      expect(mockOrderBy).toHaveBeenCalledWith(businesses.createdAt);
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
      const mockOrderBy = jest.fn().mockRejectedValue(new Error('Database error'));
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              orderBy: mockOrderBy
            })
          })
        })
      }));

      // Act & Assert
      await expect(getBusinessesForTeam(teamId))
        .rejects
        .toThrow('Failed to retrieve businesses: Database error');
    });
  });
});