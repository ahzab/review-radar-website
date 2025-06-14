import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { and, eq, isNull } from 'drizzle-orm';
import {users} from "@/lib/db/schema";

export async function getUser() {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie?.value) return null;

    const sessionData = await verifyToken(sessionCookie.value);
    if (!sessionData?.user?.id || typeof sessionData.user.id !== 'number') return null;

    if (new Date(sessionData.expires) < new Date()) return null;

    const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
        .limit(1);

    return user ?? null;
}
