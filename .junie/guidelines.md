# Review Radar Dashboard Development Guidelines

This document provides essential information for developers working on the Review Radar Dashboard project.

## Build/Configuration Instructions

### Prerequisites

- Node.js (latest LTS version recommended)
- PostgreSQL database
- Stripe account (for payment processing)

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update the variables:
   ```
   POSTGRES_URL=postgresql://username:password@localhost:5432/review_radar
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   AUTH_SECRET=your_auth_secret
   ```

3. Run the database setup script:
   ```bash
   npm run db:setup
   ```

4. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Database Management

The project uses Drizzle ORM with PostgreSQL. Here are the available database commands:

- `npm run db:setup` - Set up the database environment
- `npm run db:seed` - Seed the database with initial data
- `npm run db:generate` - Generate migration files based on schema changes
- `npm run db:migrate` - Apply migrations to the database
- `npm run db:studio` - Open Drizzle Studio for database management

## Testing Information

### Testing Setup

The project uses Jest for testing. The testing configuration is defined in `jest.config.js`.

### Running Tests

- Run all tests:
  ```bash
  npm test
  ```

- Run tests in watch mode (for development):
  ```bash
  npm run test:watch
  ```

- Run tests with coverage report:
  ```bash
  npm run test:coverage
  ```

### Writing Tests

1. Create test files in the `__tests__` directory with the naming convention `*.test.ts`
2. Tests for services should be placed in `__tests__/services/`
3. Use mocks for external dependencies (database, APIs, etc.)

### Example Test

Here's an example of a service test:

```typescript
// __tests__/services/userService.test.ts
import { getUserWithTeam } from '@/services/userService';
import { db } from '@/lib/db/drizzle';
import { users, teamMembers } from '@/lib/db/schema';

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
      expect(result.teamId).toBe(2);
    });
  });
});
```

## Code Style and Development Practices

### Project Structure

- `app/` - Next.js application pages and routes
- `components/` - React components
- `lib/` - Utility functions and libraries
- `services/` - Business logic and data access
- `types/` - TypeScript type definitions
- `__tests__/` - Test files

### Coding Standards

1. **TypeScript**: Use strict typing for all functions and components
2. **Error Handling**: Implement proper error handling in all service functions
3. **Naming Conventions**:
   - Use camelCase for variables and functions
   - Use PascalCase for components and types
   - Use snake_case for database fields

4. **Component Structure**:
   - Keep components small and focused
   - Use composition over inheritance
   - Separate UI from business logic

5. **Database Access**:
   - Use Drizzle ORM for all database operations
   - Define proper relations in the schema
   - Use transactions for multi-step operations

### Performance Considerations

1. Implement pagination for list views
2. Use React.memo and useMemo for expensive computations
3. Optimize database queries with proper indexes

### Security Best Practices

1. Validate all user inputs
2. Use proper authentication and authorization
3. Sanitize data before rendering
4. Implement CSRF protection
5. Use environment variables for sensitive information

## Debugging

1. Use the Next.js development server with `npm run dev`
2. Check the console for errors and warnings
3. Use the React Developer Tools browser extension
4. For database issues, use Drizzle Studio with `npm run db:studio`