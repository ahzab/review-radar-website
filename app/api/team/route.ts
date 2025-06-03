import { getTeamForUser } from "@/services/teamService";

export async function GET() {
  const team = await getTeamForUser();
  return Response.json(team);
}
