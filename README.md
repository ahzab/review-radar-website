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

## Authentication

### Setting Up Google OAuth

To enable Google authentication in the application, follow these steps:

1. **Create a new project in Google Cloud Console**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Click on the project dropdown at the top of the page
   - Click on "New Project"
   - Enter a name for your project and click "Create"

2. **Configure the OAuth consent screen**
   - In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen"
   - Select "External" as the user type (unless you're using Google Workspace)
   - Fill in the required fields:
     - App name: "Review Radar Dashboard"
     - User support email: Your email
     - Developer contact information: Your email
   - Click "Save and Continue"
   - Add the following scopes:
     - `./auth/userinfo.email`
     - `./auth/userinfo.profile`
     - `openid`
   - Click "Save and Continue"
   - Add test users if needed, then click "Save and Continue"
   - Review your settings and click "Back to Dashboard"

3. **Create OAuth credentials**
   - In the left sidebar, navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" and select "OAuth client ID"
   - Select "Web application" as the application type
   - Name: "Review Radar Dashboard Web Client"
   - Authorized JavaScript origins: Add your application's domain (e.g., `http://localhost:3000` for development)
   - Authorized redirect URIs: Add your application's callback URL (e.g., `http://localhost:3000/api/auth/callback/google`)
   - Click "Create"
   - Note your Client ID and Client Secret

4. **Add credentials to your environment variables**
   - Open your `.env` file
   - Add the following lines:
     ```
     NEXTAUTH_URL=http://localhost:3000
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     ```
   - Replace `your-client-id` and `your-client-secret` with the values from the previous step
   - The NEXTAUTH_URL is required for NextAuth.js to generate the correct callback URL

5. **Restart your application**
   - If your application is running, restart it to apply the new environment variables

### Testing Google Authentication

1. Navigate to your application's sign-in page
2. Click the "Sign in with Google" button
3. You should be redirected to Google's authentication page
4. After authenticating, you should be redirected back to your application and signed in

### Troubleshooting

- **Redirect URI mismatch**: Ensure that the redirect URI in your Google Cloud Console matches the one used by your application (e.g., `http://localhost:3000/api/auth/callback/google`)
- **Invalid client ID**: Double-check that your client ID is correctly set in your environment variables
- **Invalid client secret**: Double-check that your client secret is correctly set in your environment variables
- **Consent screen not configured**: Ensure that you've completed the OAuth consent screen configuration
- **NEXTAUTH_URL not set**: Make sure the NEXTAUTH_URL environment variable is set to your application's base URL (e.g., `http://localhost:3000`)
