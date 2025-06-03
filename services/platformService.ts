import {db} from "@/lib/db/drizzle";
import {platforms} from "@/lib/db/schema";

export async function getPlatforms() {
    return await db
        .select()
        .from(platforms)
        .orderBy(platforms.name);
}
