import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import {
  users,
  teams,
  teamMembers,
  platforms,
  businesses,
  reviews,
} from './schema';
import { hashPassword } from '@/lib/auth/session';
import { addDays } from 'date-fns';
import { eq } from 'drizzle-orm';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  // Check if products already exist to avoid duplicates
  const existingProducts = await stripe.products.list({ limit: 10 });
  const baseExists = existingProducts.data.find(p => p.name === 'Base');
  const plusExists = existingProducts.data.find(p => p.name === 'Plus');

  if (!baseExists) {
    const baseProduct = await stripe.products.create({
      name: 'Base',
      description: 'Base subscription plan',
    });

    await stripe.prices.create({
      product: baseProduct.id,
      unit_amount: 800, // $8 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 7,
      },
    });
    console.log('Base product created.');
  } else {
    console.log('Base product already exists.');
  }

  if (!plusExists) {
    const plusProduct = await stripe.products.create({
      name: 'Plus',
      description: 'Plus subscription plan',
    });

    await stripe.prices.create({
      product: plusProduct.id,
      unit_amount: 1200, // $12 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 7,
      },
    });
    console.log('Plus product created.');
  } else {
    console.log('Plus product already exists.');
  }

  console.log('Stripe products and prices setup completed.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  // Check if user already exists
  const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

  let user;
  if (existingUser.length > 0) {
    user = existingUser[0];
    console.log('User already exists, using existing user.');
  } else {
    [user] = await db
        .insert(users)
        .values([
          {
            email: email,
            passwordHash: passwordHash,
            role: 'owner',
          },
        ])
        .returning();
    console.log('Initial user created.');
  }

  // Check if team already exists for this user
  const existingTeamMember = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user.id))
      .limit(1);

  let team;
  if (existingTeamMember.length > 0) {
    const existingTeam = await db
        .select()
        .from(teams)
        .where(eq(teams.id, existingTeamMember[0].teamId))
        .limit(1);
    team = existingTeam[0];
    console.log('Team already exists, using existing team.');
  } else {
    [team] = await db
        .insert(teams)
        .values({
          name: 'Test Team',
        })
        .returning();

    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: user.id,
      role: 'owner',
    });
    console.log('Team and membership created.');
  }

  // --- Platforms ---
  // Check if platforms already exist
  const existingPlatforms = await db.select().from(platforms);
  const googleExists = existingPlatforms.find(p => p.name === 'Google');
  const trustpilotExists = existingPlatforms.find(p => p.name === 'Trustpilot');

  let google, trustpilot;

  if (googleExists && trustpilotExists) {
    google = googleExists;
    trustpilot = trustpilotExists;
    console.log('Platforms already exist, using existing platforms.');
  } else {
    // Always create missing platforms
    const platformsToInsert = [];

    if (!googleExists) {
      platformsToInsert.push({
        name: 'Google',
        baseUrl: 'https://www.google.com/maps/place/',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      });
    }

    if (!trustpilotExists) {
      platformsToInsert.push({
        name: 'Trustpilot',
        baseUrl: 'https://www.trustpilot.com/review/',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Trustpilot_logo_2022.svg',
      });
    }

    let newPlatforms = [];
    if (platformsToInsert.length > 0) {
      newPlatforms = await db
          .insert(platforms)
          .values(platformsToInsert)
          .returning();
      console.log('New platforms created.');
    }

    // Ensure we have both platforms
    google = googleExists || newPlatforms.find(p => p.name === 'Google')!;
    trustpilot = trustpilotExists || newPlatforms.find(p => p.name === 'Trustpilot')!;
  }

  // --- Businesses ---
  const existingBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.teamId, team.id));

  const joesExists = existingBusinesses.find(b => b.name === "Joe's Pizza");
  const brightExists = existingBusinesses.find(b => b.name === 'Bright Dental');

  let business1, business2;

  if (joesExists && brightExists) {
    business1 = joesExists;
    business2 = brightExists;
    console.log('Businesses already exist, using existing businesses.');
  } else {
    // Always create missing businesses
    const businessesToInsert = [];

    if (!joesExists) {
      businessesToInsert.push({
        name: 'Joe\'s Pizza',
        url: 'joes-pizza-new-york',
        platformId: google.id,
        teamId: team.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (!brightExists) {
      businessesToInsert.push({
        name: 'Bright Dental',
        url: 'bright-dental-clinic',
        platformId: trustpilot.id,
        teamId: team.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    let newBusinesses = [];
    if (businessesToInsert.length > 0) {
      newBusinesses = await db
          .insert(businesses)
          .values(businessesToInsert)
          .returning();
      console.log('New businesses created.');
    }

    // Ensure we have both businesses
    business1 = joesExists || newBusinesses.find(b => b.name === "Joe's Pizza")!;
    business2 = brightExists || newBusinesses.find(b => b.name === 'Bright Dental')!;
  }

  // --- Reviews ---
  // Check if reviews already exist for these businesses
  const existingReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.businessId, business1.id));

  if (existingReviews.length === 0) {
    await db.insert(reviews).values([
      {
        businessId: business1.id,
        reviewerName: 'Alice',
        content: 'Great pizza and fast delivery!',
        rating: 5,
        publishedAt: addDays(new Date(), -3),
        createdAt: new Date(),
      },
      {
        businessId: business1.id,
        reviewerName: 'Bob',
        content: 'Tasty but a bit too salty for me.',
        rating: 3,
        publishedAt: addDays(new Date(), -1),
        createdAt: new Date(),
      },
      {
        businessId: business2.id,
        reviewerName: 'Clara',
        content: 'Friendly staff and clean office.',
        rating: 4,
        publishedAt: addDays(new Date(), -2),
        createdAt: new Date(),
      },
    ]);
    console.log('Reviews seeded.');
  } else {
    console.log('Reviews already exist, skipping review creation.');
  }

  await createStripeProducts();
}

seed()
    .catch((error) => {
      console.error('Seed process failed:', error);
      process.exit(1);
    })
    .finally(() => {
      console.log('Seed process finished. Exiting...');
      process.exit(0);
    });