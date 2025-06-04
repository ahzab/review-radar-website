import { getUserWithTeam } from '@/services/userService';
import { db } from '@/lib/db/drizzle';
import { users, teamMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Mock the database module
jest.mock('@/lib/db/drizzle', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockImplementation(function() {
      return Promise.resolve([
        {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          teamId: 2
        }
      ]);
    })
  }
}));

describe('userService', () => {
  describe('getUserWithTeam', () => {
    it('should return user with team information', async () => {
      // Arrange
      const userId = 1;
      
      // Act
      const result = await getUserWithTeam(userId);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result.user.id).toBe(1);
      expect(result.user.name).toBe('Test User');
      expect(result.user.email).toBe('test@example.com');
      expect(result.teamId).toBe(2);
      
      // Verify that the database was called with the correct parameters
      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalledWith(users);
      expect(db.leftJoin).toHaveBeenCalledWith(teamMembers, expect.any(Function));
      expect(db.where).toHaveBeenCalledWith(expect.any(Function));
      expect(db.limit).toHaveBeenCalledWith(1);
    });
    
    it('should return null if user not found', async () => {
      // Arrange
      const userId = 999;
      
      // Mock the limit function to return an empty array
      (db.limit as jest.Mock).mockImplementationOnce(() => Promise.resolve([]));
      
      // Act
      const result = await getUserWithTeam(userId);
      
      // Assert
      expect(result).toBeNull();
    });
  });
});