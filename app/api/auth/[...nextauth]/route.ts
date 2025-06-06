import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db/drizzle";
import { comparePasswords } from "@/lib/auth/session";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { pgTable, integer, varchar, timestamp, text, serial } from "drizzle-orm/pg-core";

// Custom table function to map next-auth table names to our schema
const customTableFn = (name, columns, extraConfig) => {
  // Map the "user" table to our "users" table
  if (name === "user") {
    // Add emailVerified and image columns with default values
    const modifiedColumns = { ...columns };

    // Handle id column - in our schema it's an integer, but next-auth expects text
    if (modifiedColumns.id) {
      modifiedColumns.id = serial("id").primaryKey();
    }

    if (!modifiedColumns.emailVerified) {
      modifiedColumns.emailVerified = timestamp("email_verified", { mode: "date" });
    }
    if (!modifiedColumns.image) {
      modifiedColumns.image = text("image");
    }
    return pgTable("users", modifiedColumns, extraConfig);
  }

  // For the account table, we need to map the column names
  if (name === "account") {
    // Replace camelCase column names with snake_case
    const modifiedColumns = { ...columns };

    // Handle userId column - in our schema it's an integer, but next-auth might expect text
    if (modifiedColumns.userId) {
      modifiedColumns.userId = integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" });
    }

    if (modifiedColumns.providerAccountId) {
      modifiedColumns.providerAccountId = varchar("provider_account_id", { length: 255 })
        .notNull();
    }
    return pgTable(name, modifiedColumns, extraConfig);
  }

  // For the session table, we need to map the column names
  if (name === "session") {
    // Replace camelCase "userId" with snake_case "user_id"
    // and "sessionToken" with "session_token"
    const modifiedColumns = { ...columns };

    // Handle userId column - in our schema it's an integer, but next-auth might expect text
    if (modifiedColumns.userId) {
      modifiedColumns.userId = integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" });
    }

    if (modifiedColumns.sessionToken) {
      modifiedColumns.sessionToken = varchar("session_token", { length: 255 })
        .notNull()
        .unique();
    }
    return pgTable(name, modifiedColumns, extraConfig);
  }

  // For the verificationToken table, we need to map it to verification_token
  if (name === "verificationToken") {
    return pgTable("verification_token", columns, extraConfig);
  }

  return pgTable(name, columns, extraConfig);
};

export const authOptions = {
  adapter: DrizzleAdapter(db, customTableFn),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user) {
          return null;
        }

        // Verify password
        const isPasswordValid = await comparePasswords(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return the user object that will be saved in the JWT
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // If signing in with Google, we need to create or update the user in our database
      if (account && account.provider === 'google' && user) {
        // The user object here is from Google
        // We need to find or create a user in our database
        const email = user.email;

        if (email) {
          // Check if user exists
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (existingUser.length === 0) {
            // Create new user
            const [newUser] = await db
              .insert(users)
              .values({
                email,
                name: user.name,
                passwordHash: '', // No password for OAuth users
                role: 'owner', // Default role
              })
              .returning();

            if (newUser) {
              token.id = newUser.id.toString();
              token.role = newUser.role;

              // Create a team for the new user
              const [newTeam] = await db
                .insert(teams)
                .values({
                  name: `${email}'s Team`,
                })
                .returning();

              if (newTeam) {
                // Add user to team
                await db
                  .insert(teamMembers)
                  .values({
                    userId: newUser.id,
                    teamId: newTeam.id,
                    role: 'owner',
                  });
              }
            }
          } else {
            // User exists, update token
            token.id = existingUser[0].id.toString();
            token.role = existingUser[0].role;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
