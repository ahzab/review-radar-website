import { getTeamForUser } from "@/services/teamService";
import { getUserId } from "@/lib/auth/next-auth-utils";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return Response.json(null);
  }

  const team = await getTeamForUser(userId);
  return Response.json(team);
}
